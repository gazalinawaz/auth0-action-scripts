# Auth0 Actions Trigger Mapping

Cross-reference guide showing which scripts work with which Auth0 triggers.

## Auth0 Trigger Overview

Auth0 provides 6 main triggers where Actions can be executed:

1. **Post-Login** - After authentication, before token issuance
2. **Pre-User Registration** - Before user account creation
3. **Post-User Registration** - After user account creation
4. **Post-Change Password** - After password change
5. **Send Phone Message** - When sending SMS/voice for MFA
6. **Custom Token Exchange** - During OAuth 2.0 token exchange

---

## Trigger 1: Post-Login

**When it runs:** After successful authentication, before completing the login transaction.

**Total scripts:** 59

### Access Control (9 scripts)
- ✅ Script 05: Deny Access Gracefully
- ✅ Script 07: Allow Access Only on Weekdays
- ✅ Script 08: Corporate Network Only (IP Range)
- ✅ Script 09: Deny Access by API Audience
- ✅ Script 10: Block Access by Email Domain
- ✅ Script 37: Block Suspended Accounts
- ✅ Script 38: Weekend Login Lockout
- ✅ Script 39: Block Logins Outside Corporate IP
- ✅ Script 31: Guard Clauses and Error Handling (includes deny)

### MFA Policies (10 scripts)
- ✅ Script 02: Application Metadata Filtering (MFA)
- ✅ Script 15: MFA Outside Corporate Network
- ✅ Script 16: Geo-based MFA
- ✅ Script 17: Skip MFA When Passkey Used
- ✅ Script 18: Step-up MFA for High-Risk Score
- ✅ Script 48: MFA Only Outside Corporate Network
- ✅ Script 49: Skip MFA When Passkey Used
- ✅ Script 50: Geo-based MFA with Duo
- ✅ Script 42: Risk-based MFA Step-up with Specific Factor
- ✅ Script 63: Inline MFA Enrollment Survey

### Token Customization (10 scripts)
- ✅ Script 03: user_metadata vs app_metadata Separation
- ✅ Script 12: Add User Roles to Tokens
- ✅ Script 13: Modify Scopes on Access Token
- ✅ Script 20: Connection-Safe Display Name
- ✅ Script 29: Validate Untrusted URL Parameters
- ✅ Script 40: Inject RBAC Roles into Access Token
- ✅ Script 41: Add Read Scope for Correct Audience
- ✅ Script 46: Add Display Name and Plan to ID Token
- ✅ Script 47: Add Enterprise Flag by Email Domain
- ✅ Script 69: Grant Admin Access by Group

### User Profile Management (7 scripts)
- ✅ Script 01: HTTP Request with AbortController Timeout
- ✅ Script 04: Enrich User Profile with setUserMetadata
- ✅ Script 21: Set Default User Picture
- ✅ Script 27: Secrets Manager
- ✅ Script 53: Set Defaults on First Login
- ✅ Script 54: Store External System User ID
- ✅ Script 70: Paginate All User Groups

### Redirect Flows (8 scripts)
- ✅ Script 24: Redirect to Collect Favorite Color
- ✅ Script 25: Terms of Service with Silent Auth Detection
- ✅ Script 26: Preserve Transaction Metadata Across Redirect
- ✅ Script 28: No PII in URLs
- ✅ Script 45: Record Custom Auth Method
- ✅ Script 51: Terms of Service Acceptance Gate
- ✅ Script 52: Progressive Profiling - Collect Phone
- ✅ Script 06: Use event.request.hostname

### Authentication Controls (3 scripts)
- ✅ Script 43: Force WebAuthn Passkey Enrollment
- ✅ Script 44: Account Linking - Set Primary User
- ✅ Script 45: Record Custom Auth Method

### Transaction Metadata (10 scripts)
- ✅ Script 32: Set and Access Immediately
- ✅ Script 33: Supported Value Types
- ✅ Script 34: Share Values Between Sequential Actions
- ✅ Script 35: Update and Remove Metadata
- ✅ Script 36: Share Metadata with Rendered Forms
- ✅ Script 57: Pass Risk Score Between Actions
- ✅ Script 58: Preserve Correlation ID
- ✅ Script 18: Step-up MFA (uses transaction metadata)
- ✅ Script 26: Preserve Metadata Across Redirect
- ✅ Script 42: Risk-based Challenge (uses transaction metadata)

### Caching (2 scripts)
- ✅ Script 55: Cache Feature Flags
- ✅ Script 56: Cache Rate-limit Allowlist

### Session Management (2 scripts - Enterprise)
- ✅ Script 59: Revoke Session on IP Change
- ✅ Script 60: Short Session Lifetime

### Refresh Token Management (2 scripts - Enterprise)
- ✅ Script 61: Revoke Refresh Token on Suspicious Exchange
- ✅ Script 62: Shorten Refresh Token for Free Tier

### SAML (2 scripts)
- ✅ Script 64: Map Roles to SAML Groups
- ✅ Script 65: Use UPN as SAML NameID

### Migration (1 script)
- ✅ Script 68: Skip Action if Legacy Rule Ran

### Security Best Practices (3 scripts)
- ✅ Script 30: Safe Logging
- ✅ Script 31: Guard Clauses and Error Handling
- ✅ Script 27: Secrets Manager

---

## Trigger 2: Pre-User Registration

