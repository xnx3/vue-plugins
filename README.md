# Vue.js Plugins Collection

A modern, responsive web application for discovering and exploring Vue.js plugins. Built with Nuxt 3, TypeScript, and Tailwind CSS.

## Features

- 🔍 **Advanced Search & Filtering** - Find plugins by name, description, category, and tags
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🎨 **Modern UI** - Clean, minimalist interface with Vue.js and Monterail branding
- ⚡ **Fast Performance** - Server-side rendering with Nuxt 3
- 🔗 **GitHub Integration** - Real-time stats from GitHub API with caching
- 📊 **Plugin Analytics** - Stars, downloads, forks, and issue tracking
- 🏷️ **Categorization** - Organized by plugin categories and types
- 📄 **Detailed Plugin Pages** - Comprehensive information for each plugin
- 🚀 **Batch GitHub API Requests** - Optimized API calls with intelligent caching

## Tech Stack

- **Framework**: Nuxt 3 (v3.17.5+)
- **Language**: TypeScript
- **Package Manager**: pnpm (v9.14.2+)
- **Styling**: Tailwind CSS with Tailwind Animate
- **UI Components**: Reka UI
- **Icons**: Nuxt Icon with Lucide Icons
- **State Management**: Vue 3 Composition API with VueUse
- **HTTP Client**: ofetch
- **API**: Nuxt Server API Routes
- **Color Mode**: Dark/Light theme support

## Getting Started

### Prerequisites

- **Node.js**: 18+ (recommended: 20.x LTS)
- **Package Manager**: pnpm (recommended) or npm/yarn
- **Git**: For cloning and version control

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd vue-plugins
```

2. **Install dependencies:**
```bash
# Using pnpm (recommended)
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit the `.env` file and add your GitHub Personal Access Token for enhanced API limits:
```bash
# GitHub API Token (optional, for higher rate limits)
GITHUB_TOKEN=your_github_personal_access_token_here
```

> **Note**: Without a GitHub token, you're limited to 60 requests per hour. With a token, you get 5,000 requests per hour.

4. **Start the development server:**
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

5. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Generate static site (optional)
pnpm generate
```

## Available Scripts

- `pnpm dev` / `npm run dev` - Start development server
- `pnpm build` / `npm run build` - Build for production
- `pnpm preview` / `npm run preview` - Preview production build
- `pnpm generate` / `npm run generate` - Generate static site
- `pnpm postinstall` / `npm run postinstall` - Prepare Nuxt (runs automatically)

## Project Structure

```
vue-plugins/
├── assets/
│   └── css/
│       └── main.css              # Global styles and Tailwind imports
├── components/
│   ├── AppFooter.vue             # Footer component
│   ├── AppHeader.vue             # Header with navigation
│   ├── AppPagination.vue         # Pagination controls
│   ├── PluginCard.vue            # Individual plugin card
│   ├── PluginFilters.vue         # Search and filter controls
│   └── VueLogo.vue               # Vue.js logo component
├── composables/
│   └── useGitHubStars.ts         # GitHub API composable
├── layouts/
│   └── default.vue               # Default layout template
├── pages/
│   ├── index.vue                 # Homepage with plugin listing
│   └── plugins/
│       └── [id].vue              # Individual plugin detail page
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── robots.txt
│   └── placeholder-*             # Placeholder images
├── server/
│   ├── api/
│   │   ├── categories.get.ts     # Get available categories
│   │   ├── types.get.ts          # Get plugin types (official/community)
│   │   ├── github/
│   │   │   └── stars.post.ts     # Batch fetch GitHub stars with caching
│   │   └── plugins/
│   │       ├── index.get.ts      # Get plugins with filtering/pagination
│   │       └── [id].get.ts       # Get individual plugin with GitHub stats
│   ├── data/
│   │   └── plugins.ts            # Plugin data store
│   └── tsconfig.json             # Server-side TypeScript config
├── types/
│   └── index.ts                  # TypeScript type definitions
├── utils/
│   └── github.ts                 # GitHub API utilities
├── .env.example                  # Environment variables template
├── eslint.config.mjs             # ESLint configuration
├── nuxt.config.ts                # Nuxt configuration
├── package.json                  # Dependencies and scripts
├── pnpm-lock.yaml                # pnpm lockfile
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## API Endpoints

