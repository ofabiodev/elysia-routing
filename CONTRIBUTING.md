# Contributing to Elysia Routing

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/ofabiodev/elysia-routing.git
cd elysia-routing
```

2. **Install dependencies**
```bash
bun install
```

3. **Run tests**
```bash
bun test
```

4. **Build the project**
```bash
bun run build
```

## Project Structure

```
elysia-routing/
├── src/
│   ├── core/          # Types and route definition
│   ├── router/        # Scanner and plugin logic
│   └── validator/     # Mini-zod validation
├── tests/             # Test files
├── spec/              # Example routes for testing
└── README.md
```

## Development Workflow

1. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style (Biome enforces this)
   - Add tests for new features
   - Update README.md if needed

3. **Run checks**
```bash
bun run lint    # Check code style
bun test        # Run tests
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

5. **Push and create a Pull Request**
```bash
git push origin feature/your-feature-name
```

## Code Style

We use **Biome** for linting and formatting:
- Run `bun run lint` to check
- Code is automatically checked in CI

## Testing

- Write tests for all new features
- Use **Poku** as test runner
- Tests are in `tests/` folder
- Run `bun test` before submitting PR

## Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Write clear PR descriptions
- Reference related issues
- Ensure all tests pass

## Reporting Issues

When reporting bugs, please include:
- Elysia version
- Node/Bun version
- Minimal reproduction code
- Expected vs actual behavior

## Questions?

Feel free to open an issue for questions or discussions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.