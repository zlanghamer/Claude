# Contributing to the Claude Code Plugin Marketplace

Thank you for your interest in contributing. This document covers how to contribute to the marketplace infrastructure itself (schemas, validation scripts, documentation). To submit a new plugin, see [marketplace/docs/PLUGIN_SUBMISSION.md](./marketplace/docs/PLUGIN_SUBMISSION.md).

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Ways to Contribute](#ways-to-contribute)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Making Changes](#making-changes)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project follows the [Anthropic Community Guidelines](https://anthropic.com). Be respectful, constructive, and welcoming to contributors of all experience levels.

---

## Ways to Contribute

- **Bug reports** — Open a GitHub issue describing the problem, expected behaviour, and steps to reproduce.
- **Feature requests** — Open a GitHub issue with a clear description of the proposed change and its motivation.
- **Documentation** — Improve or expand any file in the `marketplace/docs/` or `docs/` directories.
- **Schema improvements** — Enhance the JSON Schemas in `.claude-plugin/schemas/`.
- **Validation scripts** — Improve or extend the scripts in `marketplace/scripts/`.
- **GitHub Actions** — Improve CI/CD workflows in `.github/workflows/`.

---

## Development Setup

### Prerequisites

- **Node.js** 18 or later
- **Git** 2.30 or later
- A GitHub account

### Clone and install

```bash
git clone https://github.com/anthropics/claude-code-plugins.git
cd claude-code-plugins
npm install
```

### Verify your setup

```bash
# Validate the marketplace registry
node marketplace/scripts/validate-marketplace.js

# Validate any plugin manifests (exits cleanly if none found)
node marketplace/scripts/validate-plugins.js

# Generate the plugin catalog
node marketplace/scripts/generate-catalog.js
```

All three commands should exit with code `0`.

---

## Project Structure

```
.claude-plugin/
  marketplace.json          Central plugin registry
  schemas/
    marketplace.schema.json JSON Schema for marketplace.json
    plugin.schema.json      JSON Schema for plugin manifests

plugins/                    Your custom plugins (and official Anthropic plugins)
skills/                     Your custom skills
hooks/                      Your custom hooks
experiments/                Testing ground for ideas

marketplace/
  scripts/
    validate-marketplace.js Validates marketplace.json
    validate-plugins.js     Validates individual plugin.json files
    generate-catalog.js     Generates dist/catalog.json
  external_plugins/         Community plugin sources
  docs/
    PLUGIN_GUIDELINES.md    Quality standards for plugins
    PLUGIN_SUBMISSION.md    How to submit a plugin
    MARKETPLACE_API.md      Registry and catalog format reference
    SECURITY_POLICY.md      Security requirements and disclosure policy

templates/
  plugin-template/          Copy-paste starter for a new plugin
  skill-template/           Copy-paste starter for a new skill
  hook-template/            Copy-paste starter for a new hook

docs/
  HOW_TO_CREATE_PLUGINS.md  Step-by-step guide for plugins
  HOW_TO_CREATE_SKILLS.md   Step-by-step guide for skills
  HOW_TO_CREATE_HOOKS.md    Step-by-step guide for hooks
  CHANGELOG.md              Track what you build over time
  MY_NOTES.md               Personal learning journal

marketplace-submissions/    Plugins polished and ready to submit

.github/
  workflows/
    validate-marketplace.yml  CI: validate registry on every push
    test-plugins.yml          CI: validate and test changed plugins

.pluginrc                   Local development configuration
README.md                   Home page and overview
QUICK_START.md              Getting started in minutes
CONTRIBUTING.md             This file
CLAUDE.md                   Project rules for Claude Code
```

---

## Making Changes

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b fix/my-fix-description
   ```

2. **Make your changes.** Follow the conventions below.

3. **Validate** your changes locally:
   ```bash
   node marketplace/scripts/validate-marketplace.js
   node marketplace/scripts/validate-plugins.js
   ```

4. **Test** any script changes:
   ```bash
   npm test
   ```

5. **Commit** using the commit format below.

6. **Push** and open a pull request.

### Editing `marketplace.json`

- Always update `marketplace.last_updated` to the current date in ISO 8601 format (e.g. `2026-03-14T00:00:00Z`).
- Category `id` values are kebab-case and must not be changed once published (plugins reference them).
- Run `node scripts/validate-marketplace.js` after every edit.

### Editing Schema Files

- Schemas use JSON Schema draft-07.
- Do not introduce breaking changes to existing required fields without a major version bump to `validation.schema_version` in `marketplace.json`.
- Add tests for any new constraints.

### Editing Validation Scripts

- Scripts have no runtime dependencies. Do not add `require()` calls for npm packages.
- Keep validation logic self-contained and easy to audit.
- Add a brief comment for any non-obvious logic.

---

## Commit Guidelines

Use the following format:

```
<type>(<scope>): <short summary>

[optional body — wrap at 72 characters]
```

Types:

| Type | When to use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation changes only |
| `schema` | Changes to JSON Schema files |
| `ci` | Changes to GitHub Actions workflows |
| `chore` | Maintenance tasks (dependency updates, formatting) |

Examples:

```
feat(scripts): add --strict flag to validate-marketplace.js
fix(schema): allow prerelease semver in plugin version field
docs(submission): clarify elevated security review timeline
```

---

## Pull Request Process

1. Ensure all CI checks pass.
2. Provide a clear description of what changed and why.
3. Reference any related issues with `Fixes #123` or `Relates to #456`.
4. Request a review from a marketplace maintainer (`@anthropics/marketplace-team`).
5. PRs are merged by maintainers using squash merge to keep the history clean.

### Review SLA

Maintainers aim to provide initial feedback within **5 business days**. Complex changes (schema modifications, new workflow features) may take longer.

---

## Questions

Open a GitHub Discussion or email [plugins@anthropic.com](mailto:plugins@anthropic.com).
