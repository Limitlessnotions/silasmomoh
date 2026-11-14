
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Period = 90 | 180 | 365;
type Tab = 'all' | 'heatmap' | 'commits' | 'repositories';

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
};

type Commit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    } | null;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  repositoryName: string;
  branch: string;
};

type Profile = {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
};

type ContributionDay = {
  date: string;
  count: number;
  weekday: number;
};

type ContributionResponse = {
  username: string;
  totalContributions: number;
  calculatedTotal: number;
  period: number;
  days: ContributionDay[];
  dateRange: {
    from: string;
    to: string;
  };
  updatedAt: string;
};

type CalendarWeek = {
  days: (ContributionDay | null)[];
  monthLabel: string;
};

const API = 'https://api.github.com';
const USERNAME = 'Limitlessnotions';

const PERIODS: { value: Period; label: string }[] = [
  { value: 365, label: '12 Months' },
  { value: 180, label: '6 Months' },
  { value: 90, label: '90 Days' },
];

const TABS: { value: Tab; label: string }[] = [
  { value: 'all', label: 'All Activity' },
  { value: 'heatmap', label: 'Contribution Heatmap' },
  { value: 'commits', label: 'Commits' },
  { value: 'repositories', label: 'Repositories' },
];

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function timeAgo(date: string) {
  const days = Math.floor(
    (Date.now() - new Date(date).getTime()) / 86400000
  );

  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);

  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;

  return `${Math.floor(months / 12)} years ago`;
}

function getIntensity(count: number) {
  if (count === 0) return 'level-0';
  if (count <= 3) return 'level-1';
  if (count <= 6) return 'level-2';
  if (count <= 9) return 'level-3';
  return 'level-4';
}

function getBranch(ref?: string) {
  if (!ref) return 'main';
  return ref.split('/').pop() || 'main';
}

function buildCalendarWeeks(
  days: ContributionDay[]
): CalendarWeek[] {
  if (!days.length) return [];

  const sortedDays = [...days].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const firstDate = new Date(`${sortedDays[0].date}T12:00:00`);
  const lastDate = new Date(
    `${sortedDays[sortedDays.length - 1].date}T12:00:00`
  );

  // Align the calendar to Sunday, like GitHub's contribution graph.
  const calendarStart = new Date(firstDate);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());

  const calendarEnd = new Date(lastDate);
  calendarEnd.setDate(
    calendarEnd.getDate() + (6 - calendarEnd.getDay())
  );

  const dayMap = new Map(
    sortedDays.map((day) => [day.date, day])
  );

  const weeks: CalendarWeek[] = [];
  const cursor = new Date(calendarStart);

  while (cursor <= calendarEnd) {
    const weekDays: (ContributionDay | null)[] = [];

    for (let weekday = 0; weekday < 7; weekday++) {
      const key = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, '0'),
        String(cursor.getDate()).padStart(2, '0'),
      ].join('-');

      weekDays.push(dayMap.get(key) || null);
      cursor.setDate(cursor.getDate() + 1);
    }

    const firstRealDay = weekDays.find(
      (day): day is ContributionDay => day !== null
    );

    const previousWeek = weeks[weeks.length - 1];
    const previousMonth = previousWeek?.days.find(
      (day): day is ContributionDay => day !== null
    );

    let monthLabel = '';

    if (firstRealDay) {
      const currentMonth = Number(firstRealDay.date.slice(5, 7));
      const previousMonthNumber = previousMonth
        ? Number(previousMonth.date.slice(5, 7))
        : -1;

      if (!previousWeek || currentMonth !== previousMonthNumber) {
        monthLabel = new Date(
          `${firstRealDay.date}T12:00:00`
        ).toLocaleDateString('en-US', { month: 'short' });
      }
    }

    weeks.push({
      days: weekDays,
      monthLabel,
    });
  }

  return weeks;
}