The application provides a RESTful API with the following endpoints:

### Plugin Endpoints

#### `GET /api/plugins`
Get a paginated list of plugins with optional filtering and sorting.

**Query Parameters:**
- `search` (string, optional) - Search in plugin name, description, and tags
- `category` (string, optional) - Filter by category (see categories endpoint)
- `type` (string, optional) - Filter by type: `official` or `community`
- `sort` (string, optional) - Sort order: `name-asc` (default), `name-desc`
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 12)

**Response:**
```typescript
{
  data: VuePlugin[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}
```

**Example:**
```bash
GET /api/plugins?search=router&category=Routing&page=1&limit=12
```

#### `GET /api/plugins/[id]`
Get detailed information about a specific plugin, including GitHub statistics.

**Parameters:**
- `id` (string) - Plugin ID

**Response:**
```typescript
{
  // All VuePlugin properties plus:
  stars: number,
  forks: number,
  issues: number,
  lastCommit: string,
  license: string,
  readme?: string
}
```

**Example:**
```bash
GET /api/plugins/pinia
```

### Metadata Endpoints

#### `GET /api/categories`
Get all available plugin categories.

**Response:**
```typescript
string[] // Array of category names
```

**Example Response:**
```json
[
  "Routing",
  "State Management", 
  "Utilities",
  "Internationalization",
  "UI Framework",
  "Animation",
  "Forms",
  "Testing",
  "Development Tools",
  "Data Fetching"
]
```

#### `GET /api/types`
Get all available plugin types.

**Response:**
```typescript
string[] // Array of type names
```

**Example Response:**
```json
["official", "community"]
```

### GitHub Integration

#### `POST /api/github/stars`
Batch fetch GitHub stars for multiple repositories with intelligent caching.

**Request Body:**
```typescript
{
  githubUrls: string[]
}
```

**Response:**
```typescript
{
  [githubUrl: string]: {
    stars: number,
    error?: string
  }
}
```

**Features:**
- 1-hour cache TTL per repository
- Batch processing for efficient API usage
- Error handling for invalid/unavailable repositories
- Automatic rate limiting respect

**Example:**
```bash
POST /api/github/stars
Content-Type: application/json

{
  "githubUrls": [
    "https://github.com/vuejs/pinia",
    "https://github.com/vuejs/router"
  ]
}
```

## Configuration

### Environment Variables

