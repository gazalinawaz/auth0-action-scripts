# Auth0 Actions Script Index

Complete index of all 70 scripts with trigger types, API modules, and file locations.

## Quick Navigation

- [By Section](#by-section)
- [By Trigger](#by-trigger)
- [By API Module](#by-api-module)
- [By Use Case](#by-use-case)

---

## By Section

### Section 01: Actions Basics (Scripts 01-06)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 01 | HTTP Request with AbortController Timeout | Post-Login | user | [01-actions-basics/http-timeout.js](./01-actions-basics/http-timeout.js) |
| 02 | Application Metadata Filtering | Post-Login | multifactor | [01-actions-basics/app-metadata-filter.js](./01-actions-basics/app-metadata-filter.js) |
| 03 | user_metadata vs app_metadata Separation | Post-Login | user, idToken | [01-actions-basics/metadata-separation.js](./01-actions-basics/metadata-separation.js) |
| 04 | Enrich User Profile with setUserMetadata | Post-Login | user | [01-actions-basics/enrich-profile.js](./01-actions-basics/enrich-profile.js) |
| 05 | Deny Access Gracefully | Post-Login | access | [01-actions-basics/deny-access-gracefully.js](./01-actions-basics/deny-access-gracefully.js) |
| 06 | Use event.request.hostname | Post-Login | - | [01-actions-basics/use-hostname.js](./01-actions-basics/use-hostname.js) |

### Section 02: Access Control (Scripts 07-11)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 07 | Allow Access Only on Weekdays | Post-Login | access | [02-access-control/weekday-only.js](./02-access-control/weekday-only.js) |
| 08 | Corporate Network Only (IP Range) | Post-Login | access | [02-access-control/corporate-network-only.js](./02-access-control/corporate-network-only.js) |
| 09 | Deny Access by API Audience | Post-Login | access | [02-access-control/deny-by-audience.js](./02-access-control/deny-by-audience.js) |
| 10 | Block Access by Email Domain | Post-Login | access | [02-access-control/block-email-domain.js](./02-access-control/block-email-domain.js) |
| 11 | Block Suspicious TLS Fingerprints | Pre-Registration | access | [02-access-control/block-suspicious-tls.js](./02-access-control/block-suspicious-tls.js) |

### Section 03: API Authorization (Scripts 12-14)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 12 | Add User Roles to Tokens | Post-Login | idToken, accessToken | [03-api-authorization/add-roles-to-tokens.js](./03-api-authorization/add-roles-to-tokens.js) |
| 13 | Modify Scopes on Access Token | Post-Login | accessToken | [03-api-authorization/modify-scopes.js](./03-api-authorization/modify-scopes.js) |
| 14 | Custom Token Exchange | Token Exchange | accessToken | [03-api-authorization/custom-token-exchange.js](./03-api-authorization/custom-token-exchange.js) |

### Section 04: MFA Policies (Scripts 15-18)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 15 | MFA Outside Corporate Network | Post-Login | multifactor | [04-mfa-policies/mfa-outside-network.js](./04-mfa-policies/mfa-outside-network.js) |
| 16 | Geo-based MFA | Post-Login | multifactor | [04-mfa-policies/geo-based-mfa.js](./04-mfa-policies/geo-based-mfa.js) |
| 17 | Skip MFA When Passkey Used | Post-Login | multifactor | [04-mfa-policies/skip-mfa-passkey.js](./04-mfa-policies/skip-mfa-passkey.js) |
| 18 | Step-up MFA for High-Risk Score | Post-Login | transaction, multifactor | [04-mfa-policies/risk-based-stepup.js](./04-mfa-policies/risk-based-stepup.js) |

### Section 05: User Profile Enrichment (Scripts 19-21)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 19 | Store External User ID | Pre-Registration | user | [05-user-profile-enrichment/store-external-id.js](./05-user-profile-enrichment/store-external-id.js) |
| 20 | Connection-Safe Display Name | Post-Login | idToken | [05-user-profile-enrichment/display-name-fallback.js](./05-user-profile-enrichment/display-name-fallback.js) |
| 21 | Set Default User Picture | Post-Login | user | [05-user-profile-enrichment/default-picture.js](./05-user-profile-enrichment/default-picture.js) |

### Section 06: Pre-Registration (Scripts 22-23)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 22 | Deny Registration by Geographic Location | Pre-Registration | access | [06-pre-registration/deny-by-geo.js](./06-pre-registration/deny-by-geo.js) |
| 23 | Set Metadata on User Profile | Pre-Registration | user | [06-pre-registration/set-metadata.js](./06-pre-registration/set-metadata.js) |

### Section 07: Redirect Actions (Scripts 24-26)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 24 | Redirect to Collect Favorite Color | Post-Login | redirect | [07-redirect-actions/collect-favorite-color.js](./07-redirect-actions/collect-favorite-color.js) |
| 25 | Terms of Service with Silent Auth Detection | Post-Login | redirect, access | [07-redirect-actions/terms-of-service.js](./07-redirect-actions/terms-of-service.js) |
| 26 | Preserve Transaction Metadata Across Redirect | Post-Login | transaction, redirect | [07-redirect-actions/preserve-tx-metadata.js](./07-redirect-actions/preserve-tx-metadata.js) |

### Section 08: Security & Defensive Coding (Scripts 27-31)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 27 | Secrets Manager | Post-Login | user | [08-security-defensive-coding/secrets-manager.js](./08-security-defensive-coding/secrets-manager.js) |
| 28 | No PII in URLs | Post-Login | redirect | [08-security-defensive-coding/no-pii-in-urls.js](./08-security-defensive-coding/no-pii-in-urls.js) |
| 29 | Validate Untrusted URL Parameters | Post-Login | idToken | [08-security-defensive-coding/validate-untrusted-input.js](./08-security-defensive-coding/validate-untrusted-input.js) |
| 30 | Safe Logging | Post-Login | - | [08-security-defensive-coding/safe-logging.js](./08-security-defensive-coding/safe-logging.js) |
| 31 | Guard Clauses and Error Handling | Post-Login | access, idToken | [08-security-defensive-coding/guard-clauses.js](./08-security-defensive-coding/guard-clauses.js) |

### Section 09: Transaction Metadata (Scripts 32-36)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 32 | Set and Access Immediately | Post-Login | transaction | [09-transaction-metadata/set-and-access.js](./09-transaction-metadata/set-and-access.js) |
| 33 | Supported Value Types | Post-Login | transaction | [09-transaction-metadata/value-types.js](./09-transaction-metadata/value-types.js) |
| 34 | Share Values Between Actions | Post-Login | transaction | [09-transaction-metadata/share-between-actions.js](./09-transaction-metadata/share-between-actions.js) |
| 35 | Update and Remove Metadata | Post-Login | transaction | [09-transaction-metadata/update-remove.js](./09-transaction-metadata/update-remove.js) |
| 36 | Share Metadata with Rendered Forms | Post-Login | transaction, prompt | [09-transaction-metadata/share-with-forms.js](./09-transaction-metadata/share-with-forms.js) |

### Section 10: api.access Use Cases (Scripts 37-39)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 37 | Block Suspended Accounts | Post-Login | access | [10-api-access/block-suspended.js](./10-api-access/block-suspended.js) |
| 38 | Weekend Login Lockout | Post-Login | access | [10-api-access/weekend-lockout.js](./10-api-access/weekend-lockout.js) |
| 39 | Block Logins Outside Corporate IP | Post-Login | access | [10-api-access/corporate-ip-only.js](./10-api-access/corporate-ip-only.js) |

### Section 11: api.accessToken Use Cases (Scripts 40-41)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 40 | Inject RBAC Roles into Access Token | Post-Login | accessToken | [11-api-token-management/inject-rbac-roles.js](./11-api-token-management/inject-rbac-roles.js) |
| 41 | Add Read Scope for Correct Audience | Post-Login | accessToken | [11-api-token-management/add-scope-by-audience.js](./11-api-token-management/add-scope-by-audience.js) |

### Section 12: api.authentication Use Cases (Scripts 42-45)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 42 | Risk-based MFA Step-up with Specific Factor | Post-Login | authentication, transaction | [11-api-token-management/risk-based-challenge.js](./11-api-token-management/risk-based-challenge.js) |
| 43 | Force WebAuthn Passkey Enrollment | Post-Login | authentication | [11-api-token-management/force-passkey-enrollment.js](./11-api-token-management/force-passkey-enrollment.js) |
| 44 | Account Linking - Set Primary User | Post-Login | authentication | [11-api-token-management/account-linking.js](./11-api-token-management/account-linking.js) |
| 45 | Record Custom Auth Method | Post-Login | authentication, redirect | [11-api-token-management/record-custom-method.js](./11-api-token-management/record-custom-method.js) |

### Section 13: api.idToken Use Cases (Scripts 46-47)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 46 | Add Display Name and Plan to ID Token | Post-Login | idToken | [11-api-token-management/add-display-name-plan.js](./11-api-token-management/add-display-name-plan.js) |
| 47 | Add Enterprise Flag by Email Domain | Post-Login | idToken | [11-api-token-management/enterprise-flag.js](./11-api-token-management/enterprise-flag.js) |

### Section 14: api.multifactor Use Cases (Scripts 48-50)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 48 | MFA Only Outside Corporate Network | Post-Login | multifactor | [11-api-token-management/mfa-outside-corp.js](./11-api-token-management/mfa-outside-corp.js) |
| 49 | Skip MFA When Passkey Used | Post-Login | multifactor | [11-api-token-management/skip-mfa-passkey-used.js](./11-api-token-management/skip-mfa-passkey-used.js) |
| 50 | Geo-based MFA with Duo | Post-Login | multifactor | [11-api-token-management/geo-mfa-duo.js](./11-api-token-management/geo-mfa-duo.js) |

### Section 15: api.redirect Use Cases (Scripts 51-52)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 51 | Terms of Service Acceptance Gate | Post-Login | redirect, access | [11-api-token-management/tos-gate.js](./11-api-token-management/tos-gate.js) |
| 52 | Progressive Profiling - Collect Phone | Post-Login | redirect | [11-api-token-management/progressive-profiling.js](./11-api-token-management/progressive-profiling.js) |

### Section 16: api.user Use Cases (Scripts 53-54)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 53 | Set Defaults on First Login | Post-Login | user | [11-api-token-management/set-defaults-first-login.js](./11-api-token-management/set-defaults-first-login.js) |
| 54 | Store External System User ID | Post-Login | user | [11-api-token-management/store-legacy-id.js](./11-api-token-management/store-legacy-id.js) |

### Section 17: Advanced API Modules (Scripts 55-70)

| # | Script | Trigger | APIs | File |
|---|--------|---------|------|------|
| 55 | Cache Feature Flags | Post-Login | cache | [13-api-advanced/cache-feature-flags.js](./13-api-advanced/cache-feature-flags.js) |
| 56 | Cache Rate-limit Allowlist | Post-Login | cache | [13-api-advanced/cache-ip-allowlist.js](./13-api-advanced/cache-ip-allowlist.js) |
| 57 | Pass Risk Score Between Actions | Post-Login | transaction | [13-api-advanced/pass-risk-score.js](./13-api-advanced/pass-risk-score.js) |
| 58 | Preserve Correlation ID | Post-Login | transaction | [13-api-advanced/correlation-id.js](./13-api-advanced/correlation-id.js) |
| 59 | Revoke Session on IP Change | Post-Login | session | [13-api-advanced/revoke-session-ip-change.js](./13-api-advanced/revoke-session-ip-change.js) |
| 60 | Short Session Lifetime | Post-Login | session | [13-api-advanced/short-session-lifetime.js](./13-api-advanced/short-session-lifetime.js) |
| 61 | Revoke Refresh Token on Suspicious Exchange | Post-Login | refreshToken | [13-api-advanced/revoke-rt-suspicious.js](./13-api-advanced/revoke-rt-suspicious.js) |
| 62 | Shorten Refresh Token for Free Tier | Post-Login | refreshToken | [13-api-advanced/shorten-rt-free-tier.js](./13-api-advanced/shorten-rt-free-tier.js) |
| 63 | Inline MFA Enrollment Survey | Post-Login | prompt | [13-api-advanced/inline-mfa-survey.js](./13-api-advanced/inline-mfa-survey.js) |
| 64 | Map Roles to SAML Groups | Post-Login | samlResponse | [13-api-advanced/saml-map-roles.js](./13-api-advanced/saml-map-roles.js) |
| 65 | Use UPN as SAML NameID | Post-Login | samlResponse | [13-api-advanced/saml-upn-nameid.js](./13-api-advanced/saml-upn-nameid.js) |
| 66 | Block Personal Email Domains | Pre-Registration | validation | [13-api-advanced/block-personal-emails.js](./13-api-advanced/block-personal-emails.js) |
| 67 | Block Bot Registrations (JA4) | Pre-Registration | validation | [13-api-advanced/block-bot-ja4.js](./13-api-advanced/block-bot-ja4.js) |
| 68 | Skip Action if Legacy Rule Ran | Post-Login | rules | [13-api-advanced/skip-if-rule-ran.js](./13-api-advanced/skip-if-rule-ran.js) |
| 69 | Grant Admin Access by Group | Post-Login | groups | [13-api-advanced/admin-by-group.js](./13-api-advanced/admin-by-group.js) |
| 70 | Paginate All User Groups | Post-Login | groups | [13-api-advanced/paginate-groups.js](./13-api-advanced/paginate-groups.js) |

---

## By Trigger

### Post-Login (59 scripts)
01-10, 12-13, 15-18, 20-21, 24-31, 32-54, 57-65, 68-70

### Pre-User Registration (5 scripts)
11, 19, 22-23, 66-67

### Custom Token Exchange (1 script)
14

---

## By API Module

| Module | Script Count | Script Numbers |
|--------|--------------|----------------|
| access | 13 | 05, 07-11, 22, 25, 31, 37-39, 51 |
| accessToken | 6 | 12-14, 40-41 |
| idToken | 9 | 03, 12, 20, 29, 31, 46-47 |
| multifactor | 10 | 02, 15-18, 48-50 |
| authentication | 5 | 42-45 |
| redirect | 8 | 24-26, 28, 45, 51-52 |
| user | 12 | 01, 03-04, 19, 21, 23, 27, 53-54 |
| cache | 4 | 55-56 |
| transaction | 10 | 18, 26, 32-36, 42, 57-58 |
| session | 2 | 59-60 |
| refreshToken | 2 | 61-62 |
| prompt | 2 | 36, 63 |
| samlResponse | 2 | 64-65 |
| validation | 3 | 19, 66-67 |
| rules | 1 | 68 |
| groups | 2 | 69-70 |

---

## By Use Case

### Access Control & Security
07-11, 22, 27-31, 37-39

### MFA & Authentication
02, 15-18, 42-43, 48-50, 63

### Token Customization
03, 12-14, 20, 29, 40-41, 46-47

### User Profile Management
01, 04, 19, 21, 23, 53-54

### Redirect Flows
24-26, 28, 45, 51-52

### Advanced Features
32-36, 55-62, 64-65, 68-70

---

**Total Scripts:** 70  
**Last Updated:** 2026-07-24
