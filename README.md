# SunoVault — Suno Prompt Knowledge Base

A modern, fully static React + Vite app for managing and browsing Suno AI music generation prompts. Dark glassmorphism design. No backend — all data lives in a JSON file.

## Features

- Fuzzy search (Fuse.js) across title, prompt, tags, genre, mood
- Filter by genre, mood, language; favorites toggle
- Sort: Newest, Oldest, A→Z, Favorites first
- Add / Edit / Duplicate / Delete prompts via modal UI
- One-click "Copy Prompt" button
- Favorite star on each card
- Infinite scroll (IntersectionObserver)
- Download current state as `prompts.json`
- Gradient cover placeholders per genre (no image required)
- Responsive — works on mobile

## Getting Started

```bash
npm install
npm run dev
```

## How to Add/Edit Prompts

1. Use the "+ Add Prompt" button in the app
2. Fill in the form and save
3. Click "Download prompts.json" in the footer
4. Replace `src/data/prompts.json` in your repo with the downloaded file
5. `git add src/data/prompts.json && git commit -m "update prompts" && git push`
6. Vercel auto-deploys on push — done!

## How to Add Cover Images

1. Drop your image file (jpg, webp, png — recommended 400×300px) into `public/images/`
2. When adding/editing a prompt, enter just the filename in the "Image filename" field (e.g. `my-cover.jpg`)
3. The app will reference it as `/images/my-cover.jpg`
4. Commit and push — Vercel serves static files from `public/` automatically

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
3. Framework preset: **Vite** (auto-detected)
4. Click Deploy
5. Every `git push` to `main` triggers an automatic redeploy

## Project Structure

```
suno-prompts/
  public/images/        ← cover images served statically
  src/
    data/prompts.json   ← all prompt data (edit & replace to update)
    components/         ← React UI components
      modals/           ← View, Add/Edit, ConfirmDelete modals
    hooks/              ← usePrompts, useSearch, useModal
    utils/              ← exportJson, gradients, copyToClipboard
    App.jsx
    index.css
  vercel.json           ← SPA rewrite rule
```
