# Contributing to Vue Plugins

Thank you for your interest in contributing to Vue Plugins! We welcome contributions from the community and are pleased to have you join us.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/vue-plugins.git
   cd vue-plugins
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Start the development server**:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Setting up your environment

Make sure you have the following installed:
- Node.js (version 18 or higher)
- pnpm (recommended package manager)

### Making Changes

1. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly:
   ```bash
   pnpm build
   pnpm preview
   ```

4. **Lint your code**:
   ```bash
   pnpm lint
   ```

### Commit Guidelines

We follow conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example:
```
feat: add plugin search functionality
fix: resolve pagination issue on mobile
docs: update installation instructions
```

### Pull Request Process

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - Reference any related issues
   - Screenshots for UI changes
   - List of changes made

3. **Address review feedback** if needed

4. Once approved, your PR will be merged!

## Code Style

- We use ESLint for code linting
- Follow Vue.js style guide and best practices
- Use TypeScript for type safety
- Write meaningful component and function names
- Add comments for complex logic

## Adding New Features

When adding new features:

1. **Check existing issues** to avoid duplicates
2. **Create an issue** to discuss the feature first
3. **Follow the component structure** used in the project
4. **Add appropriate TypeScript types**
5. **Update documentation** if needed

## Reporting Issues

When reporting issues:

1. **Search existing issues** first
2. **Use the issue template** if available
3. **Provide clear reproduction steps**
4. **Include environment details** (OS, browser, Node version)
5. **Add screenshots** for UI issues

## Project Structure

```
├── components/          # Vue components
├── composables/        # Vue composables
├── layouts/           # Nuxt layouts
├── pages/            # Nuxt pages/routes
├── public/           # Static assets
├── server/           # Server-side code
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Questions?

If you have questions about contributing:

- Check existing issues and discussions
- Create a new issue with the "question" label
- Reach out to the maintainers

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms.

Thank you for contributing! 🎉
