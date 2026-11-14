
'use client';

import { FormEvent, useState } from 'react';

interface ContactFormProps {
  email: string;
}

interface Challenge {
  first: number;
  second: number;
  answer: number;
}

function generateChallenge(): Challenge {
  const first = Math.floor(Math.random() * 9) + 1;
  const second = Math.floor(Math.random() * 9) + 1;

  return {
    first,
    second,
    answer: first + second,
  };
}

export default function ContactForm({ email }: ContactFormProps) {
  const [name, setName] = useState('');
  const [sender, setSender] = useState('');
  const [topic, setTopic] = useState('AI automation');
  const [message, setMessage] = useState('');

  const [challenge, setChallenge] = useState<Challenge>(
    () => generateChallenge()
  );

  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [verified, setVerified] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const isCorrect =
    captchaAnswer.trim() !== '' &&
    Number(captchaAnswer) === challenge.answer;

  function refreshChallenge() {
    setChallenge(generateChallenge());
    setCaptchaAnswer('');
    setVerified(false);
  }

  function verifyAnswer() {
    if (isCorrect) {
      setVerified(true);
    } else {
      setVerified(false);
      setCaptchaAnswer('');
      setChallenge(generateChallenge());
    }
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Basic honeypot protection
    if (honeypot.trim() !== '') {
      return;
    }

    // Require successful human verification
    if (!verified || !isCorrect) {
      setVerified(false);
      return;
    }

    const subject = encodeURIComponent(
      `${topic} enquiry from ${name}`
    );

    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${sender}\n` +
      `Project type: ${topic}\n\n` +
      `${message}`
    );

    window.location.href =
      `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-top">
        <span className="eyebrow">SEND A MESSAGE</span>
        <span className="form-secure">
          DIRECT EMAIL HANDOFF ↗
        </span>
      </div>

      {/* Honeypot field */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
        }}
      >
        <label htmlFor="contact-website">
          Leave this field empty
        </label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <label>
        Your name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />
      </label>

      <label>
        Your email
        <input
          required
          type="email"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
        />
      </label>

      <label>
        What do you need help with?
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option>AI automation</option>
          <option>Software development</option>
          <option>AI chatbot / agent</option>
          <option>Web application development</option>
          <option>Mobile application development</option>
          <option>API integration</option>
          <option>Backend development</option>
          <option>Full-time opportunity</option>
          <option>Technical consulting</option>
          <option>Other</option>
        </select>
      </label>

      <label>
        Project details
        <textarea
          required
          minLength={10}
          maxLength={3000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me a little about the project or challenge…"
          rows={5}
        />
        <span className="char-count">
          {message.length}/3000
        </span>
      </label>

      {/* Anti-bot verification */}
      <div className="captcha-box">
        <div className="captcha-icon">
          <span>◇</span>
        </div>

        <div className="captcha-content">
          <div className="captcha-heading">
            <strong>Human Verification</strong>
            <span className="captcha-badge">Anti-Bot</span>
          </div>

          <p>
            Security Verification: What is {challenge.first} +{' '}
            {challenge.second}?
          </p>

          {verified && (
            <span className="captcha-success">
              ✓ Verification successful
            </span>
          )}
        </div>

        <div className="captcha-actions">
          <input
            type="number"
            value={captchaAnswer}
            onChange={(e) => {
              setCaptchaAnswer(e.target.value);
              setVerified(false);
            }}
            placeholder="Answer"
            aria-label="Enter the answer to the security question"
            required
          />

          <button
            type="button"
            className="captcha-refresh"
            onClick={refreshChallenge}
            aria-label="Generate another verification question"
            title="Refresh question"
          >
            ↻
          </button>
        </div>
      </div>

      {!verified && captchaAnswer !== '' && !isCorrect && (
        <p className="captcha-error" role="alert">
          Incorrect answer. Please try again.
        </p>
      )}

      {!verified && (
        <button
          type="button"
          className="captcha-verify"
          onClick={verifyAnswer}
          disabled={!isCorrect}
        >
          Verify Answer
        </button>
      )}

      <button
        className="button button-primary submit-button"
        type="submit"
        disabled={!verified}
      >
        Send Message <span>↗</span>
      </button>

      <p className="form-note">
        Your message will be prepared in your default email
        application. Your information is not stored on a server.
      </p>
    </form>
  );
}
