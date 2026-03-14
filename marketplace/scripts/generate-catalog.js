#!/usr/bin/env node
/**
 * generate-catalog.js
 * Reads marketplace.json and all plugin manifests from plugins/ and
 * external_plugins/, then writes a flat, searchable catalog to
 * dist/catalog.json.
 *
 * Exit codes:
 *   0 — catalog generated successfully
 *   1 — fatal error during generation
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const REPO_ROOT   = path.join(__dirname, '..');
const DIST_DIR    = path.join(REPO_ROOT, 'dist');
const CATALOG_OUT = path.join(DIST_DIR, 'catalog.json');

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
    if (entry.isDirectory()) {
      const manifestPath = path.join(rootDir, entry.name, 'plugin.json');
      if (fs.existsSync(manifestPath)) {
        manifests.push(manifestPath);
      }
    }
  }
  return manifests;
}

// ---------------------------------------------------------------------------
// Catalog entry builder
// ---------------------------------------------------------------------------

/**
 * Converts a plugin manifest into a normalized catalog entry.
 * Only searchable / display fields are kept; sensitive internal fields
 * (e.g. configuration.defaults) are stripped.
 */
function buildCatalogEntry(manifest, source) {
  return {
    id:              manifest.name,
    display_name:    manifest.display_name || manifest.name,
    version:         manifest.version,
    description:     manifest.description,
    author:          manifest.author
      ? { name: manifest.author.name, url: manifest.author.url || null }
      : null,
    category:        manifest.category,
    tags:            Array.isArray(manifest.tags) ? manifest.tags : [],
    license:         manifest.license || null,
    homepage:        manifest.homepage || null,
    repository:      manifest.repository ? manifest.repository.url : null,
    capabilities:    Array.isArray(manifest.capabilities) ? manifest.capabilities : [],
    min_claude_version: manifest.min_claude_version || null,
    source,                    // 'official' | 'community' | 'local'
    indexed_at: new Date().toISOString(),
    // Full-text search blob — concatenation of searchable text fields
    _search: [
      manifest.name,
      manifest.display_name || '',
      manifest.description || '',
      manifest.long_description || '',
      ...(Array.isArray(manifest.tags) ? manifest.tags : []),
      manifest.category || '',
      manifest.author ? manifest.author.name : '',
    ].join(' ').toLowerCase(),
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const outputPath = args[0] ? path.resolve(args[0]) : CATALOG_OUT;

  log('info', 'Generating plugin catalog...');

  // Load marketplace registry
  const marketplacePath = path.join(REPO_ROOT, '.claude-plugin', 'marketplace.json');
  let marketplace;
  try {
    marketplace = loadJSON(marketplacePath);
  } catch (err) {
    log('error', `Could not load marketplace.json: ${err.message}`);
    process.exit(1);
  }

  const catalog = {
    generated_at: new Date().toISOString(),
    marketplace_version: marketplace.marketplace.version,
    api_version: marketplace.marketplace.api_version,
    categories: marketplace.categories,
    plugins: [],
    stats: {
      total: 0,
      by_category: {},
      by_source: { official: 0, community: 0, local: 0 },
    },
  };

  // --- Registry entries from marketplace.json ---
  const registryEntries = [
    ...(marketplace.registry.official_plugins || []).map(p => ({ ...p, _source: 'official' })),
    ...(marketplace.registry.community_plugins || []).map(p => ({ ...p, _source: 'community' })),
  ];

  for (const entry of registryEntries) {
    const catalogEntry = {
      id:           entry.id,
      display_name: entry.name,
      version:      entry.version,
      description:  entry.description || '',
      category:     entry.category,
      repository:   entry.repository,
      verified:     entry.verified || false,
      deprecated:   entry.deprecated || false,
      source:       entry._source,
      indexed_at:   new Date().toISOString(),
      _search: [entry.id, entry.name, entry.description || '', entry.category].join(' ').toLowerCase(),
    };
    catalog.plugins.push(catalogEntry);
  }

  // --- Local plugin manifests from plugins/ and external_plugins/ ---
  const pluginsDir  = path.join(REPO_ROOT, 'plugins');
  const externalDir = path.join(REPO_ROOT, 'external_plugins');
  const manifestPaths = [
    ...findPluginManifests(pluginsDir).map(p => ({ path: p, source: 'official' })),
    ...findPluginManifests(externalDir).map(p => ({ path: p, source: 'community' })),
  ];

  let localErrors = 0;
  for (const { path: manifestPath, source } of manifestPaths) {
    let manifest;
    try {
      manifest = loadJSON(manifestPath);
    } catch (err) {
      log('warn', `Skipping ${manifestPath}: ${err.message}`);
      localErrors++;
      continue;
    }

    // Avoid duplicates already in registry
    const existing = catalog.plugins.find(p => p.id === manifest.name);
    if (existing) {
      log('warn', `Plugin "${manifest.name}" already in registry — skipping local manifest`);
      continue;
    }

    catalog.plugins.push(buildCatalogEntry(manifest, source));
  }

  // --- Compute stats ---
  catalog.stats.total = catalog.plugins.length;
  for (const plugin of catalog.plugins) {
    // By category
    const cat = plugin.category || 'uncategorized';
    catalog.stats.by_category[cat] = (catalog.stats.by_category[cat] || 0) + 1;
    // By source
    const src = plugin.source || 'local';
    if (src in catalog.stats.by_source) {
      catalog.stats.by_source[src]++;
    }
  }

  // --- Write output ---
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8');

  log('ok', `Catalog written to: ${outputPath}`);
  log('info', `  Total plugins indexed: ${catalog.stats.total}`);
  log('info', `  Official: ${catalog.stats.by_source.official}, Community: ${catalog.stats.by_source.community}`);
  if (localErrors > 0) {
    log('warn', `  ${localErrors} manifest(s) skipped due to errors`);
  }
}

main();
