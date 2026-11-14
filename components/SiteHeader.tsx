'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/lib/data';

const navLinks = [
  { href: '/#projects', title: 'Projects' },
  { href: '/#credentials', title: 'Credentials' },
  { href: '/#about', title: 'About' },
  { href: '/#skills', title: 'Skills' },
  { href: '/#contact', title: 'Contact' },
];

const moreLinks = [
  { href: '/services', icon: '▱', title: 'Services', detail: 'Engineering capabilities' },
  { href: '/github-activity', icon: '⌘', title: 'GitHub Activity', detail: 'Live commits & repo activity' },
  { href: '/experience', icon: '▥', title: 'Experience', detail: 'Career path & milestones' },
  { href: '/lab', icon: '⚗', title: 'Lab', detail: 'Interactive engineering demos' },
  { href: '/principles', icon: '⚙', title: 'Principles', detail: 'SLA & engineering standards' },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [time, setTime] = useState('');
  const [lightTheme, setLightTheme] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Africa/Lagos',
        }).format(new Date())
      );
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  function toggleTheme() {
    const next = !lightTheme;
    setLightTheme(next);
    document.documentElement.setAttribute(
      'data-theme',
      next ? 'light' : 'dark'
    );
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();
    if (!query) return;

    const target = document.getElementById(
      query.toLowerCase().replace(/\s+/g, '-')
    );

    target?.scrollIntoView({ behavior: 'smooth' });
    setSearchOpen(false);
    setSearch('');
  }

  return (
    <header className="topbar">
      <a className="brand" href="/">
        <span className="brand-mark">S</span>
        <span>
          silas<span className="muted">.dev</span>
        </span>
      </a>

      <nav className="main-navigation" aria-label="Main navigation">
        <a className="nav-home" href="/">Home</a>

        {navLinks.map((item) => (
          <a href={item.href} key={item.href}>
            {item.title}
          </a>
        ))}

        <div className="nav-dropdown">
          <button
            type="button"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((value) => !value)}
          >
            More <span>⌄</span>
          </button>

          {moreOpen && (
            <div className="dropdown-menu">
              {moreLinks.map((item) => (
                <a
                  href={item.href}
                  key={item.href}
                  onClick={() => setMoreOpen(false)}
                >
                  <span>{item.icon} </span>
                  <span>{item.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="header-tools">
        <div className="search-wrapper">
          {searchOpen && (
            <form onSubmit={handleSearch}>
              <input
                className="header-search-input"
                type="search"
                placeholder="Search sections..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                autoFocus
              />
            </form>
          )}

          <button
            type="button"
            className="header-tool search-button"
            onClick={() => setSearchOpen((value) => !value)}
            aria-label="Search"
          >
            <span>⌕</span>
            Search
          </button>
        </div>

        <div className="clock-display">
          <span className="clock-icon">◷</span>
          <span>WAT {time}</span>
        </div>

        <button
          type="button"
          className="header-tool theme-button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {lightTheme ? '☀' : '☾'}
        </button>

        <a
          className="header-tool download-button"
          href="/Momoh_Silas_Enemona_CV.pdf"
          download
        >
          <span>↓</span>
          Download CV
        </a>

        <a className="hire-button" href={`mailto:${profile.email}`}>
          Hire Me <span />
        </a>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          ☰
        </button>
      </div>

      {mobileOpen && (
        <nav className="mobile-navigation" aria-label="Mobile navigation">
          <a href="/" onClick={() => setMobileOpen(false)}>Home</a>

          {navLinks.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={() => setMobileOpen(false)}
            >
              {item.title}
            </a>
          ))}

          {moreLinks.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={() => setMobileOpen(false)}
            >
              {item.title}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}