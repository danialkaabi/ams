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

## Images

Real AMS vessel photography lives in `public/images/vessels/` (AMS Laffan
1/2/3/4, AMS Najam, AMS Al Wakra 1, AMS Khattaf) and is used across page
hero backgrounds and the fleet gallery on `/services`. Leadership
headshots and the logo are in `public/images/`.
