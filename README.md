# Silas Momoh — Portfolio

A standalone Next.js portfolio for **AI Automation Engineer & Software Developer**.

## Included
- Responsive, dark editorial layout inspired by the supplied portfolio reference.
- Projects, skills, experience, education, contact, and CV download sections.
- GitHub profile/repository/recent public-event panel using GitHub's unauthenticated public REST API.
- Contact form that prepares an email in the visitor's default mail app. It does not transmit or store form data.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Keep the default Next.js build settings and deploy.
4. Replace `https://example.com` in `app/layout.tsx` with the final portfolio domain for canonical/Open Graph metadata.

## Before launch

- Confirm the LinkedIn URL in `lib/data.ts`.
- Add verified live demo/repository URLs to project entries where available (`href` is currently `null` because project-specific public URLs have not been confirmed).
- The GitHub panel displays public repositories and recent public events. GitHub's public REST API does not provide a complete contribution heatmap or private activity without authenticated access, so no contribution counts are fabricated.
- The contact form uses a `mailto:` handoff. For direct website delivery without relying on the visitor's email client, connect a form service or a server-side email provider and update `components/ContactForm.tsx`.
- Review project descriptions and CV details before publishing.

## Profile data

Edit `lib/data.ts` to update your bio, projects, skills, work history, and education. Your uploaded CV is included at `public/Momoh_Silas_Enemona_CV.pdf`.
