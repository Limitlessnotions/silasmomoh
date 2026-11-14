
'use client';

import { useEffect, useState } from 'react';

const roles = [
  'AI Automation Engineer',
  'AI Workflow & Agent Developer',
  'Software Developer',
  'API Integration Specialist',
];

export default function AnimatedRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];

    let delay = deleting ? 45 : 85;

    if (!deleting && text === currentRole) {
      delay = 1800;
    }

    if (deleting && text === '') {
      delay = 350;
    }

    const timeout = window.setTimeout(() => {
      if (!deleting && text === currentRole) {
        setDeleting(true);
      } else if (deleting && text === '') {
        setDeleting(false);
        setRoleIndex((previous) => (previous + 1) % roles.length);
      } else if (deleting) {
        setText(currentRole.substring(0, text.length - 1));
      } else {
        setText(currentRole.substring(0, text.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [text, deleting, roleIndex]);

  return (
    <span className="animated-role" aria-live="polite">
      {text}
      <span className="typing-cursor" />
    </span>
  );
}
