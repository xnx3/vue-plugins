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
pnpm start
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

## Adding New Plugins

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