export default function GitHubPanel({
  username = USERNAME,
  profileUrl = `https://github.com/${USERNAME}`,
}: {
  username?: string;
  profileUrl?: string;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [contributions, setContributions] =
    useState<ContributionResponse | null>(null);

  const [status, setStatus] = useState<
    'loading' | 'ready' | 'error'
  >('loading');

  const [contributionStatus, setContributionStatus] = useState<
    'loading' | 'ready' | 'error'
  >('loading');

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [period, setPeriod] = useState<Period>(365);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showAllCommits, setShowAllCommits] = useState(false);
  const [showAllRepos, setShowAllRepos] = useState(false);

  const loadContributions = useCallback(async () => {
    setContributionStatus('loading');

    try {
      const response = await fetch(
        `/api/github/contributions?username=${encodeURIComponent(
          username
        )}&days=${period}`,
        {
          cache: 'no-store',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to load GitHub contributions.'
        );
      }

      setContributions(data);
      setContributionStatus('ready');
    } catch (error) {
      console.error('GitHub contribution error:', error);
      setContributionStatus('error');
    }
  }, [username, period]);

  const loadGitHubData = useCallback(async () => {
    setStatus('loading');

    try {
      const headers = {
        Accept: 'application/vnd.github+json',
      };

      const [profileResponse, reposResponse] = await Promise.all([
        fetch(`${API}/users/${username}`, { headers }),
        fetch(
          `${API}/users/${username}/repos?sort=pushed&direction=desc&per_page=100`,
          { headers }
        ),
      ]);

      if (!profileResponse.ok) {
        throw new Error('GitHub profile unavailable.');
      }

      if (!reposResponse.ok) {
        throw new Error('GitHub repositories unavailable.');
      }

      const profileData: Profile = await profileResponse.json();
      const repoData: Repo[] = await reposResponse.json();

      setProfile(profileData);
      setRepos(repoData);

      // Fetch recent commits from recently pushed repositories.
      const commitResults = await Promise.allSettled(
        repoData.slice(0, 8).map(async (repo) => {
          const response = await fetch(
            `${API}/repos/${username}/${repo.name}/commits?per_page=5`,
            { headers }
          );

          if (!response.ok) return [];

          const data = await response.json();

          return data.map((commit: any) => ({
            ...commit,
            repositoryName: repo.name,
            branch: repo.default_branch || 'main',
          }));
        })
      );

      const allCommits = commitResults.flatMap((result) =>
        result.status === 'fulfilled' ? result.value : []
      );

      allCommits.sort(
        (a, b) =>
          new Date(b.commit.author?.date || 0).getTime() -
          new Date(a.commit.author?.date || 0).getTime()
      );

      setCommits(allCommits.slice(0, 10));
      setLastUpdated(new Date());
      setStatus('ready');
    } catch (error) {
      console.error('GitHub dashboard error:', error);
      setStatus('error');
    }
  }, [username]);

  useEffect(() => {
    loadGitHubData();
  }, [loadGitHubData]);

  useEffect(() => {
    loadContributions();
  }, [loadContributions]);

  const contributionDays = contributions?.days || [];

  const activityTotal = contributionDays.reduce(
    (total, day) => total + day.count,
    0
  );

  const activeDays = contributionDays.filter(
    (day) => day.count > 0
  ).length;

  const longestStreak = useMemo(() => {
    let longest = 0;
    let current = 0;

    contributionDays.forEach((day) => {
      if (day.count > 0) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    });

    return longest;
  }, [contributionDays]);

  const peakDay = useMemo(() => {
    return contributionDays.reduce(
      (best, day) =>
        day.count > best.count ? day : best,
      { date: '', count: 0, weekday: 0 }
    );
  }, [contributionDays]);

  const selectedActivity = contributionDays.find(
    (day) => day.date === selectedDay
  );

  const weeks = useMemo(
    () => buildCalendarWeeks(contributionDays),
    [contributionDays]
  );

  const filteredCommits = commits.filter((commit) => {
    const query = search.toLowerCase();

    return (
      commit.commit.message.toLowerCase().includes(query) ||
      commit.repositoryName.toLowerCase().includes(query) ||
      commit.branch.toLowerCase().includes(query)
    );
  });

  const filteredRepos = repos.filter((repo) => {
    const query = search.toLowerCase();

    return (
      repo.name.toLowerCase().includes(query) ||
      (repo.description || '').toLowerCase().includes(query) ||
      (repo.language || '').toLowerCase().includes(query)
    );
  });

  const primaryLanguage =
    repos.find((repo) => repo.language)?.language || 'Not specified';

  const displayedCommits = showAllCommits
    ? filteredCommits
    : filteredCommits.slice(0, 3);

  const displayedRepos = showAllRepos
    ? filteredRepos
    : filteredRepos.slice(0, 3);

  const reloadAll = () => {
    loadGitHubData();
    loadContributions();
  };

  return (
    <div className="gh-dashboard">
      <style jsx>{`
        .gh-dashboard {
          width: 100%;
          color: #edf1f2;
          font-family: var(--sans), Arial, sans-serif;
        }

        .gh-dashboard * {
          box-sizing: border-box;
        }

        .gh-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 1px solid #242c34;
          flex-wrap: wrap;
        }

        .gh-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #b8f36b;
          font: 10px var(--mono), monospace;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .gh-title {
          font: 800 clamp(22px, 3vw, 30px) var(--display), sans-serif;
          letter-spacing: -1px;
          margin: 0 0 7px;
        }

        .gh-description {
          color: #929da5;
          font-size: 12px;
          line-height: 1.7;
          max-width: 650px;
          margin: 0;
        }

        .gh-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .gh-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: 1px solid #303a40;
          background: #101419;
          color: #edf1f2;
          border-radius: 8px;
          padding: 9px 12px;
          font: 600 10px var(--sans), sans-serif;
          text-decoration: none;
          cursor: pointer;
          transition: .2s ease;
        }

        .gh-button:hover {
          border-color: #b8f36b;
          color: #b8f36b;
        }

        .gh-button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .gh-button.primary {
          background: #b8f36b;
          border-color: #b8f36b;
          color: #090b0e;
        }

        .gh-button.primary:hover {
          background: #c8ff80;
          border-color: #c8ff80;
        }

        .gh-live {
          color: #b8f36b;
          border: 1px solid #536b43;
          background: #101710;
          border-radius: 30px;
          padding: 8px 12px;
          font: 10px var(--mono), monospace;
        }

        .gh-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #b8f36b;
          border-radius: 50%;
          margin-right: 7px;
        }

        .gh-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin: 25px 0 30px;
        }

        .gh-stat {
          background: #101419;
          border: 1px solid #242c34;
          border-radius: 11px;
          padding: 17px;
          min-width: 0;
        }

        .gh-stat span {
          display: block;
          color: #929da5;
          font: 10px var(--mono), monospace;
          margin-bottom: 8px;
        }

        .gh-stat strong {
          display: block;
          color: #edf1f2;
          font: 800 22px var(--mono), monospace;
          overflow-wrap: anywhere;
        }

        .gh-stat .green {
          color: #b8f36b;
        }

        .gh-toolbar {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .gh-tabs {
          display: flex;
          gap: 3px;
          background: #101419;
          border: 1px solid #242c34;
          padding: 4px;
          border-radius: 9px;
          flex-wrap: wrap;
        }

        .gh-tab {
          border: 0;
          background: transparent;
          color: #c5ccce;
          border-radius: 6px;
          padding: 8px 11px;
          font-size: 10px;
          cursor: pointer;
          white-space: nowrap;
        }

        .gh-tab:hover {
          color: #b8f36b;
        }

        .gh-tab.active {
          background: #b8f36b;
          color: #090b0e;
          font-weight: 700;
        }

        .gh-search {
          background: #101419;
          border: 1px solid #303a40;
          color: #edf1f2;
          border-radius: 8px;
          padding: 10px 12px;
          width: 260px;
          max-width: 100%;
          font: 11px var(--mono), monospace;
          outline: none;
        }

        .gh-search::placeholder {
          color: #929da5;
        }

        .gh-search:focus {
          border-color: #b8f36b;
        }

        .gh-panel {
          background: #101419;
          border: 1px solid #242c34;
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 30px;
        }

        .gh-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding-bottom: 18px;
          border-bottom: 1px solid #242c34;
          flex-wrap: wrap;
        }

        .gh-panel-heading h3 {
          font: 700 16px var(--mono), monospace;
          margin: 0 0 5px;
        }

        .gh-panel-heading p {
          font-size: 10px;
          color: #929da5;
          margin: 0;
        }

        .gh-periods {
          display: flex;
          background: #090b0e;
          border: 1px solid #303a40;
          border-radius: 8px;
          padding: 3px;
        }

        .gh-periods button {
          background: transparent;
          border: 0;
          color: #c5ccce;
          font: 10px var(--mono), monospace;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .gh-periods button:hover {
          color: #b8f36b;
        }

        .gh-periods button.active {
          background: #b8f36b;
          color: #090b0e;
        }

        .gh-heat-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          margin: 19px 0 22px;
        }

        .gh-heat-stat {
          background: #090b0e;
          border: 1px solid #303a40;
          border-radius: 10px;
          padding: 13px;
          min-width: 0;
        }

        .gh-heat-stat span {
          display: block;
          font: 9px var(--mono), monospace;
          color: #929da5;
          margin-bottom: 8px;
        }

        .gh-heat-stat strong {
          font: 700 18px var(--mono), monospace;
          color: #edf1f2;
        }

        .gh-heat-stat .lime {
          color: #b8f36b;
        }

        .gh-heatmap-scroll {
          overflow-x: auto;
          padding: 6px 0 10px;
        }

        .gh-calendar {
          min-width: 650px;
          width: 100%;
        }

        .gh-months {
          display: grid;
          grid-auto-columns: minmax(0, 1fr);
          grid-auto-flow: column;
          gap: 4px;
          margin-left: 30px;
          margin-bottom: 8px;
        }

        .gh-months span {
          color: #c5ccce;
          font: 9px var(--mono), monospace;
          min-width: 0;
        }

        .gh-calendar-body {
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr);
          gap: 6px;
        }

        .gh-weekdays {
          display: grid;
          grid-template-rows: repeat(7, 13px);
          gap: 4px;
          color: #929da5;
          font: 9px var(--mono), monospace;
          align-items: center;
        }

        .gh-weekdays span {
          height: 13px;
          display: flex;
          align-items: center;
        }

        .gh-weeks {
          display: grid;
          grid-auto-columns: minmax(8px, 1fr);
          grid-auto-flow: column;
          gap: 4px;
        }

        .gh-week {
          display: grid;
          grid-template-rows: repeat(7, 13px);
          gap: 4px;
        }

        .gh-heat-cell {
          width: 100%;
          min-width: 0;
          height: 13px;
          padding: 0;
          border: 1px solid #242c34;
          border-radius: 3px;
          cursor: pointer;
          background: #192126;
        }

        .gh-heat-cell.level-0 {
          background: #192126;
          border-color: #242c34;
        }

        .gh-heat-cell.level-1 {
          background: #36552b;
          border-color: #36552b;
        }

        .gh-heat-cell.level-2 {
          background: #557e37;
          border-color: #557e37;
        }

        .gh-heat-cell.level-3 {
          background: #85b94b;
          border-color: #85b94b;
        }

        .gh-heat-cell.level-4 {
          background: #b8f36b;
          border-color: #b8f36b;
        }

        .gh-heat-cell:hover,
        .gh-heat-cell.selected {
          outline: 2px solid #edf1f2;
          outline-offset: 1px;
        }

        .gh-heat-legend {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 5px;
          font: 9px var(--mono), monospace;
          color: #929da5;
          margin-top: 14px;
        }

        .gh-heat-legend span {
          width: 10px;
          height: 10px;
          display: inline-block;
          border-radius: 2px;
        }

        .gh-selected {
          margin-top: 15px;
          padding: 15px;
          border: 1px solid #536b43;
          background: #101710;
          border-radius: 9px;
          font-size: 11px;
        }

        .gh-selected strong {
          color: #b8f36b;
          font-family: var(--mono), monospace;
        }

        .gh-selected p {
          color: #c5ccce;
          margin: 7px 0;
        }

        .gh-data-note {
          margin-top: 17px;
          color: #929da5;
          font: 9px/1.7 var(--mono), monospace;
        }

        .gh-bottom-grid {
          display: grid;
          grid-template-columns: 1.2fr .9fr;
          gap: 18px;
        }

        .gh-section {
          min-width: 0;
        }

        .gh-section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 13px;
          font: 700 12px var(--mono), monospace;
          color: #edf1f2;
        }

        .gh-section-title span {
          color: #929da5;
          font-size: 9px;
        }

        .gh-view-all {
          border: 0;
          padding: 4px 0;
          background: transparent;
          color: #b8f36b;
          font: 10px var(--mono), monospace;
          cursor: pointer;
        }

        .gh-view-all:hover {
          color: #d0ff9a;
        }

        .gh-commit,
        .gh-repo {
          background: #101419;
          border: 1px solid #242c34;
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 10px;
          min-width: 0;
        }

        .gh-commit-top,
        .gh-repo-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .gh-repo-name {
          color: #b8f36b;
          font: 10px var(--mono), monospace;
        }

        .gh-branch {
          background: #172016;
          border: 1px solid #536b43;
          color: #b8f36b;
          border-radius: 5px;
          padding: 4px 7px;
          font: 9px var(--mono), monospace;
        }

        .gh-commit h4,
        .gh-repo h4 {
          font-size: 12px;
          margin: 10px 0 5px;
          overflow-wrap: anywhere;
        }

        .gh-commit p,
        .gh-repo p {
          font-size: 10px;
          color: #929da5;
          margin: 0;
          line-height: 1.6;
        }

        .gh-commit-footer,
        .gh-repo-footer {
          border-top: 1px solid #242c34;
          margin-top: 11px;
          padding-top: 9px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          font: 9px var(--mono), monospace;
          color: #929da5;
        }

        .gh-commit-footer a,
        .gh-repo-footer a {
          color: #b8f36b;
          text-decoration: none;
        }

        .gh-language {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #c5ccce;
          font-size: 9px;
        }

        .gh-language-dot {
          width: 7px;
          height: 7px;
          background: #b8f36b;
          border-radius: 50%;
        }

        .gh-empty,
        .gh-state {
          color: #929da5;
          font-size: 11px;
          padding: 22px 5px;
          text-align: center;
        }

        .gh-loading {
          color: #b8f36b;
          font: 11px var(--mono), monospace;
          padding: 30px;
          text-align: center;
        }

        .gh-footer {
          border-top: 1px solid #242c34;
          padding-top: 17px;
          margin-top: 25px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          color: #929da5;
          font: 9px var(--mono), monospace;
        }

        .gh-footer a {
          color: #b8f36b;
          text-decoration: none;
        }

        @media (max-width: 760px) {
          .gh-stats,
          .gh-heat-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .gh-bottom-grid {
            grid-template-columns: 1fr;
          }

          .gh-panel {
            padding: 15px;
          }

          .gh-search {
            width: 100%;
          }

          .gh-toolbar {
            align-items: stretch;
          }
        }

        @media (max-width: 460px) {
          .gh-stats,
          .gh-heat-stats {
            grid-template-columns: 1fr 1fr;
          }

          .gh-stat {
            padding: 12px;
          }

          .gh-stat strong {
            font-size: 18px;
          }

          .gh-tab {
            font-size: 9px;
            padding: 8px;
          }

          .gh-periods button {
            font-size: 9px;
            padding: 7px;
          }

          .gh-panel-heading {
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="gh-top">
        <div>
          <div className="gh-eyebrow">
            <span>◈</span>
            TELEMETRY & ENGINEERING ACTIVITY
          </div>

          <h2 className="gh-title">GitHub Activity Stream</h2>

          <p className="gh-description">
            Live repository data, recent commits and contribution
            history fetched from GitHub.
          </p>
        </div>

        <div className="gh-actions">
          <span className="gh-live">
            <span className="gh-dot" />
            {status === 'loading'
              ? 'Connecting'
              : status === 'error'
                ? 'Unavailable'
                : 'Live API Feed'}
          </span>

          <button
            className="gh-button"
            onClick={reloadAll}
            disabled={status === 'loading'}
          >
            ↻ Sync
          </button>

          <a
            className="gh-button primary"
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
          >
            ◈ @{username} ↗
          </a>
        </div>
      </div>

      {status === 'loading' && !profile ? (
        <div className="gh-loading">
          Connecting to GitHub API...
        </div>
      ) : status === 'error' && !profile ? (
        <div className="gh-state">
          GitHub data could not be loaded. Check your connection
          or visit the public profile directly.
          <br />
          <button
            className="gh-button"
            style={{ marginTop: 14 }}
            onClick={reloadAll}
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="gh-stats">
            <div className="gh-stat">
              <span>Public Repositories</span>
              <strong>{profile?.public_repos ?? '—'}</strong>
            </div>

            <div className="gh-stat">
              <span>Recent Commits</span>
              <strong className="green">{commits.length} Logged</strong>
            </div>

            <div className="gh-stat">
              <span>Primary Stack</span>
              <strong style={{ fontSize: 15 }}>
                {primaryLanguage}
              </strong>
            </div>

            <div className="gh-stat">
              <span>API Status</span>
              <strong className="green">
                ● {status === 'ready' ? 'Connected' : 'Syncing'}
              </strong>
            </div>
          </div>

          <div className="gh-toolbar">
            <div className="gh-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  className={`gh-tab ${
                    activeTab === tab.value ? 'active' : ''
                  }`}
                  onClick={() => {
                    setActiveTab(tab.value);
                    setSelectedDay(null);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <input
              className="gh-search"
              placeholder="⌕ Filter commits or repos..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowAllCommits(false);
                setShowAllRepos(false);
              }}
              aria-label="Filter commits and repositories"
            />
          </div>

          {(activeTab === 'all' || activeTab === 'heatmap') && (
            <div className="gh-panel">
              <div className="gh-panel-heading">
                <div>
                  <h3>▦ Contribution Heatmap</h3>
                  <p>
                    Your GitHub contribution activity returned by
                    the GraphQL API.
                  </p>
                </div>

                <div className="gh-periods">
                  {PERIODS.map((item) => (
                    <button
                      key={item.value}
                      className={
                        period === item.value ? 'active' : ''
                      }
                      onClick={() => {
                        setPeriod(item.value);
                        setSelectedDay(null);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {contributionStatus === 'loading' &&
              !contributions ? (
                <div className="gh-loading">
                  Loading contribution calendar...
                </div>
              ) : contributionStatus === 'error' &&
                !contributions ? (
                <div className="gh-state">
                  Contribution data could not be loaded.
                  <br />
                  Check your GITHUB_TOKEN and API route.
                  <br />
                  <button
                    className="gh-button"
                    style={{ marginTop: 12 }}
                    onClick={loadContributions}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className="gh-heat-stats">
                    <div className="gh-heat-stat">
                      <span>Contributions in Period</span>
                      <strong>
                        {contributions?.totalContributions ?? 0}
                      </strong>
                    </div>

                    <div className="gh-heat-stat">
                      <span>Days with Contributions</span>
                      <strong className="lime">
                        {activeDays} Days
                      </strong>
                    </div>

                    <div className="gh-heat-stat">
                      <span>Longest Consecutive Streak</span>
                      <strong className="lime">
                        {longestStreak} Days
                      </strong>
                    </div>

                    <div className="gh-heat-stat">
                      <span>Peak Day</span>
                      <strong>
                        {peakDay.count > 0
                          ? `${peakDay.count} Contributions`
                          : '—'}
                      </strong>
                    </div>
                  </div>

                  <div className="gh-heatmap-scroll">
                    <div className="gh-calendar">
                      <div className="gh-months">
                        {weeks.map((week, index) => (
                          <span key={index}>
                            {week.monthLabel}
                          </span>
                        ))}
                      </div>

                      <div className="gh-calendar-body">
                        <div className="gh-weekdays">
                          <span />
                          <span>Mon</span>
                          <span />
                          <span>Wed</span>
                          <span />
                          <span>Fri</span>
                          <span />
                        </div>

                        <div className="gh-weeks">
                          {weeks.map((week, weekIndex) => (
                            <div
                              className="gh-week"
                              key={weekIndex}
                            >
                              {week.days.map((day, dayIndex) => (
                                day ? (
                                  <button
                                    key={day.date}
                                    className={`gh-heat-cell ${getIntensity(
                                      day.count
                                    )} ${
                                      selectedDay === day.date
                                        ? 'selected'
                                        : ''
                                    }`}
                                    title={`${day.date}: ${day.count} contributions`}
                                    aria-label={`${day.date}: ${day.count} contributions`}
                                    onClick={() =>
                                      setSelectedDay(
                                        selectedDay === day.date
                                          ? null
                                          : day.date
                                      )
                                    }
                                  />
                                ) : (
                                  <span
                                    key={`empty-${weekIndex}-${dayIndex}`}
                                  />
                                )
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="gh-heat-legend">
                    Less
                    <span style={{ background: '#192126' }} />
                    <span style={{ background: '#36552b' }} />
                    <span style={{ background: '#557e37' }} />
                    <span style={{ background: '#85b94b' }} />
                    <span style={{ background: '#b8f36b' }} />
                    More
                  </div>

                  {selectedDay && selectedActivity && (
                    <div className="gh-selected">
                      <strong>{formatDate(selectedDay)}</strong>
                      <p>
                        {selectedActivity.count} contribution(s)
                        recorded.
                      </p>
                    </div>
                  )}

                  <p className="gh-data-note">
                    Contribution counts are supplied by GitHub's
                    contribution calendar.
                    {` ${contributions?.dateRange.to}.`}
                  </p>
                </>
              )}
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'commits') && (
            <div className="gh-section">
              <div className="gh-section-title">
                <div>⌁ RECENT COMMITS</div>
                <button
                  className="gh-view-all"
                  onClick={() => {
                    if (activeTab === 'all') {
                      setActiveTab('commits');
                      setShowAllCommits(true);
                    } else {
                      setShowAllCommits((value) => !value);
                    }
                  }}
                >
                  {activeTab === 'all'
                    ? `View All (${filteredCommits.length}) →`
                    : showAllCommits
                      ? 'Show Less ↑'
                      : `View All (${filteredCommits.length}) →`}
                </button>
              </div>

              {filteredCommits.length === 0 ? (
                <div className="gh-empty">
                  No recent commits matched your search.
                </div>
              ) : (
                <div className="gh-bottom-grid">
                  <div>
                    {displayedCommits.map((commit) => (
                      <article
                        className="gh-commit"
                        key={commit.sha}
                      >
                        <div className="gh-commit-top">
                          <div>
                            <span className="gh-branch">
                              {commit.branch}
                            </span>
                            <span className="gh-repo-name">
                              {' '}
                              {commit.repositoryName}
                            </span>
                          </div>

                          <span className="gh-repo-name">
                            {commit.sha.slice(0, 7)}
                          </span>
                        </div>

                        <h4>
                          {commit.commit.message.split('\n')[0]}
                        </h4>

                        <p>{timeAgo(
                          commit.commit.author?.date ||
                          new Date().toISOString()
                        )}</p>

                        <div className="gh-commit-footer">
                          <span>
                            Committed by{' '}
                            {commit.commit.author?.name ||
                              commit.author?.login ||
                              username}
                          </span>

                          <a
                            href={commit.html_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Inspect Commit ↗
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>

                  {activeTab === 'all' && (
                    <div className="gh-section">
                      <div className="gh-section-title">
                        <div>▣ ACTIVE REPOSITORIES</div>
                        <button
                          className="gh-view-all"
                          onClick={() => {
                            setActiveTab('repositories');
                            setShowAllRepos(true);
                          }}
                        >
                          View All ({filteredRepos.length}) →
                        </button>
                      </div>

                      {filteredRepos.slice(0, 3).map((repo) => (
                        <article
                          className="gh-repo"
                          key={repo.id}
                        >
                          <div className="gh-repo-top">
                            <h4 style={{ margin: 0 }}>
                              ▣ {repo.name}
                            </h4>

                            <span className="gh-repo-name">
                              {timeAgo(repo.pushed_at)}
                            </span>
                          </div>

                          <p style={{ marginTop: 9 }}>
                            {repo.description || 'Public repository'}
                          </p>

                          <div className="gh-repo-footer">
                            <span className="gh-language">
                              <span className="gh-language-dot" />
                              {repo.language || 'Code'}
                            </span>

                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Code ↗
                            </a>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {(activeTab === 'all' ||
            activeTab === 'repositories') && (
            <div
              className="gh-section"
              style={{
                marginTop: activeTab === 'all' ? 30 : 0,
              }}
            >
              {activeTab === 'repositories' && (
                <div className="gh-section-title">
                  <div>▣ ACTIVE REPOSITORIES</div>
                  <span>{filteredRepos.length} items</span>
                </div>
              )}

              {activeTab === 'repositories' &&
                (filteredRepos.length === 0 ? (
                  <div className="gh-empty">
                    No repositories matched your search.
                  </div>
                ) : (
                  <>
                    <div className="gh-bottom-grid">
                      {displayedRepos.map((repo) => (
                        <article
                          className="gh-repo"
                          key={repo.id}
                        >
                          <div className="gh-repo-top">
                            <h4 style={{ margin: 0 }}>
                              ▣ {repo.name}
                            </h4>

                            <span className="gh-repo-name">
                              {timeAgo(repo.pushed_at)}
                            </span>
                          </div>

                          <p style={{ marginTop: 9 }}>
                            {repo.description || 'Public repository'}
                          </p>

                          <div className="gh-repo-footer">
                            <span className="gh-language">
                              <span className="gh-language-dot" />
                              {repo.language || 'Code'}
                            </span>

                            <span>
                              ★ {repo.stargazers_count} · Forks{' '}
                              {repo.forks_count}
                            </span>

                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Code ↗
                            </a>
                          </div>
                        </article>
                      ))}
                    </div>

                    {filteredRepos.length > 3 && (
                      <button
                        className="gh-view-all"
                        onClick={() =>
                          setShowAllRepos((value) => !value)
                        }
                      >
                        {showAllRepos
                          ? 'Show Less ↑'
                          : `View All (${filteredRepos.length}) →`}
                      </button>
                    )}
                  </>
                ))}
            </div>
          )}

          <div className="gh-footer">
            <span>
              {lastUpdated
                ? `LAST SYNCED ${lastUpdated.toLocaleTimeString()}`
                : 'WAITING FOR DATA'}
            </span>

            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
            >
              OPEN GITHUB PROFILE ↗
            </a>
          </div>
        </>
      )}
    </div>
  );
}
