#!/usr/bin/env node

// Fetch private resume data (JSON + photo) from a separate Git repository.
// Used by deploy environments that don't have the private files committed.
//
// Required env vars:
//   RESUME_DATA_REPO  e.g. "pietro1704/resume-data"
//   RESUME_DATA_TOKEN GitHub PAT (read-only; classic or fine-grained)
//
// Optional:
//   RESUME_DATA_REF   branch/tag/sha (default: master)
//
// If env vars are missing, this script silently no-ops so local development
// keeps working with the data already on disk (or with the example fallback).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = process.env.RESUME_DATA_REPO;
const TOKEN = process.env.RESUME_DATA_TOKEN;
const REF = process.env.RESUME_DATA_REF || 'master';
const TARGET_DIR = path.join(__dirname, '..', 'data', 'private');

if (!REPO || !TOKEN) {
  console.log('ℹ️  RESUME_DATA_REPO/TOKEN not set — skipping private data fetch.');
  console.log('   The build will fall back to data/resume.json or data/resume.example.json.');
  process.exit(0);
}

console.log(`🔐 Fetching private resume data from ${REPO}@${REF}...`);

if (fs.existsSync(TARGET_DIR)) {
  fs.rmSync(TARGET_DIR, { recursive: true, force: true });
}

const url = `https://x-access-token:${TOKEN}@github.com/${REPO}.git`;
try {
  execSync(`git clone --depth=1 --branch=${REF} ${url} ${TARGET_DIR}`, {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  fs.rmSync(path.join(TARGET_DIR, '.git'), { recursive: true, force: true });
  const files = fs.readdirSync(TARGET_DIR).join(', ');
  console.log(`✅ Private data ready in data/private/ (${files})`);
} catch (err) {
  console.error('❌ Failed to clone private resume data.');
  console.error('   Make sure RESUME_DATA_TOKEN has read access to the repo.');
  process.exit(1);
}
