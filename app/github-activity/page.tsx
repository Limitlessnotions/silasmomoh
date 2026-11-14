
import SiteHeader from '@/components/SiteHeader';
import GitHubPanel from '@/components/GitHubPanel';

export default function GitHubActivityPage() {
  return (
    <main>
      <SiteHeader />

      <div className="wrap inner-page github-activity-page">
        <a className="back-link" href="/">
          ← Back to Overview
        </a>


        <GitHubPanel
          username="Limitlessnotions"
          profileUrl="https://github.com/Limitlessnotions"
        />
      </div>

      <footer className="footer wrap">
        <a className="brand" href="/">
          <span className="brand-mark">S</span>
          <span>
            silas<span className="muted">.dev</span>
          </span>
        </a>

        <span>BUILD · INTEGRATE · IMPROVE</span>

        <a href="/">BACK TO OVERVIEW ↑</a>
      </footer>
    </main>
  );
}
