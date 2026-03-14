# Plugin Quality Guidelines

This document defines the quality standards all Claude Code plugins must meet before being listed in the official marketplace.

---

## 1. General Principles

- **Do one thing well.** A plugin should have a focused, well-defined purpose.
- **Respect the user.** Never collect data the user has not explicitly consented to share.
- **Be transparent.** Declare every permission (capability) your plugin needs. Do not request capabilities you do not use.
- **Stay maintained.** Plugins that are unmaintained for more than 12 months may be delisted.

---

## 2. Code Quality

### 2.1 Testing

| Requirement | Minimum |
|---|---|
| Unit test coverage | 80 % of code paths |
| Integration tests | At least one end-to-end scenario |
| Test runner | Any standard framework (Jest, Mocha, Vitest, etc.) |

All tests must pass on the three supported platforms: **linux**, **darwin** (macOS), and **win32**.

### 2.2 Linting and Formatting

- Code must pass linting with no errors (warnings are acceptable but should be addressed).
- Use a consistent formatter (Prettier, ESLint, etc.) and include a configuration file in the repository.

### 2.3 Dependencies

- Minimise third-party dependencies. Each dependency increases attack surface and bundle size.
- All dependencies must be pinned to a specific version (or use a lock file).
- Do not bundle dependencies that are already provided by the Claude Code runtime.

### 2.4 TypeScript / Type Safety

- TypeScript is strongly encouraged for new plugins.
- If using plain JavaScript, JSDoc type annotations are required for all exported functions.

---

## 3. Security

See [SECURITY_POLICY.md](./SECURITY_POLICY.md) for full requirements. Key points:

- Do not hardcode secrets, tokens, or credentials.
- Validate and sanitise all user-supplied input before use.
- Use `https` for all network requests; plain `http` is not permitted.
- Declare the minimum set of capabilities required. Requesting `shell` or `network` triggers an elevated security review.

---

## 4. Plugin Manifest (`plugin.json`)

Every plugin must include a valid `plugin.json` at its root, conforming to `.claude-plugin/schemas/plugin.schema.json`. Required fields:

| Field | Description |
|---|---|
| `name` | Unique kebab-case identifier (e.g. `my-plugin`) |
| `version` | Semantic version string (e.g. `1.2.3`) |
| `description` | 10–512 character summary |
| `author` | Object with at least `name` |
| `category` | One of `code-intelligence`, `integrations`, `workflows`, `learning` |
| `entry_point` | Relative path to the plugin's main file |
| `license` | SPDX identifier from the allowlist |
| `capabilities` | Array of permissions the plugin requests |

---

## 5. Documentation

- A `README.md` must exist in the plugin repository.
- The README must include: purpose, installation steps, configuration reference, and at least one usage example.
- A `CHANGELOG.md` is required for plugins at version `1.0.0` and above.

---

## 6. Versioning

- Follow [Semantic Versioning 2.0](https://semver.org/).
- Breaking changes must increment the major version.
- All published versions must be tagged in the repository (e.g. `git tag v1.2.3`).

---

## 7. Licensing

Only the following open-source licenses are accepted:

- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC

Proprietary or restrictively-licensed plugins will not be accepted into the official marketplace.

---

## 8. User Experience

- Plugin commands must provide `--help` output.
- Error messages must be actionable — tell the user what went wrong and how to fix it.
- Long-running operations must provide progress feedback.
- Plugins must not print excessive output that floods the Claude Code terminal.

---

## 9. Compatibility

- State the minimum Claude Code version your plugin requires (`min_claude_version` in `plugin.json`).
- Plugins must not crash on unsupported platforms — they should detect the platform and exit with a clear error message.
