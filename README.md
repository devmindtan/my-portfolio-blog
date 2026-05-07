# My Portfolio Blog

A personal space to showcase my professional journey and technical expertise, featuring automated CV rendering and technical blogging.

## Problem

Many software engineers do not have a centralized and maintainable platform to:

- Showcase projects and career progress;
- Keep their CV updated and export it to PDF when needed;
- Store and share technical articles in an organized way.

## Goals

- Showcase personal journey and highlighted projects.
- Provide automatic CV export functionality (PDF) directly from project data.
- Store and publish technical blog posts.
- Support multilingual content (EN / VI) with an easy setup using Vite + TypeScript.

## Main Features

- Export CV to PDF / print directly from the interface (CV export).
- Technical blog system with content managed directly in source code.
- Portfolio page with filtering, compact display mode, and project detail modal.
- Interface customization through `Settings` (`SettingsModal`).

## Technologies

- Vite + React + TypeScript
- Tailwind CSS, PostCSS
- jsPDF / pdfjs-dist / react-to-print (PDF export)
- Supabase client (optional data integration)

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run development environment:

```bash
npm run dev
```

3. Build and preview production version:

```bash
npm run build
npm run preview
```

## Main Structure

- [`src/`](src/) — React source code, components, and pages.
- [`data/`](data/) — portfolio and blog content (`portfolio.en.ts`, `portfolio.vi.ts`, `blog.en.ts`, `blog.vi.ts`).
- [`i18n/`](i18n/) — EN/VI translation strings for components.

## Updating Content

- Edit personal information and project lists in [`data/portfolio.*.ts`](data/).
- Add or update blog posts in [`data/blog.*.ts`](data/).
- UI components and logic are located in [`src/components/`](src/components/).