The application uses the following environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITHUB_TOKEN` | No | `""` | GitHub Personal Access Token for enhanced API rate limits |

### GitHub API Configuration

- **Rate Limits**: 
  - Without token: 60 requests/hour
  - With token: 5,000 requests/hour
- **Caching**: 1-hour TTL for GitHub API responses
- **Endpoints Used**:
  - Repository info: `GET /repos/{owner}/{repo}`
  - Content fetching: `GET /repos/{owner}/{repo}/contents/{path}`

### Tailwind Configuration

Custom Tailwind configuration includes:
- Tailwind Animate for animations
- Color mode support (dark/light themes)
- Custom color schemes
- Responsive breakpoints

### TypeScript Configuration

- Strict type checking enabled
- Vue 3 + Nuxt 3 type definitions
- Custom types in `/types/index.ts`
- Server-side types in `/server/tsconfig.json`

## Development Guide

### Adding New Plugins

To add a new plugin to the collection:

1. **Edit the data file**: `/server/data/plugins.ts`
2. **Add plugin object** following the `VuePlugin` interface:

```typescript
{
  "id": "unique-plugin-id",
  "name": "Plugin Name",
  "description": "Brief description of the plugin",
  "category": "Category Name", // Must match existing categories
  "packageName": "npm-package-name",
  "githubUrl": "https://github.com/owner/repo",
  "npmUrl": "https://www.npmjs.com/package/npm-package-name", // optional
  "documentationUrl": "https://plugin-docs.com", // optional
  "author": "Author Name",
  "tags": ["tag1", "tag2", "tag3"],
  "type": "official" | "community"
}
```

3. **Update categories** in `/server/api/categories.get.ts` if adding a new category

### Plugin Categories

Available categories (defined in `/server/api/categories.get.ts`):
- Routing
- State Management
- Utilities
- Internationalization
- UI Framework
- Animation
- Forms
- Testing
- Development Tools
- Data Fetching

### Customization

#### Styling
- Global styles: `/assets/css/main.css`
- Tailwind configuration: `tailwind.config.js`
- Component-specific styles: Use Tailwind classes

#### Components
- All components are in `/components/`
- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety

#### API Extensions
- Add new endpoints in `/server/api/`
- Follow Nuxt 3 server API conventions
- Use TypeScript and proper error handling

### GitHub Integration

The app integrates with GitHub API for real-time statistics:

#### GitHub Utilities (`/utils/github.ts`)
- `extractRepoPath()` - Extract owner/repo from GitHub URL
- `buildGitHubApiUrl()` - Build GitHub API URLs
- `buildRawGitHubUrl()` - Build raw content URLs

#### Caching Strategy
- Uses Nuxt storage layer for caching
- 1-hour TTL for GitHub API responses
- Base64 encoded cache keys for URL safety

#### Rate Limiting
- Automatic retry with exponential backoff
- Respects GitHub rate limits
- Graceful degradation without token

## Troubleshooting

### Common Issues

#### GitHub API Rate Limiting
**Problem**: "API rate limit exceeded" errors
**Solution**: 
1. Add a GitHub Personal Access Token to `.env`
2. Ensure token has proper permissions (public repository access)
3. Check token validity: `curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/rate_limit`

#### Build Errors
**Problem**: TypeScript compilation errors
**Solution**:
1. Run `pnpm postinstall` to prepare Nuxt
2. Check TypeScript configuration in `tsconfig.json`
3. Ensure all types are properly imported

#### Plugin Data Issues
**Problem**: Plugin not showing up or incorrect data
**Solution**:
1. Verify plugin object structure in `/server/data/plugins.ts`
2. Check that category exists in `/server/api/categories.get.ts`
3. Ensure GitHub URLs are valid and accessible

#### Development Server Issues
**Problem**: Server won't start or hot reload not working
**Solution**:
1. Clear `.nuxt` directory: `rm -rf .nuxt`
2. Reinstall dependencies: `pnpm install`
3. Check port availability (default: 3000)

### Performance Optimization

- GitHub API responses are cached for 1 hour
- Static assets are optimized during build
- Use `pnpm generate` for static site generation
- Enable Nuxt DevTools for debugging: `devtools: { enabled: true }`

## Deployment

### Static Site Generation

For hosting on platforms like Netlify, Vercel, or GitHub Pages:

```bash
# Generate static files
pnpm generate

# Files will be in .output/public/
```

### Server-Side Rendering

For platforms supporting Node.js:

```bash
# Build for production
pnpm build

# Start production server
node .output/server/index.mjs
```

### Environment Variables in Production

Set the following environment variables in your deployment platform:

```bash
GITHUB_TOKEN=your_github_personal_access_token
```

### Platform-Specific Deployment

#### Vercel
1. Connect your Git repository
2. Set `GITHUB_TOKEN` in environment variables
3. Deploy automatically on push

#### Netlify
1. Connect your Git repository  
2. Build command: `pnpm generate`
3. Publish directory: `.output/public`
4. Set `GITHUB_TOKEN` in environment variables

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```
