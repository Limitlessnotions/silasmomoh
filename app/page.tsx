
import {
  profile,
  projects,
  skillGroups,
  education,
} from '@/lib/data';

import ContactForm from '@/components/ContactForm';
import SiteHeader from '@/components/SiteHeader';
import AnimatedRole from '@/components/AnimatedRole';






function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* NAVIGATION */}
      {/* More dropdown links to independent pages through SiteHeader */}
      <SiteHeader />

      {/* HERO */}
      <section className="hero wrap" id="home">
        <div className="hero-copy">
          <div className="availability">
            <span className="pulse" />
            AVAILABLE FOR SELECT PROJECTS & REMOTE OPPORTUNITIES
          </div>

          <p className="hello">HELLO, I’M</p>

          <h1>
            Silas <span>Momoh.</span>
          </h1>

          <div className="role-line">
            <AnimatedRole />
          </div>

          <p className="hero-intro">
            {profile.headline} {profile.intro}
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              Start a conversation <span>↗</span>
            </a>

            <a
              className="button button-secondary"
              href="/Momoh_Silas_Enemona_CV.pdf"
              download
            >
              Download CV <span>↓</span>
            </a>
          </div>

          <div className="social-line">
            <span>CONNECT</span>

            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>

            <a href={`mailto:${profile.email}`}>
              Email ↗
            </a>
          </div>
        </div>

        {/* ORBITAL PORTRAIT DESIGN */}
        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div
            className="hero-core"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '12px',
            }}
          >
            <span className="core-top">
              SYSTEMS / AUTOMATION / SOFTWARE
            </span>

            <div
              className="portrait-frame"
              style={{
                position: 'relative',
                width: '122px',
                height: '122px',
                flexShrink: 0,
              }}
            >
              <img
                src="/silas.jpeg"
                alt="Portrait of Silas Momoh"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 35%',
                  borderRadius: '50%',
                  border: '2px solid currentColor',
                }}
              />

              <span
                className="pulse"
                style={{
                  position: 'absolute',
                  right: '3px',
                  bottom: '5px',
                  width: '13px',
                  height: '13px',
                  borderRadius: '50%',
                  border: '2px solid #080b0d',
                }}
              />
            </div>

            <div
              className="core-name"
              style={{
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              Silas Momoh
            </div>

            <div
              className="core-role"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              AI AUTOMATION ENGINEER
            </div>

            <span className="core-bottom">
              BUILD · INTEGRATE · IMPROVE
            </span>
          </div>

          <div className="float-card card-ai">
            <span className="float-icon">✳</span>
            <div>
              <b>AI workflows</b>
              <small>Intelligent automation</small>
            </div>
          </div>

          <div className="float-card card-code">
            <span className="float-icon">⌘</span>
            <div>
              <b>Software</b>
              <small>Web & mobile products</small>
            </div>
          </div>

          <div className="visual-index">
            01 / 04
            <span>INDEPENDENT BUILDER</span>
          </div>
        </div>

        <div className="hero-bottom">
          <span>
            BASED IN {profile.location.toUpperCase()}
          </span>

          <span>WORKING WITH TEAMS WORLDWIDE</span>

          <a href="#projects">
            SCROLL TO EXPLORE ↓
          </a>
        </div>
      </section>

      {/* METRICS */}
      <section className="metrics wrap">
        <div>
          <strong>
            24<span>+</span>
          </strong>

          <p>
            Automation projects delivered
            <br />
            <small>As reported in my CV</small>
          </p>
        </div>

        <div>
          <strong>
            2<span>+</span>
          </strong>

          <p>
            Years of hands-on AI automation
            <br />
            <small>Professional experience</small>
          </p>
        </div>

        <div>
          <strong>06</strong>

          <p>
            Core technical disciplines
            <br />
            <small>Across AI and software</small>
          </p>
        </div>

        <div className="metric-note">
          <span className="tiny-dot" />
          Focused on useful, reliable systems — not technology for its own sake.
        </div>
      </section>

    
{/* PROJECTS */}
<section className="section wrap" id="projects">
  <SectionHeading
    eyebrow="SELECTED WORK / 01"
    title="Projects & engineering"
    description="A selection of AI automation systems, integrations, websites and software products I've designed and engineered."
  />

  {/* AI AUTOMATION */}
  <div className="project-category-section">
    <div className="project-category-heading">
      <div>
        <span className="eyebrow">01 / AI ENGINEERING</span>
        <h2>AI Automation & Integrations</h2>
        <p>
          Intelligent workflows, AI agents and connected business
          systems built to solve operational problems.
        </p>
      </div>
    </div>

    <div className="project-grid">
      {projects
        .filter((project) => project.type === 'automation')
        .map((project) => (
          <article className="project-card" key={project.number}>
            <div className="project-top">
              <span>{project.number}</span>

              <span className="project-category">
                {project.category}
              </span>
            </div>

            <div className="project-visual">
              <div className="project-visual-grid" />

              <div className="project-glyph">
                {project.number === '03'
                  ? '↗'
                  : project.number === '04'
                    ? '◎'
                    : project.number === '05'
                      ? '▷'
                      : project.number === '06'
                        ? '✦'
                        : project.number === '07'
                          ? '⌁'
                          : '⇄'}
              </div>

              <span className="visual-caption">
                AUTOMATION / {project.number}
              </span>
            </div>

            <div className="project-content">
              <span className="eyebrow">
                {project.category}
              </span>

              <h3>{project.name}</h3>

              <p>{project.summary}</p>

              <div className="project-detail">
                <b>MY CONTRIBUTION</b>
                <p>{project.contribution}</p>
              </div>

              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="stack-row">
                <span>STACK</span>
                <p>{project.stack.join(' · ')}</p>
              </div>

              {project.href && (
                <div className="project-actions">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Project ↗
                  </a>
                </div>
              )}
            </div>
          </article>
        ))}
    </div>
  </div>

  {/* SOFTWARE DEVELOPMENT */}
  <div className="project-category-section software-projects">
    <div className="project-category-heading">
      <div>
        <span className="eyebrow">02 / SOFTWARE ENGINEERING</span>
        <h2>Websites & Applications</h2>
        <p>
          Websites, mobile applications and production software
          built for real users and businesses.
        </p>
      </div>
    </div>

    <div className="software-project-list">
      {[
        {
          number: '01',
          name: 'Insights & Strategy',
          category: 'BUSINESS WEBSITE',
          description:
            'A professional website for a strategy and insights-focused business.',
          stack: ['Website Development'],
          image: '/insights-strategy.png',
          link: 'https://insightsandstrategy.org/',
        },
        {
          number: '02',
          name: 'Samuel Ikani',
          category: 'PERSONAL / PROFESSIONAL WEBSITE',
          description:
            'A professional online presence designed to communicate expertise, services and personal brand.',
          stack: ['Website Development'],
          image: '/samuel-ikani.png',
          link: 'https://www.samuelikani.org/',
        },
        {
          number: '03',
          name: 'ScoutX',
          category: 'SPORTS PLATFORM · WEB & MOBILE',
          description:
            'A football platform bringing live scores, news, transfer updates, player discovery and opportunities into one connected experience.',
          stack: ['Next.js', 'React', 'Expo', 'Firebase'],
          image: '/scoutx.png',
          link: 'https://scoutx-nine.vercel.app/',
        },
        {
          number: '04',
          name: 'Ask Rae',
          category: 'AI PRODUCT · MOBILE APPLICATION',
          description:
            'An AI-powered personal assistant designed to bring conversations, reminders, planning and everyday life management into one mobile experience.',
          stack: [
            'React Native',
            'Expo',
            'Node.js',
            'Firebase',
            'OpenAI',
          ],
          image: '/ask-rae.png',
          link: 'https://ask-rae.vercel.app/',
          appStore:
            'https://apps.apple.com/us/app/ask-rae/id6803644893',
          playStore:
            'https://play.google.com/store/apps/details?id=com.limitless001.askrae&pcampaignid=web_share',
        },
        {
          number: '05',
          name: 'Fajuzy Clothing',
          category: 'E-COMMERCE · FASHION',
          description:
            'An online fashion store designed to present products and provide customers with a streamlined shopping experience.',
          stack: ['Next.js', 'Web Development'],
          image: '/fajuzy-clothing.png',
          link: 'https://fajuzy-clothing.vercel.app/',
        },
        {
          number: '06',
          name: 'VGS Transport',
          category: 'TRANSPORTATION · WEB APPLICATION',
          description:
            'A digital platform built for a transport business, providing an online interface for its services.',
          stack: ['Web Development'],
          image: '/vgs-transport.png',
          link: 'https://vgs-jade.vercel.app/',
        },
      ].map((project) => (
        <article
          className="software-project-card"
          key={project.number}
        >
          <div className="software-project-image">
            <img
              src={project.image}
              alt={`${project.name} project preview`}
              loading="lazy"
            />

            <span className="software-project-number">
              {project.number} / 06
            </span>
          </div>

          <div className="software-project-content">
            <div className="software-project-meta">
              <span>{project.category}</span>
              <span>LIVE PROJECT ↗</span>
            </div>

            <h3>{project.name}</h3>

            <p>{project.description}</p>

            <div className="tag-row">
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

            <div className="software-project-actions">
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
              >
                Live Demo ↗
              </a>

              {project.appStore && (
                <a
                  href={project.appStore}
                  target="_blank"
                  rel="noreferrer"
                >
                  App Store ↗
                </a>
              )}

              {project.playStore && (
                <a
                  href={project.playStore}
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Play ↗
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

      {/* SKILLS */}
      <section className="section wrap" id="skills">
        <SectionHeading
          eyebrow="TOOLS & CAPABILITIES / 02"
          title="Skills & technologies"
          description="The platforms, languages, and engineering practices I use to design workflows, connect systems, and ship software."
        />

        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <article
              className="skill-card"
              key={group.title}
            >
              <div className="skill-index">
                0{index + 1}
              </div>

              <h3>{group.title}</h3>

              <div className="skill-pills">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
{/* ABOUT */}
<section className="about-section" id="about">
  <div className="wrap">

    {/* PROFILE OVERVIEW */}
    <div className="about-profile-card">
      <div className="about-profile-header">
        <div className="about-profile-identity">
          <div className="about-avatar">SM</div>

          <div>
            <h3>Momoh Silas Enemona</h3>
            <span>AI Automation Engineer & Software Developer</span>
          </div>
        </div>

        <div className="about-profile-badge">
          <span />
          Open to Projects & Collaborations
        </div>
      </div>

      <div className="about-profile-divider" />

      <div className="about-profile-details">
        <div className="about-detail">
          <span className="about-detail-label">WHO I AM</span>
          <p>
            An AI Automation Engineer and Software Developer
            building intelligent workflows, connected systems,
            and practical digital products.
          </p>
        </div>

        <div className="about-detail">
          <span className="about-detail-label">WHAT I DO</span>
          <p>
            AI-powered automation, conversational AI, API
            integrations, backend systems, and web and mobile
            application development.
          </p>
        </div>

        <div className="about-detail">
          <span className="about-detail-label">MY APPROACH</span>
          <p>
            I focus on understanding the actual problem, designing
            the right solution, and building systems that work
            reliably in real operating environments.
          </p>
        </div>

        <div className="about-detail">
          <span className="about-detail-label">BASED IN</span>
          <p>Abuja, Nigeria · Working remotely with global clients.</p>
        </div>
      </div>
    </div>

    {/* ABOUT CONTENT */}
    <div className="about-main-grid">

      {/* LEFT COLUMN */}
      <div className="about-left-column">
        <div className="about-story-card">
          <span className="eyebrow">MY APPROACH</span>

          <h2>
            I build systems that solve the
            <span> real problem.</span>
          </h2>

          <p>
            I'm an AI Automation Engineer and Software Developer
            with practical experience translating business
            requirements into working systems. My work spans
            AI-powered automation, conversational experiences,
            API integrations, and web and mobile applications.
          </p>

          <p>
            I approach projects by understanding the workflow
            first, identifying where technology can remove
            friction, then building and testing a solution that
            fits the actual operating environment.
          </p>

          <p>
            I'm comfortable moving between no-code automation
            platforms and custom development when a requirement
            calls for it. My goal is not simply to introduce
            technology, but to make it useful, reliable, and
            maintainable.
          </p>

          <div className="about-strengths">
            <div>
              <span>↗</span>
              Problem-first engineering
            </div>

            <div>
              <span>↗</span>
              AI workflow automation
            </div>

            <div>
              <span>↗</span>
              API & system integrations
            </div>

            <div>
              <span>↗</span>
              Web & mobile development
            </div>
          </div>
        </div>

        {/* HIGHLIGHTS */}
        <div className="about-stats">
          <div className="about-stat-card">
            <strong>2022</strong>
            <span>Freelance journey</span>
          </div>

          <div className="about-stat-card">
            <strong>24+</strong>
            <span>Automation projects reported</span>
          </div>

          <div className="about-stat-card">
            <strong>AI + Code</strong>
            <span>My engineering focus</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="about-timeline-card">
        <div className="about-timeline-header">
          <h3>Experience & Progression</h3>
          <span>2022 — PRESENT</span>
        </div>

        <div className="about-timeline">

          <div className="about-timeline-item">
            <div className="about-timeline-marker" />

            <div className="about-timeline-content">
              <div className="about-timeline-title">
                <h4>WordPress Development</h4>
                <span>2022</span>
              </div>

              <p>
                Worked with Bodint Technology Limited, developing
                and maintaining WordPress websites while gaining
                practical experience with web technologies.
              </p>
            </div>
          </div>

          <div className="about-timeline-item">
            <div className="about-timeline-marker" />

            <div className="about-timeline-content">
              <div className="about-timeline-title">
                <h4>AI Automation & Conversational AI</h4>
                <span>2023 — PRESENT</span>
              </div>

              <p>
                Designing and building AI-powered workflows,
                chatbots, business integrations, and automation
                systems for clients across different industries.
              </p>
            </div>
          </div>

          <div className="about-timeline-item">
            <div className="about-timeline-marker" />

            <div className="about-timeline-content">
              <div className="about-timeline-title">
                <h4>National Youth Service Corps</h4>
                <span>2025</span>
              </div>

              <p>
                Served at the Nigerian Meteorological Agency,
                analysing meteorological data and interpreting
                charts to support operational reporting.
              </p>
            </div>
          </div>

          <div className="about-timeline-item">
            <div className="about-timeline-marker current" />

            <div className="about-timeline-content">
              <div className="about-timeline-title">
                <h4>AI & Software Engineering</h4>
                <span>PRESENT</span>
              </div>

              <p>
                Building intelligent products and software
                applications that combine automation, AI,
                backend engineering, and modern web and mobile
                technologies.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</section>

      {/* EDUCATION */}
      <section className="credentials-section" id="credentials">
        <div className="wrap credentials-layout">
          <div>
            <SectionHeading
              eyebrow="EDUCATION / 04"
              title="Credentials & education"
              description="Academic background and professional learning."
            />
          </div>

          <div className="credential-card">
            <span className="credential-icon">✳</span>

            <div>
              <span className="eyebrow">
                2017 — 2024
              </span>

              <h3>{education.qualification}</h3>

              <p>{education.institution}</p>

              <span className="credential-foot">
                BACHELOR’S DEGREE
              </span>
            </div>
          </div>

          <div className="credential-card secondary-credential">
            <span className="credential-icon">↗</span>

            <div>
              <span className="eyebrow">
                PROFESSIONAL DEVELOPMENT
              </span>

              <h3>Continuous technical learning</h3>

              <p>
                Independent research, practical project delivery,
                and hands-on evaluation of AI tools, APIs, and
                software technologies.
              </p>

              <span className="credential-foot">
                PRACTICE-LED LEARNING
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="wrap contact-layout">
          <div className="contact-copy">
            <SectionHeading
              eyebrow="CONTACT / 05"
              title="Have a problem worth solving?"
              description="Tell me what you're building, what needs to work better, or where automation could help. Let's discuss the next step."
            />

            <div className="contact-email">
              <span>DIRECT EMAIL</span>

              <a href={`mailto:${profile.email}`}>
                {profile.email} ↗
              </a>
            </div>

            <div className="contact-links">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>

              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          <ContactForm email={profile.email} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer wrap">
        <a className="brand" href="#home">
          <span className="brand-mark">S</span>

          <span>
            silas<span className="muted">.dev</span>
          </span>
        </a>

        <span>
          AI AUTOMATION ENGINEER · SOFTWARE DEVELOPER
        </span>

        <span>
          © {new Date().getFullYear()} MOMOH SILAS ENEMONA
        </span>

        <a href="#home">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
