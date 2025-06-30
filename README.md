# Vue.js Plugins Collection

A modern, responsive web application for discovering and exploring Vue.js plugins. Built with Nuxt 3, TypeScript, and Tailwind CSS.

## Features

- 🔍 **Advanced Search & Filtering** - Find plugins by name, description, category, and tags
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🎨 **Modern UI** - Clean, minimalist interface with Vue.js and Monterail branding
- ⚡ **Fast Performance** - Server-side rendering with Nuxt 3
- 🔗 **GitHub Integration** - Real-time stats from GitHub API
- 📊 **Plugin Analytics** - Stars, downloads, forks, and issue tracking
- 🏷️ **Categorization** - Organized by plugin categories
- 📄 **Detailed Plugin Pages** - Comprehensive information for each plugin

## Tech Stack

- **Framework**: Nuxt 3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons via nuxt-icon
- **State Management**: Vue 3 Composition API
- **API**: Nuxt Server API Routes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd vue-plugins-collection
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Set up environment variables (optional):
\`\`\`bash
cp .env.example .env
\`\`\`

Add your GitHub token for enhanced API limits:
\`\`\`
GITHUB_TOKEN=your_github_token_here
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run generate\` - Generate static site
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript type checking

## Project Structure

\`\`\`
├── assets/css/          # Global styles
├── components/          # Vue components
├── layouts/            # Nuxt layouts
├── pages/              # Nuxt pages (auto-routing)
├── server/api/         # API endpoints
├── types/              # TypeScript type definitions
├── nuxt.config.ts      # Nuxt configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies and scripts
\`\`\`

## API Endpoints

- \`GET /api/plugins\` - List plugins with filtering and pagination
- \`GET /api/plugins/[id]\` - Get individual plugin details
- \`GET /api/categories\` - Get available plugin categories

## Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Commit your changes: \`git commit -m 'Add amazing feature'\`
4. Push to the branch: \`git push origin feature/amazing-feature\`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Made with 💚 by [Monterail](https://monterail.com)
- Inspired by the Vue.js ecosystem
- Icons by [Lucide](https://lucide.dev)
