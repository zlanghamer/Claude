# Plugin Submission Process

This guide walks you through every step required to submit a plugin to the Claude Code Plugin Marketplace.

---

## Overview

```
Author                     Anthropic Review Team
  │                               │
  ├── 1. Prepare plugin ──────────┤
  ├── 2. Self-validate ───────────┤
  ├── 3. Open PR ────────────────►│
  │                               ├── 4. Automated checks
  │                               ├── 5. Security review
  │                               ├── 6. Human review
  │◄──────────────────────────────┤
  ├── 7. Address feedback ───────►│
  │◄──────────────────────────────┤
  │                               ├── 8. Merge & publish
```

Review SLA: **14 business days** from initial submission.

---

## Step 1: Prepare Your Plugin

Before opening a pull request, ensure your plugin meets all requirements in [PLUGIN_GUIDELINES.md](./PLUGIN_GUIDELINES.md).

Checklist:

- [ ] `plugin.json` is present and complete
- [ ] `README.md` documents purpose, installation, configuration, and usage
- [ ] All tests pass locally on your development platform
- [ ] Code passes linting with no errors
- [ ] License file is included and matches `plugin.json`
- [ ] No secrets or credentials are committed to the repository

---

## Step 2: Self-Validate Locally

Run the bundled validation scripts from the marketplace repository root:

```bash
# Validate marketplace.json (optional — verifies registry integrity)
node marketplace/scripts/validate-marketplace.js

# Validate your plugin manifest
node marketplace/scripts/validate-plugins.js path/to/your-plugin/plugin.json
```

Fix all errors before proceeding. Warnings should also be reviewed.

---

## Step 3: Fork and Open a Pull Request

1. Fork this repository on GitHub.
2. Create a branch named `add-plugin/<your-plugin-name>`.
3. Add your plugin:
   - **Official Anthropic plugins:** place the plugin directory inside `plugins/`.
   - **Community plugins:** place the plugin directory inside `marketplace/external_plugins/`.
4. Update `.claude-plugin/marketplace.json`:
   - Add an entry to `registry.community_plugins` (or `registry.official_plugins` for Anthropic-authored plugins).
   - Entry must include: `id`, `name`, `version`, `category`, `repository`.
5. Open a pull request against the `main` branch.
6. Fill in the pull request template completely.

### Pull Request Template

```markdown
## Plugin Submission: <plugin-name>

### Description
<!-- What does this plugin do? -->

### Category
<!-- code-intelligence | integrations | workflows | learning -->

### Checklist
- [ ] plugin.json is valid (node scripts/validate-plugins.js passes)
- [ ] Tests pass (npm test or equivalent)
- [ ] README.md is complete
- [ ] No hardcoded secrets
- [ ] Changelog updated (if v1.0.0+)
- [ ] All declared capabilities are necessary
- [ ] License is on the allowlist

### Security Notes
<!-- Describe any network calls, shell execution, or file system access -->
```

---

## Step 4: Automated Checks

When your PR is opened, GitHub Actions will automatically run:

- **Marketplace validation** (`validate-marketplace.yml`) — checks `marketplace.json` integrity.
- **Plugin validation** (`test-plugins.yml`) — validates changed `plugin.json` files and runs plugin tests if a `package.json` with a `test` script is present.

All automated checks must pass before human review begins. Fix any failures and push to your branch.

---

## Step 5: Security Review

Plugins requesting `shell` or `network` capabilities are subject to an elevated security review. A member of the Anthropic security team will:

- Audit all network destinations for each `network` call.
- Review shell commands for injection risks.
- Verify that capability usage matches the declarations in `plugin.json`.

This review may add up to 5 additional business days to the review timeline.

---

## Step 6: Human Review

A member of the Anthropic marketplace team will review:

- Code quality and adherence to guidelines.
- Documentation completeness.
- UX and error handling.
- Compatibility with the declared minimum Claude Code version.

Reviewers will leave comments directly on the PR. You will be notified via GitHub.

---

## Step 7: Address Feedback

Respond to each review comment. Push updates to the same branch. Re-request review once all feedback is addressed.

If a review is not addressed within **30 days**, the PR will be closed. You may re-open it once you are ready to continue.

---

## Step 8: Merge and Publication

Once approved:

1. A maintainer will merge the PR.
2. The plugin will appear in the marketplace within **24 hours**.
3. The marketplace `last_updated` timestamp in `marketplace.json` will be updated automatically.

---

## Updating an Existing Plugin

To release a new version of an existing plugin:

1. Update the version in your plugin's `plugin.json` (follow semver).
2. Update the version in `registry.community_plugins` (or `registry.official_plugins`) inside `marketplace.json`.
3. Add a `CHANGELOG.md` entry.
4. Open a PR with title `update-plugin/<plugin-name>@<new-version>`.

---

## Removing a Plugin

To request removal of your plugin from the marketplace, open an issue with the title `remove-plugin: <plugin-name>` and explain the reason. Anthropic will process removal requests within 7 business days.

---

## Contact

For questions not covered here, email [plugins@anthropic.com](mailto:plugins@anthropic.com).
