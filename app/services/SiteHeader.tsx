import { profile } from '@/lib/data';

const moreLinks = [
  { href: '/services', icon: '▱', title: 'Services', detail: 'Engineering capabilities' },
  { href: '/github-activity', icon: '⌘', title: 'GitHub Activity', detail: 'Live commits & repo activity' },
  { href: '/experience', icon: '▥', title: 'Experience', detail: 'Career path & milestones' },
  { href: '/lab', icon: '⚗', title: 'Lab', detail: 'Interactive engineering demos' },
  { href: '/principles', icon: '⚙', title: 'Principles', detail: 'SLA & engineering standards' },
];

export default function SiteHeader() {
  return <header className="topbar">
    <a className="brand" href="/"><span className="brand-mark">S</span><span>silas<span className="muted">.dev</span></span></a>
    <nav className="main-nav">
      <a href="/#projects">Projects</a><a href="/#credentials">Credentials</a><a href="/#about">About</a><a href="/#skills">Skills</a><a href="/#contact">Contact</a>
      <div className="more-menu"><button type="button" aria-haspopup="true">More <span>⌄</span></button><div className="more-dropdown">{moreLinks.map(item => <a href={item.href} key={item.href}><span className="more-icon">{item.icon}</span><span><b>{item.title}</b><small>{item.detail}</small></span></a>)}</div></div>
    </nav>
    <a className="nav-cta" href={`mailto:${profile.email}`}>Let’s talk <span>↗</span></a>
  </header>;
}
