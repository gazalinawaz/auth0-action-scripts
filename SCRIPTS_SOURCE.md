# Auth0 Actions Scripts Source

## 📝 About the Scripts

The 70 Auth0 Actions scripts documented in this repository are **reference implementations** based on Auth0's official documentation and best practices.

## 📦 Script Status

Currently, this repository contains:
- ✅ **Complete documentation** (README, TRIGGERS, API_MODULES, SCRIPT_INDEX, TRIGGER_MAPPING)
- ✅ **Directory structure** (all folders created)
- ⏳ **Individual script files** (being added incrementally)

## 🔍 Finding Scripts

### Option 1: Use the Original Reference Document

All 70 scripts are available in the original reference document you provided. Each script includes:
- Complete code implementation
- Trigger type
- API modules used
- Use case description
- Best practices

### Option 2: Extract from Documentation

The complete script code is documented in your original message. You can:

1. **Copy individual scripts** from the reference document
2. **Place them in the appropriate folder** based on SCRIPT_INDEX.md
3. **Add the header comments** for context

### Option 3: Generate Scripts Programmatically

Create a script to parse the original reference and generate all files:

```javascript
// See generate-scripts.js for a starting point
```

## 📂 Directory Structure

```
auth0-action-scripts/
├── 01-actions-basics/          # Scripts 01-06
├── 02-access-control/          # Scripts 07-11
├── 03-api-authorization/       # Scripts 12-14
├── 04-mfa-policies/            # Scripts 15-18
├── 05-user-profile-enrichment/ # Scripts 19-21
├── 06-pre-registration/        # Scripts 22-23
├── 07-redirect-actions/        # Scripts 24-26
├── 08-security-defensive-coding/ # Scripts 27-31
├── 09-transaction-metadata/    # Scripts 32-36
├── 10-api-access/              # Scripts 37-39
├── 11-api-token-management/    # Scripts 40-54, 59-63
└── 13-api-advanced/            # Scripts 55-70
```

## 🎯 Script Template

Each script file should follow this format:

```javascript
/**
 * Script XX — [Script Name]
 * 
 * Trigger: [Post-Login | Pre-User Registration | etc.]
 * API Modules: [api.access, api.user, etc.]
 * 
 * Use Case:
 * [Description of what this script does and when to use it]
 * 
 * Best Practices:
 * - [Key point 1]
 * - [Key point 2]
 * 
 * Dependencies (if any):
 * - [npm package name]
 * 
 * Secrets Required (if any):
 * - SECRET_NAME: [description]
 */

/**
 * @param {Event} event - Details about the user and context
 * @param {PostLoginAPI} api - Interface to modify login behavior
 */
exports.onExecutePostLogin = async (event, api) => {
  // Script implementation
};

// For redirect actions, also include:
exports.onContinuePostLogin = async (event, api) => {
  // Continue handler
};
```

## 🚀 Quick Start

### To add a script:

1. **Find the script** in the original reference document
2. **Identify the folder** using SCRIPT_INDEX.md
3. **Create the file** with appropriate name (e.g., `weekday-only.js`)
4. **Add the header** with metadata
5. **Copy the implementation** from the reference

### Example:

For Script 07 (Weekday-only access):
- **Folder:** `02-access-control/`
- **File:** `weekday-only.js`
- **Trigger:** Post-Login
- **APIs:** api.access

## 📚 Reference Documents

- [README.md](./README.md) - Repository overview
- [TRIGGERS.md](./TRIGGERS.md) - Trigger documentation
- [API_MODULES.md](./API_MODULES.md) - API reference
- [SCRIPT_INDEX.md](./SCRIPT_INDEX.md) - Complete script index
- [TRIGGER_MAPPING.md](./TRIGGER_MAPPING.md) - Trigger cross-reference

## 🔗 Auth0 Documentation

- [Actions Overview](https://auth0.com/docs/customize/actions)
- [Actions Triggers](https://auth0.com/docs/customize/actions/triggers)
- [Actions API Object](https://auth0.com/docs/customize/actions/actions-api-object)
- [Actions Best Practices](https://auth0.com/docs/customize/actions/best-practices)

## 💡 Contributing

To add scripts to this repository:

1. Extract scripts from the reference document
2. Follow the template format above
3. Test in your Auth0 tenant
4. Commit with descriptive messages
5. Update documentation if needed

---

**Note:** This is a reference library. Always test scripts in a development environment before deploying to production.

**Last Updated:** 2026-07-24
