#!/usr/bin/env node
/**
 * validate-marketplace.js
 * Validates the marketplace.json registry against its JSON Schema.
 * Exits with code 0 on success, 1 on validation failure.
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

// ---------------------------------------------------------------------------
// Validation logic (no external deps — schema-lite checks)
// ---------------------------------------------------------------------------

function validateMarketplace(marketplace) {
  const errors = [];
  const warnings = [];

  // Top-level required keys
  const required = ['marketplace', 'owner', 'categories', 'registry', 'policies', 'validation'];
  for (const key of required) {
    if (!(key in marketplace)) {
      errors.push(`Missing required top-level key: "${key}"`);
    }
  }

  // marketplace section
  if (marketplace.marketplace) {
    const m = marketplace.marketplace;
    if (!m.version || !/^\d+\.\d+\.\d+$/.test(m.version)) {
      errors.push(`marketplace.version must be a semver string (got: ${m.version})`);
    }
    if (!m.api_version || !/^v\d+$/.test(m.api_version)) {
      errors.push(`marketplace.api_version must match "vN" (got: ${m.api_version})`);
    }
    if (!m.last_updated) {
      errors.push('marketplace.last_updated is required');
    }
  }

  // owner section
  if (marketplace.owner) {
    const o = marketplace.owner;
    for (const field of ['name', 'url', 'support_email', 'security_email', 'github']) {
      if (!o[field]) {
        errors.push(`owner.${field} is required`);
      }
    }
    if (o.support_email && !o.support_email.includes('@')) {
      errors.push(`owner.support_email does not look like a valid email`);
    }
  }

  // categories
  if (Array.isArray(marketplace.categories)) {
    if (marketplace.categories.length === 0) {
      errors.push('categories must contain at least one entry');
    }
    const seenIds = new Set();
    for (const [i, cat] of marketplace.categories.entries()) {
      if (!cat.id || !/^[a-z][a-z0-9-]*$/.test(cat.id)) {
        errors.push(`categories[${i}].id must be kebab-case (got: ${cat.id})`);
      }
      if (cat.id && seenIds.has(cat.id)) {
        errors.push(`Duplicate category id: "${cat.id}"`);
      }
      if (cat.id) seenIds.add(cat.id);
      for (const field of ['name', 'description', 'icon']) {
        if (!cat[field]) errors.push(`categories[${i}].${field} is required`);
      }
    }
  }

  // registry
  if (marketplace.registry) {
    const r = marketplace.registry;
    for (const pool of ['official_plugins', 'community_plugins']) {
      if (!Array.isArray(r[pool])) {
        errors.push(`registry.${pool} must be an array`);
      } else {
        for (const [i, plugin] of r[pool].entries()) {
          for (const field of ['id', 'name', 'version', 'category', 'repository']) {
            if (!plugin[field]) {
              errors.push(`registry.${pool}[${i}].${field} is required`);
            }
          }
          if (plugin.version && !/^\d+\.\d+\.\d+$/.test(plugin.version)) {
            errors.push(`registry.${pool}[${i}].version must be semver (got: ${plugin.version})`);
          }
        }
      }
    }
  }

  // policies
  if (marketplace.policies) {
    const p = marketplace.policies;
    if (typeof p.min_test_coverage === 'number' && (p.min_test_coverage < 0 || p.min_test_coverage > 100)) {
      errors.push('policies.min_test_coverage must be between 0 and 100');
    }
    if (!Array.isArray(p.license_allowlist) || p.license_allowlist.length === 0) {
      warnings.push('policies.license_allowlist is empty — consider adding allowed licenses');
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const marketplacePath = args[0] || path.join(__dirname, '..', '..', '.claude-plugin', 'marketplace.json');

  log('info', `Validating marketplace registry: ${marketplacePath}`);

  let marketplace;
  try {
    marketplace = loadJSON(marketplacePath);
  } catch (err) {
    log('error', err.message);
    process.exit(1);
  }

  const { errors, warnings } = validateMarketplace(marketplace);

  for (const w of warnings) {
    log('warn', w);
  }

  if (errors.length > 0) {
    log('error', `Validation failed with ${errors.length} error(s):`);
    for (const e of errors) {
      log('error', `  - ${e}`);
    }
    process.exit(1);
  }

  log('ok', 'marketplace.json is valid.');
  log('info', `  Official plugins: ${marketplace.registry?.official_plugins?.length ?? 0}`);
  log('info', `  Community plugins: ${marketplace.registry?.community_plugins?.length ?? 0}`);
  log('info', `  Categories: ${marketplace.categories?.length ?? 0}`);
}

main();
