
import SiteHeader from '@/components/SiteHeader';

const services = [
  {
    number: '01',
    tag: 'AI & ORCHESTRATION',
    title: 'AI Automation & Workflow Engineering',
    description:
      'Designing event-driven workflows that connect business tools, eliminate repetitive work and make business processes more efficient.',
    items: [
      'n8n, Make.com & Zapier',
      'Webhook-driven orchestration',
      'Conditional logic & retries',
      'Monitoring and exception handling',
    ],
  },
  {
    number: '02',
    tag: 'INTELLIGENT SYSTEMS',
    title: 'AI Agents & Conversational Systems',
    description:
      'Building intelligent assistants that understand requests, retrieve context, use tools and manage conversations across channels.',
    items: [
      'OpenAI and LLM integrations',
      'Prompt and tool design',
      'ManyChat, Landbot & Chatbase',
      'WhatsApp and messaging automation',
    ],
  },
  {
    number: '03',
    tag: 'SYSTEM CONNECTIVITY',
    title: 'API Integration & Systems Connectivity',
    description:
      'Connecting platforms through secure APIs, authentication systems, webhooks and reliable data transformation.',
    items: [
      'REST API integration',
      'OAuth and API authentication',
      'JSON mapping and transformation',
      'Validation and failure handling',
    ],
  },
  {
    number: '04',
    tag: 'PRODUCT ENGINEERING',
    title: 'Web & Mobile Application Development',
    description:
      'Building functional web and mobile applications with dependable backend services and practical user experiences.',
    items: [
      'Next.js and React',
      'React Native and Expo',
      'Node.js and Express',
      'Firebase and application APIs',
    ],
  },
  {
    number: '05',
    tag: 'OPERATIONS',
    title: 'Business Process Automation',
    description:
      'Turning manual business operations into structured workflows that improve consistency, visibility and productivity.',
    items: [
      'Process mapping',
      'CRM and data automation',
      'Approvals and notifications',
      'Operational reporting',
    ],
  },
  {
    number: '06',
    tag: 'CONTENT & DATA',
    title: 'AI-Powered Content & Data Workflows',
    description:
      'Automating content pipelines, document extraction, data processing and multi-step publishing operations.',
    items: [
      'AI content generation',
      'OCR and document workflows',
      'Media processing pipelines',
      'Publishing and delivery automation',
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="services-page">
      <SiteHeader />

      <div className="services-container">
        <a href="/" className="services-back">
          <span>←</span> Back to Overview
        </a>

        <section className="services-hero">
          <div className="services-eyebrow">
            <span className="services-eyebrow-dot" />
            WHAT I OFFER / ENGINEERING CAPABILITIES
          </div>

          <h1>
            Services & <span>capabilities.</span>
          </h1>

          <p>
            Delivering useful automation, connected systems and reliable
            software products tailored to real operating requirements.
          </p>

          <div className="services-hero-meta">
            <span>06 SPECIALIZED CAPABILITIES</span>
            <span>BUILT FOR REAL-WORLD OPERATIONS</span>
          </div>
        </section>

        <section className="services-section">
          <div className="services-section-heading">
            <div>
              <span className="services-section-label">EXPERTISE</span>
              <h2>What I can build for you</h2>
            </div>
            <span className="services-count">06 / 06</span>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-card-top">
                  <span className="service-number">{service.number}</span>
                  <span className="service-tag">{service.tag}</span>
                </div>

                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>

                <div className="service-capabilities">
                  <span className="service-capabilities-label">
                    CORE CAPABILITIES
                  </span>

                  <ul>
                    {service.items.map((item) => (
                      <li key={item}>
                        <span className="service-check">↗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <a className="service-link" href="/#contact">
                  Discuss this service <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="services-cta">
          <div>
            <span className="services-section-label">HAVE A PROJECT IN MIND?</span>
            <h2>Let's build something that works.</h2>
            <p>
              Tell me about the challenge you're trying to solve. We can
              explore the right technical approach together.
            </p>
          </div>

          <a href="/#contact">
            Start a conversation <span>↗</span>
          </a>
        </section>
      </div>

      <footer className="footer wrap">
        <a className="brand" href="/">
          <span className="brand-mark">S</span>
          <span>
            silas<span className="muted">.dev</span>
          </span>
        </a>
        <span>AI AUTOMATION ENGINEER · SOFTWARE DEVELOPER</span>
        <a href="/#contact">START A CONVERSATION ↗</a>
      </footer>
    </main>
  );
}