**When it runs:** Before a new user account is created in Auth0.

**Total scripts:** 5

### Access Control (2 scripts)
- ✅ Script 11: Block Suspicious TLS Fingerprints (JA3/JA4)
- ✅ Script 22: Deny Registration by Geographic Location

### User Profile Setup (2 scripts)
- ✅ Script 19: Store External User ID Before Registration
- ✅ Script 23: Set Metadata on User Profile Before Creation

### Validation (2 scripts)
- ✅ Script 66: Block Personal Email Domains
- ✅ Script 67: Block Bot Registrations (JA4)

**Key capabilities:**
- ✅ Validate email domains
- ✅ Detect bot registrations
- ✅ Set initial metadata
- ✅ Block sign-ups by location
- ✅ Integrate with external user systems

---

## Trigger 3: Post-User Registration

**When it runs:** After a new user account is successfully created.

**Total scripts:** 0 (no scripts in this collection use this trigger)

**Common use cases (not in this collection):**
- Send welcome emails
- Create records in external systems
- Provision user in downstream services
- Log registration events
- Trigger onboarding workflows

**Note:** This trigger has limited API access (cache and read-only user).

---

## Trigger 4: Post-Change Password

**When it runs:** After a user successfully changes their password.

**Total scripts:** 0 (no scripts in this collection use this trigger)

**Common use cases (not in this collection):**
- Send password change notifications
- Log security events
- Revoke existing sessions
- Trigger security alerts
- Update external systems

**Note:** This trigger has limited API access (cache and read-only user).

---

## Trigger 5: Send Phone Message

**When it runs:** When Auth0 needs to send an SMS or voice message for MFA or passwordless.

**Total scripts:** 0 (no scripts in this collection use this trigger)

**Common use cases (not in this collection):**
- Use custom SMS provider (Twilio, AWS SNS)
- Add custom message formatting
- Implement rate limiting
- Log SMS events
- Route by country code

---

## Trigger 6: Custom Token Exchange

**When it runs:** During OAuth 2.0 Token Exchange flow (RFC 8693).

**Total scripts:** 1

### Token Exchange (1 script)
- ✅ Script 14: Custom Token Exchange

**Key capabilities:**
- ✅ Exchange tokens for different audiences
- ✅ Add custom claims during exchange
- ✅ Validate subject tokens
- ✅ Implement custom authorization logic

---

## Script Distribution by Trigger

| Trigger | Script Count | Percentage |
|---------|--------------|------------|
| Post-Login | 59 | 84.3% |
| Pre-User Registration | 5 | 7.1% |
| Post-User Registration | 0 | 0% |
| Post-Change Password | 0 | 0% |
| Send Phone Message | 0 | 0% |
| Custom Token Exchange | 1 | 1.4% |
| Multiple Triggers | 5 | 7.1% |
| **Total** | **70** | **100%** |

---

## API Module Availability by Trigger

| API Module | Post-Login | Pre-Reg | Post-Reg | Post-Pwd | Send-SMS | Token-Ex |
|------------|------------|---------|----------|----------|----------|----------|
| access | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| accessToken | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| idToken | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| multifactor | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| authentication | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| redirect | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| user | ✅ | ✅ | ✅* | ✅* | ❌ | ❌ |
| cache | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| transaction | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| session | ✅** | ❌ | ❌ | ❌ | ❌ | ❌ |
| refreshToken | ✅** | ❌ | ❌ | ❌ | ❌ | ❌ |
| prompt | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| samlResponse | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| validation | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| rules | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| groups | ✅** | ❌ | ❌ | ❌ | ❌ | ❌ |

\* Read-only  
\*\* Enterprise feature

---

## Quick Reference: When to Use Each Trigger

### Use Post-Login when you need to:
- ✅ Add custom claims to tokens
- ✅ Control MFA requirements
- ✅ Deny access based on conditions
- ✅ Redirect to external pages
- ✅ Enrich user profiles
- ✅ Modify token scopes
- ✅ Implement step-up authentication

### Use Pre-User Registration when you need to:
- ✅ Validate email domains
- ✅ Block bot sign-ups
- ✅ Set initial user metadata
- ✅ Integrate with external user systems
- ✅ Enforce corporate email requirements

### Use Post-User Registration when you need to:
- ✅ Send welcome emails
- ✅ Provision users in external systems
- ✅ Log registration events
- ✅ Trigger onboarding workflows

### Use Post-Change Password when you need to:
- ✅ Send security notifications
- ✅ Log password changes
- ✅ Revoke sessions
- ✅ Update external systems

### Use Send Phone Message when you need to:
- ✅ Use custom SMS providers
- ✅ Customize message content
- ✅ Implement rate limiting
- ✅ Route by country

### Use Custom Token Exchange when you need to:
- ✅ Exchange tokens for different audiences
- ✅ Implement custom token logic
- ✅ Add claims during exchange

---

## Related Documentation

- [TRIGGERS.md](./TRIGGERS.md) - Detailed trigger documentation
- [API_MODULES.md](./API_MODULES.md) - API module reference
- [SCRIPT_INDEX.md](./SCRIPT_INDEX.md) - Complete script index
- [Auth0 Actions Triggers](https://auth0.com/docs/customize/actions/triggers)

---

**Last Updated:** 2026-07-24  
**Total Scripts Mapped:** 70
