# Bytes and Nibbles Website

A Next.js website that displays content managed by the CMS, featuring "Bytes" (articles/blog posts) and "Nibbles" (recipes) in a beautiful, user-friendly interface.

## 🌐 Live Site

The website is hosted at https://bytes-and-nibbles.web.app.

![A screenshot of the website](website_screenshot.png)

## ✨ Features

- **Content Display**: Consumes and displays structured content from the CMS
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Server-side rendering with Next.js for optimal search performance
- **Rich Media**: Support for images, thumbnails, and structured content blocks
- **Series Organization**: Thematic grouping of articles with custom accent colors

## 🛠 Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore (content sourced from CMS)
- **Hosting**: Firebase Hosting

## 🚀 Development

### Prerequisites

- Node.js v18 or higher
- pnpm package manager

### Running Locally

From the monorepo root directory:

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start website in development mode
pnpm dev:website
```

The website will be available at `http://localhost:3000` (or your configured Next.js port).

### Building

```bash
# Build website for production
pnpm build:website

# Deploy to Firebase Hosting
pnpm deploy:website
```

## 📁 Project Structure

```
apps/website/
├── app/                    # Next.js app router pages
├── components/             # Reusable React components
├── lib/                    # Utility functions and configurations
├── styles/                 # Global styles and Tailwind config
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

## 🔗 Integration

This website automatically consumes content from the CMS via Firebase Firestore. Content is managed in the CMS application and displayed here with optimized layouts and user experiences.
