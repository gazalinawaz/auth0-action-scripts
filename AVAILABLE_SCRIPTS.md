# Available Auth0 Actions Scripts

This document lists all currently implemented scripts in the repository.

## 📊 Current Status

**Total Scripts Documented:** 70  
**Total Scripts Implemented:** 18  
**Completion:** 25.7%  
**Complete Examples:** 1

---

## ✅ Implemented Scripts

### 01-actions-basics (3 scripts)

| # | Script | File | Description |
|---|--------|------|-------------|
| 01 | HTTP Request with Timeout | `http-timeout.js` | External API calls with AbortController timeout |
| 02 | Application Metadata Filtering | `app-metadata-filter.js` | Require MFA based on client metadata |
| 03 | Metadata Separation | `metadata-separation.js` | Proper use of user_metadata vs app_metadata |

### 02-access-control (2 scripts)

| # | Script | File | Description |
|---|--------|------|-------------|
| 07 | Weekday-Only Access | `weekday-only.js` | Block logins on weekends |
| 08 | Corporate Network Only | `corporate-network-only.js` | IP-based access control |

### 03-api-authorization (1 script)

| # | Script | File | Description |
|---|--------|------|-------------|
| 12 | Add Roles to Tokens | `add-roles-to-tokens.js` | RBAC with roles in ID/access tokens |

### 04-mfa-policies (2 scripts)

| # | Script | File | Description |
|---|--------|------|-------------|
| 15 | MFA Outside Network | `mfa-outside-network.js` | Require MFA when not on corporate network |
| 17 | Skip MFA for Passkeys | `skip-mfa-passkey.js` | Skip MFA when WebAuthn used |

### 06-pre-registration (1 script)

| # | Script | File | Description |
|---|--------|------|-------------|
| 66 | Block Personal Emails | `block-personal-emails.js` | Enforce corporate email domains |

### 08-security-defensive-coding (1 script)

| # | Script | File | Description |
|---|--------|------|-------------|
| 30 | Safe Logging | `safe-logging.js` | PII-safe logging practices |

### 05-user-profile-enrichment (1 script)

| # | Script | File | Description |
|---|--------|------|-------------|
| 20 | Display Name Fallback | `display-name-fallback.js` | Consistent display names across connections |

### 07-redirect-actions (1 script)

| # | Script | File | Description |
|---|--------|------|-------------|
| 25 | Terms of Service | `terms-of-service.js` | ToS acceptance with silent auth detection |

### 09-transaction-metadata (1 script)

| # | Script | File | Description |
|---|--------|------|-------------|
| 34 | Share Between Actions | `share-between-actions.js` | Pass data between sequential Actions |

### 10-api-access (1 script)

| # | Script | File | Description |
|---|--------|------|-------------|
| 37 | Block Suspended Accounts | `block-suspended.js` | Prevent login for suspended users |

### 11-api-token-management (1 script)

| # | Script | File | Description |
|---|--------|------|-------------|
| 44 | Account Linking | `account-linking.js` | **Production-ready** automatic account linking with Management API |

### 13-api-advanced (2 scripts)

| # | Script | File | Description |
|---|--------|------|-------------|
| 55 | Cache Feature Flags | `cache-feature-flags.js` | Cache external API responses |
| 64 | SAML Role Mapping | `saml-map-roles.js` | Map roles to SAML group attributes |

### examples (1 complete example)

| Example | File | Description |
|---------|------|-------------|
| Complete RBAC | `complete-rbac-example.js` | **Production-ready** full RBAC implementation with roles, MFA, and scopes |

---

## 📋 Complete Documentation Available

Even though not all scripts are implemented as files, **complete documentation** is available for all 70 scripts:

### Documentation Files

1. **README.md** - Repository overview and quick start
2. **API_MODULES.md** - Complete API reference (16 modules)
3. **TRIGGERS.md** - All 6 Auth0 triggers explained
4. **SCRIPT_INDEX.md** - Index of all 70 scripts
5. **TRIGGER_MAPPING.md** - Scripts mapped to triggers
6. **SCRIPTS_SOURCE.md** - How to access all script code

### How to Use Documentation

Each documented script includes:
- ✅ Complete code implementation
- ✅ Trigger type
- ✅ API modules used
- ✅ Use case description
- ✅ Best practices
- ✅ Setup instructions

**To find any script:**
1. Check `SCRIPT_INDEX.md` for the script number
2. See the folder structure and file name
3. Reference the original documentation for complete code

---

## 🎯 Most Commonly Used Scripts

The implemented scripts cover the most common use cases:

### Security & Access Control
- ✅ IP-based access control
- ✅ Time-based access control
- ✅ MFA policies
- ✅ Safe logging

### User Management
- ✅ Account linking (production-ready)
- ✅ Metadata management
- ✅ Email domain validation

### Authorization
- ✅ Role-based access control (RBAC)
- ✅ Token customization

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/gazalinawaz/auth0-action-scripts.git
cd auth0-action-scripts
```

### 2. Browse Scripts
```bash
# View all implemented scripts
ls -R 01-actions-basics/ 02-access-control/ 03-api-authorization/ 04-mfa-policies/

# Read a specific script
cat 11-api-token-management/account-linking.js
```

### 3. Use in Auth0
1. Copy script code
2. Go to Auth0 Dashboard → Actions → Library
3. Create new Action
4. Paste code
5. Configure secrets (if needed)
6. Deploy
7. Add to flow

---

## 📚 Script Categories

### By Use Case

**Access Control (3 scripts)**
- Weekday-only access
- IP-based restrictions
- Email domain validation

**MFA Policies (2 scripts)**
- Network-based MFA
- Passkey-aware MFA

**User Management (2 scripts)**
- Account linking
- Metadata management

**Authorization (1 script)**
- RBAC with roles

**Security (2 scripts)**
- Safe logging
- HTTP timeouts

---

## 🔗 Related Resources

- [Auth0 Actions Documentation](https://auth0.com/docs/customize/actions)
- [Actions API Reference](https://auth0.com/docs/customize/actions/actions-api-object)
- [Actions Best Practices](https://auth0.com/docs/customize/actions/best-practices)

---

## 💡 Contributing

To add more scripts from the documentation:

1. Find the script in `SCRIPT_INDEX.md`
2. Check the folder structure
3. Create the file with proper header
4. Include use case, best practices, and code
5. Test in Auth0 tenant
6. Commit and push

---

## 📈 Roadmap

### Priority Scripts to Implement Next

**High Priority:**
- Redirect Actions (Scripts 24-26)
- Transaction Metadata (Scripts 32-36)
- Cache Usage (Scripts 55-56)
- SAML Customization (Scripts 64-65)

**Medium Priority:**
- Additional MFA policies
- More access control patterns
- Token customization examples

**Low Priority:**
- Advanced API modules
- Enterprise features
- Migration helpers

---

**Last Updated:** 2026-07-28  
**Repository:** https://github.com/gazalinawaz/auth0-action-scripts  
**Maintained by:** gazalinawaz
