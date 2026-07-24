# Auth0 Actions Reference Library

A comprehensive collection of 70 production-ready Auth0 Actions scripts organized by use case and trigger type.

## 📚 Overview

This repository contains official Auth0 Actions patterns covering:
- **14 functional sections** (Access Control, MFA, API Authorization, etc.)
- **10 Auth0 API modules** (api.access, api.multifactor, api.redirect, etc.)
- **Multiple trigger types** (Post-Login, Pre-Registration, Custom Token Exchange, etc.)

All scripts are based on [Auth0's official documentation](https://auth0.com/docs/customize/actions).

> **📝 Note:** Individual script files are being added incrementally. See [SCRIPTS_SOURCE.md](./SCRIPTS_SOURCE.md) for the complete reference document with all 70 scripts.

## 🗂️ Repository Structure

```
auth0-action-scripts/
├── README.md                          # This file
├── TRIGGERS.md                        # Auth0 triggers reference
├── API_MODULES.md                     # API module documentation
├── 01-actions-basics/                 # Core patterns & best practices
├── 02-access-control/                 # Login restrictions & policies
├── 03-api-authorization/              # Token claims & scopes
├── 04-mfa-policies/                   # Multi-factor authentication
├── 05-user-profile-enrichment/        # Profile data management
├── 06-pre-registration/               # Sign-up validation
├── 07-redirect-actions/               # External page flows
├── 08-security-defensive-coding/      # Security best practices
├── 09-transaction-metadata/           # Cross-action data sharing
├── 10-api-access/                     # api.access use cases
├── 11-api-authentication/             # api.authentication use cases
├── 12-api-token-management/           # Token lifecycle management
├── 13-api-advanced/                   # Cache, SAML, Groups, etc.
└── examples/                          # Complete working examples
```

## 🎯 Auth0 Triggers

Auth0 Actions are executed at specific points in the authentication flow:

| Trigger | When It Runs | Common Use Cases |
|---------|--------------|------------------|
| **Post-Login** | After successful authentication | MFA, claims, access control |
| **Pre-User Registration** | Before user account creation | Email validation, metadata |
| **Post-User Registration** | After user account creation | Welcome emails, provisioning |
| **Post-Change Password** | After password change | Notifications, security alerts |
| **Send Phone Message** | When sending SMS/voice | Custom SMS providers |
| **Custom Token Exchange** | Token exchange flow | Cross-audience tokens |

See [TRIGGERS.md](./TRIGGERS.md) for detailed documentation.

## 🔧 API Modules

Auth0 Actions provide 10+ API modules for different operations:

- **api.access** - Allow/deny login
- **api.accessToken** - Modify access tokens
- **api.idToken** - Modify ID tokens
- **api.multifactor** - Control MFA
- **api.authentication** - Challenge, enroll, link accounts
- **api.redirect** - External page flows
- **api.user** - Update user metadata
- **api.cache** - Store temporary data
- **api.transaction** - Share data between actions
- **api.session** - Manage session lifecycle

See [API_MODULES.md](./API_MODULES.md) for complete reference.

## 📖 Quick Start

### 1. Browse by Use Case

Navigate to the relevant section folder:

```bash
# Access control examples
cd 02-access-control/

# MFA policies
cd 04-mfa-policies/

# Security best practices
cd 08-security-defensive-coding/
```

### 2. Copy Script Template

Each script includes:
- ✅ Trigger type annotation
- ✅ Use case description
- ✅ Required secrets/dependencies
- ✅ Error handling
- ✅ Logging best practices

### 3. Deploy to Auth0

```bash
# Using Auth0 CLI
auth0 actions create

# Or via Management API
# See examples/deploy-action.js
```

## 🔍 Find Scripts by Category

### Access Control
- [Weekday-only access](./02-access-control/weekday-only.js)
- [IP range restrictions](./02-access-control/corporate-network-only.js)
- [Email domain blocking](./02-access-control/block-email-domain.js)
- [TLS fingerprint detection](./02-access-control/block-suspicious-tls.js)

### MFA Policies
- [Geo-based MFA](./04-mfa-policies/geo-based-mfa.js)
- [Network-based MFA](./04-mfa-policies/corporate-network-skip-mfa.js)
- [Passkey skip MFA](./04-mfa-policies/skip-mfa-passkey.js)
- [Risk-based step-up](./04-mfa-policies/risk-based-stepup.js)

### Token Customization
- [Add roles to tokens](./03-api-authorization/add-roles-to-tokens.js)
- [Modify scopes](./03-api-authorization/modify-scopes.js)
- [Custom claims](./03-api-authorization/custom-claims.js)

### Security Best Practices
- [Secrets management](./08-security-defensive-coding/secrets-manager.js)
- [No PII in URLs](./08-security-defensive-coding/no-pii-in-urls.js)
- [Safe logging](./08-security-defensive-coding/safe-logging.js)
- [Input validation](./08-security-defensive-coding/validate-untrusted-input.js)

### Redirect Flows
- [Terms of Service](./07-redirect-actions/terms-of-service.js)
- [Progressive profiling](./07-redirect-actions/progressive-profiling.js)
- [Custom verification](./07-redirect-actions/custom-verification.js)

## 🏷️ Script Index

| # | Script Name | Section | Trigger | API Modules |
|---|-------------|---------|---------|-------------|
| 01 | HTTP Request with Timeout | Basics | Post-Login | user |
| 02 | Application Metadata Filtering | Basics | Post-Login | multifactor |
| 03 | user_metadata vs app_metadata | Basics | Post-Login | user, idToken |
| 04 | Enrich User Profile | Basics | Post-Login | user |
| 05 | Deny Access Gracefully | Basics | Post-Login | access |
| 06 | Use event.request.hostname | Basics | Post-Login | - |
| 07 | Weekday-only Access | Access Control | Post-Login | access |
| 08 | Corporate Network Only | Access Control | Post-Login | access |
| 09 | Block API by Audience | Access Control | Post-Login | access |
| 10 | Block Email Domain | Access Control | Post-Login | access |
| 11 | Block Suspicious TLS | Access Control | Pre-Registration | access |
| 12 | Add Roles to Tokens | API Auth | Post-Login | idToken, accessToken |
| 13 | Modify Scopes | API Auth | Post-Login | accessToken |
| 14 | Custom Token Exchange | API Auth | Token Exchange | accessToken |
| 15 | MFA Outside Network | MFA | Post-Login | multifactor |
| 16 | Geo-based MFA | MFA | Post-Login | multifactor |
| 17 | Skip MFA for Passkey | MFA | Post-Login | multifactor |
| 18 | Risk-based Step-up MFA | MFA | Post-Login | transaction, multifactor |
| 19 | Store External User ID | Enrichment | Pre-Registration | user |
| 20 | Connection-Safe Display Name | Enrichment | Post-Login | idToken |
| 21 | Set Default Picture | Enrichment | Post-Login | user |
| 22 | Deny Registration by Geo | Pre-Registration | Pre-Registration | access |
| 23 | Set Metadata on Registration | Pre-Registration | Pre-Registration | user |
| 24 | Redirect for Favorite Color | Redirect | Post-Login | redirect |
| 25 | Terms of Service | Redirect | Post-Login | redirect, access |
| 26 | Preserve Transaction Metadata | Redirect | Post-Login | transaction, redirect |
| 27 | Secrets Manager | Security | Post-Login | user |
| 28 | No PII in URLs | Security | Post-Login | redirect |
| 29 | Validate Untrusted Input | Security | Post-Login | idToken |
| 30 | Safe Logging | Security | Post-Login | - |
| 31 | Guard Clauses | Security | Post-Login | access, idToken |
| 32-36 | Transaction Metadata Patterns | Transaction | Post-Login | transaction |
| 37-39 | api.access Use Cases | Use Cases | Post-Login | access |
| 40-41 | api.accessToken Use Cases | Use Cases | Post-Login | accessToken |
| 42-45 | api.authentication Use Cases | Use Cases | Post-Login | authentication |
| 46-47 | api.idToken Use Cases | Use Cases | Post-Login | idToken |
| 48-50 | api.multifactor Use Cases | Use Cases | Post-Login | multifactor |
| 51-52 | api.redirect Use Cases | Use Cases | Post-Login | redirect |
| 53-54 | api.user Use Cases | Use Cases | Post-Login | user |
| 55-56 | api.cache Use Cases | Use Cases | Post-Login | cache |
| 57-58 | api.transaction Use Cases | Use Cases | Post-Login | transaction |
| 59-60 | api.session Use Cases | Use Cases | Post-Login | session |
| 61-62 | api.refreshToken Use Cases | Use Cases | Post-Login | refreshToken |
| 63 | api.prompt Use Cases | Use Cases | Post-Login | prompt |
| 64-65 | api.samlResponse Use Cases | Use Cases | Post-Login | samlResponse |
| 66-67 | api.validation Use Cases | Use Cases | Pre-Registration | validation |
| 68 | api.rules Use Cases | Use Cases | Post-Login | rules |
| 69-70 | api.groups Use Cases | Use Cases | Post-Login | groups |

## 🚀 Common Patterns

### Pattern 1: Conditional MFA
```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Check condition
  if (event.request.geoip.continentCode !== 'EU') {
    api.multifactor.enable('any');
  }
};
```

### Pattern 2: Custom Claims
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const ns = 'https://my-app.example.com';
  api.idToken.setCustomClaim(`${ns}/role`, event.user.app_metadata?.role);
};
```

### Pattern 3: Redirect Flow
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const token = api.redirect.encodeToken({
    secret: event.secrets.REDIRECT_SECRET,
    expiresInSeconds: 300,
    payload: { userId: event.user.user_id }
  });
  api.redirect.sendUserTo('https://verify.example.com', {
    query: { session_token: token }
  });
};

exports.onContinuePostLogin = async (event, api) => {
  const payload = api.redirect.validateToken({
    secret: event.secrets.REDIRECT_SECRET
  });
  // Process result
};
```

