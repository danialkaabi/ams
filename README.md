# Al Annabi Marine Services (AMS) — Website

The marketing website for Al Annabi Marine Services W.L.L. (AMS), a joint
venture between Sea Horizon Offshore Marine Services W.L.L. (SHM) and
Adani Harbour Services Limited, delivering tug, port, and offshore energy
support across Qatar.

Built with Next.js (static pages, no database) and deployed as a static
site — sleek, editorial design inspired by Nike, Disney, Apple, Nakilat,
and Maersk.

## Pages

- `/` — Home
- `/about` — Company story, SHM & Adani background, leadership, vision
- `/services` — Fleet classes and service segments (offshore, port, LNG)
- `/hse` — Health, Safety & Environment commitment
- `/contact` — Contact details and inquiry form

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Deploying on Vercel

1. Go to vercel.com and sign in ("Continue with GitHub" so it can see this
   repo).
2. Click **Add New → Project**, import this repository, and deploy — no
   environment variables required.

## Images to swap in

`public/images/doha-skyline.jpg` is currently a generic stock photo used
as a placeholder hero/section background. Real AMS vessel photography
(e.g. AMS Laffan 1/3/4, AMS Najam, AMS Al Wakra 2, AMS Khattaf, LNG
carrier operations) should replace it — drop the files into
`public/images/` and update the `backgroundImage` references in
`pages/index.tsx`, `pages/about.tsx`, `pages/services.tsx`, and
`pages/hse.tsx`.
