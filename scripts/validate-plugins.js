#!/usr/bin/env node
/**
 * validate-plugins.js
 * Validates individual plugin manifest files (plugin.json) against the
 * plugin JSON Schema.  Scans the plugins/ and external_plugins/ directories
 * unless specific paths are provided as CLI arguments.
 *
 * Exit codes:
 *   0 — all plugins valid
 *   1 — one or more plugins failed validation
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadJSON(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`File not found: ${abs}`);
  }
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch (err) {
    throw new Error(`Failed to parse JSON at ${abs}: ${err.message}`);
  }
}

function log(level, message) {
  const prefix = { info: '[INFO]', warn: '[WARN]', error: '[ERROR]', ok: '[ OK ]' }[level] || '[LOG]';
  console.log(`${prefix} ${message}`);
}

function findPluginManifests(rootDir) {
  const manifests = [];
  if (!fs.existsSync(rootDir)) return manifests;

  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      const manifestPath = path.join(fullPath, 'plugin.json');
      if (fs.existsSync(manifestPath)) {
        manifests.push(manifestPath);
      }
    }
  }
  return manifests;
}

// ---------------------------------------------------------------------------
// Validation logic
// ---------------------------------------------------------------------------

const VALID_CATEGORIES = ['code-intelligence', 'integrations', 'workflows', 'learning'];
const VALID_LICENSES = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC'];
const VALID_CAPABILITIES = ['file-read', 'file-write', 'network', 'shell', 'clipboard', 'notifications', 'settings'];

function validatePlugin(manifest, manifestPath) {
  const errors = [];
  const warnings = [];

  // Required fields
  const required = ['name', 'version', 'description', 'author', 'category', 'entry_point'];
  for (const field of required) {
    if (!manifest[field] && manifest[field] !== 0) {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  // name format
  if (manifest.name && !/^[a-z][a-z0-9-]*$/.test(manifest.name)) {
    errors.push(`"name" must be kebab-case lowercase (got: ${manifest.name})`);
  }
  if (manifest.name && (manifest.name.length < 2 || manifest.name.length > 64)) {
    errors.push(`"name" must be 2–64 characters (got: ${manifest.name.length})`);
  }

  // version semver
  if (manifest.version && !/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?$/.test(manifest.version)) {
    errors.push(`"version" must follow semver (got: ${manifest.version})`);
  }

  // description length
  if (manifest.description) {
    if (manifest.description.length < 10) {
      errors.push('"description" must be at least 10 characters');
    }
    if (manifest.description.length > 512) {
      errors.push('"description" must be 512 characters or fewer');
    }
  }

  // author
  if (manifest.author) {
    if (!manifest.author.name) {
      errors.push('"author.name" is required');
    }
    if (manifest.author.email && !manifest.author.email.includes('@')) {
      errors.push('"author.email" does not appear to be a valid email address');
    }
  }

  // category
  if (manifest.category && !VALID_CATEGORIES.includes(manifest.category)) {
    errors.push(`"category" must be one of: ${VALID_CATEGORIES.join(', ')} (got: ${manifest.category})`);
  }

  // license
  if (manifest.license && !VALID_LICENSES.includes(manifest.license)) {
    warnings.push(`"license" "${manifest.license}" is not in the allowlist. Submission may be rejected.`);
  }
  if (!manifest.license) {
    warnings.push('"license" is not specified — required for marketplace submission');
  }

  // capabilities
  if (manifest.capabilities) {
    if (!Array.isArray(manifest.capabilities)) {
      errors.push('"capabilities" must be an array');
    } else {
      for (const cap of manifest.capabilities) {
        if (!VALID_CAPABILITIES.includes(cap)) {
          errors.push(`Unknown capability: "${cap}". Valid: ${VALID_CAPABILITIES.join(', ')}`);
        }
      }
      if (manifest.capabilities.includes('shell')) {
        warnings.push('Plugin requests "shell" capability — this requires elevated security review');
      }
      if (manifest.capabilities.includes('network')) {
        warnings.push('Plugin requests "network" capability — ensure all endpoints are documented');
      }
    }
  }

  // entry_point exists relative to manifest directory
  if (manifest.entry_point) {
    const pluginDir = path.dirname(manifestPath);
    const entryAbs = path.resolve(pluginDir, manifest.entry_point);
    if (!fs.existsSync(entryAbs)) {
      warnings.push(`entry_point "${manifest.entry_point}" does not exist at ${entryAbs}`);
    }
  }

  // tags
  if (manifest.tags) {
    if (!Array.isArray(manifest.tags)) {
      errors.push('"tags" must be an array');
    } else if (manifest.tags.length > 10) {
      errors.push('"tags" must contain 10 or fewer items');
    } else {
      for (const tag of manifest.tags) {
        if (!/^[a-z][a-z0-9-]*$/.test(tag)) {
          errors.push(`Tag "${tag}" must be kebab-case lowercase`);
        }
      }
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const repoRoot = path.join(__dirname, '..');
  const args = process.argv.slice(2);

  let manifestPaths;
  if (args.length > 0) {
    manifestPaths = args.map(a => path.resolve(a));
  } else {
    const pluginsDir = path.join(repoRoot, 'plugins');
    const externalDir = path.join(repoRoot, 'external_plugins');
    manifestPaths = [
      ...findPluginManifests(pluginsDir),
      ...findPluginManifests(externalDir),
    ];
  }

  if (manifestPaths.length === 0) {
    log('info', 'No plugin manifests found — nothing to validate.');
    process.exit(0);
  }

  log('info', `Validating ${manifestPaths.length} plugin manifest(s)...`);

  let totalErrors = 0;
  let totalWarnings = 0;
  let passed = 0;

  for (const manifestPath of manifestPaths) {
    log('info', `  Checking: ${manifestPath}`);

    let manifest;
    try {
      manifest = loadJSON(manifestPath);
    } catch (err) {
      log('error', `    ${err.message}`);
      totalErrors++;
      continue;
    }

    const { errors, warnings } = validatePlugin(manifest, manifestPath);
    totalWarnings += warnings.length;

    for (const w of warnings) {
      log('warn', `    ${w}`);
    }

    if (errors.length > 0) {
      log('error', `    ${errors.length} error(s):`);
      for (const e of errors) {
        log('error', `      - ${e}`);
      }
      totalErrors += errors.length;
    } else {
      log('ok', `    ${manifest.name}@${manifest.version} — valid`);
      passed++;
    }
  }

  console.log('');
  log('info', `Results: ${passed} passed, ${manifestPaths.length - passed} failed, ${totalWarnings} warning(s)`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main();