## 🔐 Security Best Practices

1. **Never hardcode secrets** - Use Auth0 Secrets Manager
2. **No PII in URLs** - Use signed redirect tokens
3. **Validate untrusted input** - Allowlist validation
4. **Safe logging** - Keep under 256 chars, no PII
5. **Use guard clauses** - Fail fast, clear error messages
6. **Never throw errors** - Use `api.access.deny()` instead
7. **Timeout external calls** - Use AbortController
8. **Use event.request.hostname** - Works with custom domains

## 📚 Resources

- [Auth0 Actions Documentation](https://auth0.com/docs/customize/actions)
- [Actions API Reference](https://auth0.com/docs/customize/actions/actions-api-object)
- [Actions Triggers](https://auth0.com/docs/customize/actions/triggers)
- [Actions Limitations](https://auth0.com/docs/customize/actions/limitations)
- [Actions Best Practices](https://auth0.com/docs/customize/actions/best-practices)

## 📝 License

These scripts are based on Auth0's official documentation and examples.

## 🤝 Contributing

To add new scripts:
1. Follow the existing file structure
2. Include trigger type and use case description
3. Add error handling and logging
4. Update this README with the new script
5. Test thoroughly before deployment

---

**Total Scripts:** 70  
**Last Updated:** 2026-07-24  
**Source:** auth0.com/docs/customize/actions
