# Bytes and Nibbles Monorepo

[![Deploy CMS workflow](https://github.com/Samuel-Harris/Bytes-and-Nibbles/actions/workflows/cms-deploy.yml/badge.svg)](https://github.com/Samuel-Harris/Bytes-and-Nibbles/actions/workflows/cms-deploy.yml)
[![Deploy Website workflow](https://github.com/Samuel-Harris/Bytes-and-Nibbles/actions/workflows/website-deploy.yml/badge.svg)](https://github.com/Samuel-Harris/Bytes-and-Nibbles/actions/workflows/website-deploy.yml)

A monorepo containing a headless content management system and public website for managing and displaying "Bytes" (articles/blog posts) and "Nibbles" (recipes).

## 🌐 Live Sites

- **Website**: https://bytes-and-nibbles.web.app

![A screenshot of the website](apps/website/website_screenshot.png)

## 📋 Overview

This monorepo contains two main applications:

### CMS (Content Management System)
A headless CMS built with [FireCMS](https://firecms.co/) for creating, editing, and publishing structured content with rich media support.

### Website (Public Site)
A Next.js website that consumes content from the CMS and displays it in a beautiful, user-friendly interface.

## ✨ Features

### Content Types

#### Bytes (Articles/Blog Posts)

- **Structured Content**: Create articles with hierarchical sections and subsections
- **Rich Text Support**: Markdown-enabled paragraphs and captions
- **Media Management**: Upload and manage images for thumbnails, cover photos, and inline content
- **Series Organization**: Group related bytes into series with custom accent colors
- **Publishing Workflow**: Control publication status and track modification dates
- **SEO-Friendly**: Unique slugs for URL generation

#### Nibbles (Recipes)

- **Recipe Management**: Complete recipe entries with ingredients, steps, and metadata
- **Ingredient Tracking**: Structured ingredient lists with quantities and measurements
- **Step-by-Step Instructions**: Ordered cooking/preparation steps
- **Media Support**: Recipe photos and thumbnails
- **Serving Information**: Track number of servings and preparation time

#### Byte Series (Categories)

- **Content Organization**: Group bytes into thematic series
- **Visual Branding**: Custom accent colors for each series
- **Color Preview**: Visual color picker with live preview

## 🛠 Technology Stack

### CMS Application (`apps/cms/`)
- **Frontend Framework**: React 19 with TypeScript
- **CMS Framework**: FireCMS v3
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Typography plugin

### Website Application (`apps/website/`)
- **Framework**: Next.js 15 with TypeScript
- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Testing**: Jest with React Testing Library

### Shared Infrastructure
- **Database**: Firebase Firestore
- **File Storage**: Firebase Storage
- **Hosting**: Firebase Hosting
- **Package Manager**: pnpm
- **Monorepo Tooling**: pnpm workspaces

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deployment)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bytes-and-nibbles-monorepo
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Firebase Configuration**

   - Firebase configuration is managed in the shared package
   - Make sure you have access to the "bytes-and-nibbles" Firebase project
   - Authentication and security rules are configured for the project

## 💻 Development

### Development Scripts

```bash
# Start CMS in development mode
pnpm dev:cms

# Start website in development mode
pnpm dev:website

# Run tests across all apps
pnpm test

# Run linting across all apps
pnpm lint

# Build all apps
pnpm build

# Clean all build artifacts
pnpm clean
```

### CMS Development

The CMS will be available at `http://localhost:5173` (or your configured Vite port).

**Authentication**
- Uses Firebase Authentication with Google and email/password sign-in
- Access restricted based on email domains
- Admin access granted to users with `admin` custom claim or specific emails

**Content Management**

#### Creating a Byte (Article)

1. Navigate to the "Bytes" collection in the sidebar
2. Click "Add new entry"
3. Fill in the required fields:
   - **Title**: Article title
   - **Subtitle**: Brief description
   - **Series**: Select from existing byte series
   - **Slug**: URL-friendly identifier (auto-generated or manual)
   - **Thumbnail & Cover Photo**: Upload images
   - **Sections**: Add structured content with headings, paragraphs, and images
4. Set "Is published?" to control visibility
5. Save your changes

#### Creating a Nibble (Recipe)

1. Navigate to the "Nibbles" collection
2. Click "Add new entry"
3. Fill in recipe details:
   - **Title**: Recipe name
   - **Source**: Recipe origin or author
   - **Number of servings**: How many people it serves
   - **Time taken**: Preparation/cooking time in minutes
   - **Ingredients**: Add ingredients with quantities and measurements
   - **Steps**: List preparation instructions in order
4. Upload thumbnail and cover photos
5. Publish when ready

#### Managing Byte Series

1. Go to "Byte series" collection
2. Create new series with titles and accent colors
3. Use the color picker to select brand-appropriate colors

### Website Development

The website will be available at `http://localhost:3000` (or your configured Next.js port).

The website automatically consumes content from the CMS via Firebase and displays it in a beautiful interface.

## 🏗 Building and Deployment

### Production Builds

```bash
# Build CMS
pnpm build:cms

# Build website
pnpm build:website

# Build all apps
pnpm build
```

### Deploy to Firebase

```bash
# Deploy CMS
pnpm deploy:cms

# Deploy website
pnpm deploy:website

# Deploy all apps
pnpm deploy:all
```

Both applications deploy to Firebase Hosting under the "bytes-and-nibbles" project with different targets.

## 📁 Project Structure

```
bytes-and-nibbles-monorepo/
├── apps/                          # Applications
│   ├── cms/                       # FireCMS admin interface
│   │   ├── src/
│   │   │   ├── collections/       # Content type definitions
│   │   │   ├── components/        # Custom UI components
│   │   │   ├── firebase_config.ts # Firebase configuration
│   │   │   └── App.tsx           # Main CMS application
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── website/                   # Next.js public website
│       ├── app/
│       ├── package.json
│       └── next.config.js
├── packages/                      # Shared packages
│   └── shared/                    # Common types, config, utilities
├── configs/                       # Shared configurations
├── firebase.json                  # Consolidated Firebase config
├── .firebaserc                    # Firebase project config
├── package.json                   # Root workspace config
├── pnpm-workspace.yaml            # Workspace configuration
└── README.md                      # This file
```

## 🔒 Security & Permissions

- Firebase Security Rules are defined in root-level `firestore.rules` and `storage.rules`
- Authentication is handled through Firebase Auth
- Current setup allows access to users with specific email domains
- Admin privileges granted via custom claims

## 🤝 Contributing

1. Follow the existing code structure and TypeScript patterns
2. Test content creation workflows thoroughly
3. Ensure proper validation is in place for required fields
4. Update documentation when adding new features
5. Use pnpm for package management

## 📚 Content Schema Details

### Byte Structure

- **Sections**: Hierarchical content with headings
- **Subsections**: Nested content organization
- **Content Blocks**: Paragraphs (markdown) and captioned images
- **Media Storage**: Images stored in Firebase Storage under `images/bytes/`

### Nibble Structure

- **Ingredients**: Structured list with name, quantity, measurement, optional flag
- **Steps**: Ordered array of preparation instructions
- **Metadata**: Cooking time, servings, source information

## 🔗 Support

- For FireCMS-specific documentation, visit [firecms.co](https://firecms.co/)
- For Firebase setup and configuration, refer to the [Firebase Documentation](https://firebase.google.com/docs)
- For Next.js documentation, visit [nextjs.org](https://nextjs.org/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
