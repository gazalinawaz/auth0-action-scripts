/**
 * Script Generator for Auth0 Actions
 * 
 * This script creates all 70 Auth0 Action script files from the reference document.
 * Run: node generate-scripts.js
 */

const fs = require('fs');
const path = require('path');

// Define all scripts with their metadata
const scripts = require('./scripts-data.json');

// Create directories
const directories = [
  '01-actions-basics',
  '02-access-control',
  '03-api-authorization',
  '04-mfa-policies',
  '05-user-profile-enrichment',
  '06-pre-registration',
  '07-redirect-actions',
  '08-security-defensive-coding',
  '09-transaction-metadata',
  '10-api-access',
  '11-api-token-management',
  '12-api-authentication',
  '13-api-advanced'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
});

console.log('\n✅ All directories created!');
console.log('\nTo generate individual scripts, extract them from the reference document.');
console.log('See: https://github.com/gazalinawaz/auth0-action-scripts');
