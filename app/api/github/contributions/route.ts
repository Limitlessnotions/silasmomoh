
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface GitHubContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      login: string;
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: GitHubContributionDay[];
          }[];
        };
      };
    } | null;
  };
  errors?: {
    message: string;
  }[];
}

const CONTRIBUTION_QUERY = `
  query ContributionCalendar(
    $login: String!
    $from: DateTime!
    $to: DateTime!
  ) {
    user(login: $login) {
      login

      contributionsCollection(
        from: $from
        to: $to
      ) {
        contributionCalendar {
          totalContributions

          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`;

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const token = process.env.GITHUB_TOKEN?.trim();

  if (!token) {
    console.error('GitHub API: GITHUB_TOKEN is missing.');

    return errorResponse(
      'GITHUB_TOKEN is missing from the server environment.',
      500
    );
  }

  const username =
    request.nextUrl.searchParams.get('username') ||
    'Limitlessnotions';

  const requestedDays = Number(
    request.nextUrl.searchParams.get('days') || 365
  );

  const allowedPeriods = [90, 180, 365];

  const days = allowedPeriods.includes(requestedDays)
    ? requestedDays
    : 365;

  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return errorResponse('Invalid GitHub username.', 400);
  }

  // Use complete UTC calendar days.
  const to = new Date();
  to.setUTCHours(23, 59, 59, 999);

  const from = new Date(to);
  from.setUTCHours(0, 0, 0, 0);
  from.setUTCDate(from.getUTCDate() - (days - 1));

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Limitless-Portfolio',
      },

      body: JSON.stringify({
        query: CONTRIBUTION_QUERY,
        variables: {
          login: username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),

      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });

    let result: GitHubGraphQLResponse;

    try {
      result = await response.json();
    } catch {
      console.error(
        'GitHub returned an invalid response.'
      );

      return errorResponse(
        'GitHub returned an invalid response.',
        502
      );
    }

    // Handle HTTP errors separately.
    if (!response.ok) {
      const message =
        result.errors?.[0]?.message ||
        `GitHub API request failed with status ${response.status}.`;

      console.error('GitHub HTTP error:', message);

      return errorResponse(
        message,
        response.status >= 400 && response.status < 600
          ? response.status
          : 502
      );
    }

    // GraphQL can return HTTP 200 even when the query fails.
    if (result.errors?.length) {
      const message = result.errors
        .map((error) => error.message)
        .join('; ');

      console.error('GitHub GraphQL errors:', message);

      return errorResponse(
        message || 'Unable to retrieve GitHub contribution data.',
        502
      );
    }

    const user = result.data?.user;

    if (!user) {
      return errorResponse(
        `GitHub user "${username}" was not found or is inaccessible.`,
        404
      );
    }

    const calendar =
      user.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return errorResponse(
        'GitHub did not return contribution calendar data.',
        502
      );
    }

    const contributionDays = calendar.weeks.flatMap(
      (week) => week.contributionDays
    );

    // Keep only dates inside the requested period.
    const startDate = from.toISOString().slice(0, 10);
    const endDate = to.toISOString().slice(0, 10);

    const filteredDays = contributionDays.filter(
      (day) =>
        day.date >= startDate &&
        day.date <= endDate
    );

    const totalFromDays = filteredDays.reduce(
      (total, day) => total + day.contributionCount,
      0
    );

    const responseData = {
      username: user.login,

      // GitHub's own calendar total.
      totalContributions: calendar.totalContributions,

      // Daily contribution data for the heatmap.
      days: filteredDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        weekday: day.weekday,
      })),

      period: days,

      // Useful for debugging and verification.
      dateRange: {
        from: startDate,
        to: endDate,
      },

      // Sum of the daily counts returned in the requested period.
      calculatedTotal: totalFromDays,

      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        Pragma: 'no-cache',
      },
    });
  } catch (error) {
    console.error('GitHub contribution route error:', error);

    if (
      error instanceof Error &&
      error.name === 'TimeoutError'
    ) {
      return errorResponse(
        'Request timed out. Please try again.',
        504
      );
    }

    return errorResponse(
      'Failed to connect to GitHub.',
      502
    );
  }
}
