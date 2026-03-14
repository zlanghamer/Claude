# Marketplace API Reference

This document describes the structure and conventions of the Claude Code Plugin Marketplace registry.

---

## Overview

The marketplace is file-based: all authoritative data lives in `.claude-plugin/marketplace.json`, validated against `.claude-plugin/schemas/marketplace.schema.json`. A derived, searchable catalog is generated from this registry by running `scripts/generate-catalog.js`.

```
.claude-plugin/
  marketplace.json          ← authoritative registry
  schemas/
    marketplace.schema.json ← JSON Schema for the registry
    plugin.schema.json      ← JSON Schema for individual plugin manifests

scripts/
  generate-catalog.js       ← produces dist/catalog.json

dist/
  catalog.json              ← generated searchable catalog (not committed)
```

---

## marketplace.json Structure

### Top-level object

| Key | Type | Description |
|---|---|---|
| `$schema` | string | Path to the marketplace schema |
| `marketplace` | object | Marketplace metadata |
| `owner` | object | Anthropic ownership information |
| `categories` | array | Available plugin categories |
| `registry` | object | Plugin lists |
| `policies` | object | Submission and quality policies |
| `validation` | object | Schema version and required field declarations |

### `marketplace` object

| Key | Type | Description |
|---|---|---|
| `name` | string | Marketplace display name |
| `version` | string | Semver — bumped on structural changes |
| `description` | string | Short description |
| `homepage` | string (URI) | Public marketplace URL |
| `api_version` | string | API version in `vN` format (e.g. `v1`) |
| `last_updated` | string (ISO 8601) | Timestamp of last modification |

### `owner` object

| Key | Type | Description |
|---|---|---|
| `name` | string | Organisation name |
| `url` | string (URI) | Organisation homepage |
| `support_email` | string (email) | Plugin support contact |
| `security_email` | string (email) | Security disclosure contact |
| `github` | string (URI) | GitHub organisation URL |

### `categories` array

Each entry:

| Key | Type | Description |
|---|---|---|
| `id` | string | Kebab-case unique identifier |
| `name` | string | Human-readable label |
| `description` | string | Category description |
| `icon` | string | Icon name (resolved by the UI) |

Valid category IDs:

- `code-intelligence`
- `integrations`
- `workflows`
- `learning`

### `registry` object

| Key | Type | Description |
|---|---|---|
| `official_plugins` | array | Plugins authored or endorsed by Anthropic |
| `community_plugins` | array | Third-party community plugins |

Each plugin entry in both arrays:

| Key | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Kebab-case unique identifier, matches `name` in `plugin.json` |
| `name` | string | Yes | Human-readable display name |
| `version` | string | Yes | Current published semver version |
| `category` | string | Yes | Must match a category `id` |
| `repository` | string (URI) | Yes | Canonical repository URL |
| `description` | string | No | Short description (shown in listings) |
| `verified` | boolean | No | Indicates Anthropic has audited this version |
| `deprecated` | boolean | No | Marks plugin as no longer recommended |

### `policies` object

| Key | Type | Description |
|---|---|---|
| `submission_review_days` | integer | Maximum review SLA in business days |
| `security_review_required` | boolean | Whether security review is mandatory |
| `min_test_coverage` | integer (0–100) | Minimum test coverage percentage |
| `requires_semantic_versioning` | boolean | Whether semver is enforced |
| `license_allowlist` | string[] | SPDX identifiers of permitted licenses |

### `validation` object

| Key | Type | Description |
|---|---|---|
| `schema_version` | string | Semver of the validation schema in use |
| `required_fields` | string[] | Fields required in every plugin manifest |

---

## plugin.json Structure

Each plugin ships its own `plugin.json` at the repository root. It must conform to `.claude-plugin/schemas/plugin.schema.json`.

### Required fields

| Field | Type | Constraints |
|---|---|---|
| `name` | string | Kebab-case, 2–64 chars |
| `version` | string | Semver (e.g. `1.2.3` or `1.2.3-beta.1`) |
| `description` | string | 10–512 characters |
| `author` | object | Must contain `name` |
| `category` | string | Must be a valid category `id` |
| `entry_point` | string | Relative path to the main file |

### Optional fields

| Field | Type | Description |
|---|---|---|
| `display_name` | string | Human-readable name (2–128 chars) |
| `long_description` | string | Markdown description (max 4096 chars) |
| `tags` | string[] | Up to 10 kebab-case tags |
| `license` | string | SPDX identifier (required for submission) |
| `homepage` | string (URI) | Plugin homepage |
| `repository` | object | `{ type: "git", url, directory? }` |
| `capabilities` | string[] | Permissions the plugin needs |
| `runtime` | object | `{ node?, platform? }` constraints |
| `dependencies` | object | npm-style dependency map |
| `peer_dependencies` | object | npm-style peer dependency map |
| `configuration` | object | `{ schema?, defaults? }` for plugin settings |
| `min_claude_version` | string | Minimum Claude Code version (semver) |
| `max_claude_version` | string | Maximum Claude Code version (semver) |

### Capabilities

| Capability | Description | Review level |
|---|---|---|
| `file-read` | Read files from the user's filesystem | Standard |
| `file-write` | Write or modify files | Standard |
| `network` | Make outbound HTTP/HTTPS requests | Elevated |
| `shell` | Execute shell commands | Elevated |
| `clipboard` | Read from or write to the clipboard | Standard |
| `notifications` | Send desktop notifications | Standard |
| `settings` | Read or modify Claude Code settings | Standard |

---

## Generated Catalog (`dist/catalog.json`)

Run `node scripts/generate-catalog.js` to produce a flat, searchable catalog. This file is not committed to the repository; it is regenerated on each CI run and served from CDN in production.

### Catalog structure

```json
{
  "generated_at": "<ISO 8601 timestamp>",
  "marketplace_version": "1.0.0",
  "api_version": "v1",
  "categories": [...],
  "plugins": [
    {
      "id": "my-plugin",
      "display_name": "My Plugin",
      "version": "1.0.0",
      "description": "...",
      "author": { "name": "...", "url": null },
      "category": "integrations",
      "tags": [],
      "license": "MIT",
      "homepage": null,
      "repository": "https://github.com/example/my-plugin",
      "capabilities": [],
      "min_claude_version": null,
      "source": "community",
      "indexed_at": "<ISO 8601 timestamp>",
      "_search": "<lowercase searchable blob>"
    }
  ],
  "stats": {
    "total": 1,
    "by_category": { "integrations": 1 },
    "by_source": { "official": 0, "community": 1, "local": 0 }
  }
}
```

The `_search` field is a pre-computed lowercase concatenation of all searchable text. Clients can implement full-text search by checking `plugin._search.includes(query.toLowerCase())`.

---

## Validation Scripts

| Script | Purpose | Usage |
|---|---|---|
| `scripts/validate-marketplace.js` | Validate `marketplace.json` | `node scripts/validate-marketplace.js [path]` |
| `scripts/validate-plugins.js` | Validate `plugin.json` files | `node scripts/validate-plugins.js [path...]` |
| `scripts/generate-catalog.js` | Generate `dist/catalog.json` | `node scripts/generate-catalog.js [output-path]` |

All scripts exit with code `0` on success and `1` on failure.
