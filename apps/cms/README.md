# Bytes and Nibbles CMS

A headless content management system built with [FireCMS](https://firecms.co/) for managing "Bytes" (articles/blog posts) and "Nibbles" (recipes). This CMS provides a user-friendly interface for creating, editing, and publishing structured content with rich media support.

## Features

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

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **CMS Framework**: FireCMS v3
- **Database**: Firebase Firestore
- **File Storage**: Firebase Storage
- **Hosting**: Firebase Hosting
- **Styling**: Tailwind CSS with Typography plugin
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deployment)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bytes-and-nibbles-cms
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Firebase Configuration**

   - The Firebase configuration is already set up in `src/firebase_config.ts`
   - Make sure you have access to the "bytes-and-nibbles" Firebase project
   - Set up authentication rules as needed (see App.tsx for current auth logic)

## Development

### Start Development Server

```bash
pnpm run dev
```

The CMS will be available at `http://localhost:5173` (or your configured Vite port).

### Authentication

- The CMS uses Firebase Authentication with Google and email/password sign-in
- Current auth logic restricts access based on email domains
- Admin access is granted to users with `admin` custom claim or `@firecms.co` emails

### Content Management

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

## Building and Deployment

### Production Build

```bash
pnpm run build
```

### Preview Build Locally

```bash
pnpm run preview
```

### Deploy to Firebase

```bash
pnpm run deploy
```

This command builds the project and deploys it to Firebase Hosting under the "bytes-and-nibbles" project.

## Project Structure

```
src/
├── collections/          # Content type definitions
│   ├── bytes.tsx        # Byte (article) collection schema
│   ├── byteSeries.tsx   # Series collection with color picker
│   └── nibbles.tsx      # Recipe collection schema
├── components/          # Custom UI components
│   └── ColorField.tsx   # Color picker component
├── firebase_config.ts   # Firebase configuration
├── App.tsx             # Main CMS application
└── main.tsx           # Application entry point
```

## Content Schema Details

### Byte Structure

- **Sections**: Hierarchical content with headings
- **Subsections**: Nested content organization
- **Content Blocks**: Paragraphs (markdown) and captioned images
- **Media Storage**: Images stored in Firebase Storage under `images/bytes/`

### Nibble Structure

- **Ingredients**: Structured list with name, quantity, measurement, optional flag
- **Steps**: Ordered array of preparation instructions
- **Metadata**: Cooking time, servings, source information

## Security & Permissions

- Firebase Security Rules are defined in `src/firestore.rules` and `src/storage.rules`
- Authentication is handled through Firebase Auth
- Current setup allows access to users with specific email domains
- Admin privileges granted via custom claims

## Customization

### Adding New Content Types

1. Create a new collection file in `src/collections/`
2. Define your data structure using FireCMS `buildCollection` and `buildProperty`
3. Import and add the collection to the `collections` array in `App.tsx`

### Modifying Authentication

Edit the `myAuthenticator` function in `App.tsx` to customize access control logic.

### Custom Fields

Create custom field components in `src/components/` and reference them in your collection schemas.

## Contributing

1. Follow the existing code structure and TypeScript patterns
2. Test content creation workflows thoroughly
3. Ensure proper validation is in place for required fields
4. Update this README when adding new features

## Support

For FireCMS-specific documentation, visit [firecms.co](https://firecms.co/).

For Firebase setup and configuration, refer to the [Firebase Documentation](https://firebase.google.com/docs).
