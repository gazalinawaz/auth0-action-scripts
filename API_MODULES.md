# Auth0 Actions API Modules Reference

Complete reference for all API modules available in Auth0 Actions.

## 📋 Table of Contents

- [Overview](#overview)
- [API Modules](#api-modules)
  - [api.access](#apiaccess)
  - [api.accessToken](#apiaccesstoken)
  - [api.idToken](#apiidtoken)
  - [api.multifactor](#apimultifactor)
  - [api.authentication](#apiauthentication)
  - [api.redirect](#apiredirect)
  - [api.user](#apiuser)
  - [api.cache](#apicache)
  - [api.transaction](#apitransaction)
  - [api.session](#apisession)
  - [api.refreshToken](#apirefreshtoken)
  - [api.prompt](#apiprompt)
  - [api.samlResponse](#apisamlresponse)
  - [api.validation](#apivalidation)
  - [api.rules](#apirules)
  - [api.groups](#apigroups)

---

## Overview

Auth0 Actions provide API modules to control authentication behavior. Availability depends on the trigger type.

| Module | Post-Login | Pre-Registration | Post-Registration | Token Exchange |
|--------|------------|------------------|-------------------|----------------|
| access | ✅ | ✅ | ❌ | ✅ |
| accessToken | ✅ | ❌ | ❌ | ✅ |
| idToken | ✅ | ❌ | ❌ | ✅ |
| multifactor | ✅ | ❌ | ❌ | ❌ |
| authentication | ✅ | ❌ | ❌ | ❌ |
| redirect | ✅ | ❌ | ❌ | ❌ |
| user | ✅ | ✅ | ✅ (read-only) | ❌ |
| cache | ✅ | ❌ | ✅ | ❌ |
| transaction | ✅ | ❌ | ❌ | ❌ |
| session | ✅ (Enterprise) | ❌ | ❌ | ❌ |
| refreshToken | ✅ (Enterprise) | ❌ | ❌ | ❌ |
| prompt | ✅ | ❌ | ❌ | ❌ |
| samlResponse | ✅ | ❌ | ❌ | ❌ |
| validation | ❌ | ✅ | ❌ | ❌ |
| rules | ✅ | ❌ | ❌ | ❌ |
| groups | ✅ (Enterprise) | ❌ | ❌ | ❌ |

---

## API Modules

### api.access

**Purpose:** Allow or deny login attempts.

**Triggers:** Post-Login, Pre-User Registration, Custom Token Exchange

#### Methods

##### `api.access.deny(reason, userMessage?)`

Deny the authentication request.

**Parameters:**
- `reason` (string) - Error code for logs
- `userMessage` (string, optional) - User-facing message

**Example:**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  if (event.user.app_metadata?.suspended) {
    api.access.deny(
      'account_suspended',
      'Your account has been suspended. Contact support@example.com.'
    );
  }
};
```

**Best Practices:**
- ✅ Use descriptive error codes
- ✅ Provide user-friendly messages
- ✅ Never throw errors (use deny instead)
- ❌ Don't expose internal system details

**Related Scripts:** 07, 08, 09, 10, 11, 37, 38, 39

---

### api.accessToken

**Purpose:** Modify access tokens (for API authorization).

**Triggers:** Post-Login, Custom Token Exchange

#### Methods

##### `api.accessToken.setCustomClaim(name, value)`

Add a custom claim to the access token.

**Parameters:**
- `name` (string) - Namespaced claim name (must use HTTPS URL)
- `value` (any) - Claim value

**Example:**
```javascript
const ns = 'https://my-app.example.com';
api.accessToken.setCustomClaim(`${ns}/roles`, event.authorization.roles);
api.accessToken.setCustomClaim(`${ns}/plan`, 'premium');
```

##### `api.accessToken.addScope(scope)`

Add a scope to the access token.

**Example:**
```javascript
if (event.resource_server?.identifier === 'https://api.example.com') {
  api.accessToken.addScope('read:reports');
  api.accessToken.addScope('write:data');
}
```

##### `api.accessToken.removeScope(scope)`

Remove a scope from the access token.

**Example:**
```javascript
if (event.user.app_metadata?.plan !== 'premium') {
  api.accessToken.removeScope('read:reports');
}
```

**Best Practices:**
- ✅ Always use namespaced claims (https://your-domain.com/claim)
- ✅ Verify audience before adding scopes
- ✅ Keep claim values small (tokens have size limits)
- ❌ Don't add PII to access tokens

**Related Scripts:** 12, 13, 14, 40, 41

---

### api.idToken

**Purpose:** Modify ID tokens (for user profile information).

**Triggers:** Post-Login, Custom Token Exchange

#### Methods

##### `api.idToken.setCustomClaim(name, value)`

Add a custom claim to the ID token.

**Parameters:**
- `name` (string) - Namespaced claim name
- `value` (any) - Claim value

**Example:**
```javascript
const ns = 'https://my-app.example.com';
api.idToken.setCustomClaim(`${ns}/display_name`, event.user.name);
api.idToken.setCustomClaim(`${ns}/plan`, event.user.app_metadata?.plan);
api.idToken.setCustomClaim(`${ns}/is_admin`, false);
```

**Best Practices:**
- ✅ Use for user profile data
- ✅ Keep claims small (ID tokens are sent to browser)
- ✅ Use namespaced claims
- ❌ Don't duplicate standard OIDC claims

**Related Scripts:** 03, 12, 20, 46, 47

---

### api.multifactor

**Purpose:** Control multi-factor authentication requirements.

**Triggers:** Post-Login

#### Methods

##### `api.multifactor.enable(provider, options?)`

Require MFA for this login.

**Parameters:**
- `provider` (string) - `'any'`, `'duo'`, `'google-authenticator'`, `'guardian'`, etc.
- `options` (object, optional)
  - `allowRememberBrowser` (boolean) - Allow "Remember this device"

**Example:**
```javascript
// Require any enrolled MFA factor
api.multifactor.enable('any');

// Require specific factor, no remember browser
api.multifactor.enable('duo', { allowRememberBrowser: false });

// Skip MFA
api.multifactor.enable('none');
```

**Best Practices:**
- ✅ Use `'any'` for flexibility
- ✅ Disable remember browser for high-security apps
- ✅ Check if MFA already completed: `event.authentication?.methods`
- ❌ Don't enable MFA for silent auth flows

**Related Scripts:** 02, 15, 16, 17, 18, 48, 49, 50

---

### api.authentication

**Purpose:** Advanced authentication controls (challenge, enrollment, account linking).

**Triggers:** Post-Login

#### Methods

##### `api.authentication.challengeWith(factor, options?)`

Challenge the user with a specific MFA factor.

**Parameters:**
- `factor` (object) - `{ type: 'otp' | 'push-notification' | 'webauthn-roaming' | 'webauthn-platform' }`
- `options` (object, optional)
  - `additionalFactors` (array) - Fallback factors

**Example:**
```javascript
// Challenge with push, offer OTP as fallback
api.authentication.challengeWith(
  { type: 'push-notification', options: { otpFallback: true } },
  { additionalFactors: [{ type: 'otp' }] }
);
```

##### `api.authentication.enrollWith(factor, options?)`

Prompt user to enroll a new MFA factor.

**Example:**
```javascript
// Enroll passkey or push notification
api.authentication.enrollWith(
  { type: 'webauthn-platform' },
  { additionalFactors: [{ type: 'push-notification' }] }
);
```

##### `api.authentication.setPrimaryUser(userId)`

Set the primary user for account linking.

**Example:**
```javascript
// Link social identity to existing DB user
api.authentication.setPrimaryUser('auth0|123456');
```

##### `api.authentication.recordMethod(name)`

Record a custom authentication method.

**Example:**
```javascript
api.authentication.recordMethod('https://hwkey.example.com/verify');
```

**Best Practices:**
- ✅ Offer fallback factors
- ✅ Check existing enrollments before forcing enrollment
- ✅ Use for step-up authentication
- ❌ Don't challenge during silent auth

**Related Scripts:** 42, 43, 44, 45

---

### api.redirect

**Purpose:** Redirect users to external pages during login.

**Triggers:** Post-Login

#### Methods

##### `api.redirect.sendUserTo(url, options?)`

Redirect user to an external URL.

**Parameters:**
- `url` (string) - Destination URL
- `options` (object, optional)
  - `query` (object) - Query parameters

**Example:**
```javascript
const token = api.redirect.encodeToken({
  secret: event.secrets.REDIRECT_SECRET,
  expiresInSeconds: 300,
  payload: { userId: event.user.user_id }
});

api.redirect.sendUserTo('https://verify.example.com', {
  query: { session_token: token }
});
```

##### `api.redirect.encodeToken(options)`

Create a signed session token.

**Parameters:**
- `secret` (string) - Signing secret
- `expiresInSeconds` (number) - Token lifetime
- `payload` (object) - Data to encode

**Returns:** Signed JWT string

##### `api.redirect.validateToken(options)`

Validate and decode a session token (in `onContinuePostLogin`).

**Parameters:**
- `secret` (string) - Signing secret

**Returns:** Decoded payload

**Example:**
```javascript
exports.onContinuePostLogin = async (event, api) => {
  const payload = api.redirect.validateToken({
    secret: event.secrets.REDIRECT_SECRET
  });
  
  if (payload.userId !== event.user.user_id) {
    api.access.deny('Invalid session token');
  }
};
```

**Best Practices:**
- ✅ Use signed tokens (never PII in URLs)
- ✅ Set short expiration (5-10 minutes)
- ✅ Check `event.transaction?.prompt` for interactive sessions
- ✅ Use `event.request.hostname` for continue URL
- ❌ Don't redirect during silent auth

**Related Scripts:** 24, 25, 26, 28, 51, 52

---

### api.user

**Purpose:** Update user profile metadata.

**Triggers:** Post-Login (read/write), Pre-User Registration (write), Post-User Registration (read-only)

#### Methods

##### `api.user.setUserMetadata(key, value)`

Set user-editable metadata (preferences).

**Example:**
```javascript
api.user.setUserMetadata('theme', 'dark');
api.user.setUserMetadata('notifications_enabled', true);
```

##### `api.user.setAppMetadata(key, value)`

Set system-managed metadata (not user-editable).

**Example:**
```javascript
api.user.setAppMetadata('subscription_tier', 'premium');
api.user.setAppMetadata('signup_date', new Date().toISOString());
```

**Best Practices:**
- ✅ **user_metadata** - User preferences (theme, language)
- ✅ **app_metadata** - System data (roles, subscription, internal IDs)
- ✅ Keep metadata small (< 16 KB total)
- ❌ Don't store sensitive data in metadata

**Related Scripts:** 03, 04, 19, 21, 23, 53, 54

---

### api.cache

**Purpose:** Store temporary data across Action executions.

**Triggers:** Post-Login, Post-User Registration, Post-Change Password, Send Phone Message

#### Methods

##### `api.cache.set(key, value, options?)`

Store a value in cache.

**Parameters:**
- `key` (string) - Cache key
- `value` (string) - Value (must be string)
- `options` (object, optional)
  - `ttl` (number) - Time to live in milliseconds

**Example:**
```javascript
// Cache for 10 minutes
api.cache.set('feature_flags', JSON.stringify(flags), { ttl: 600_000 });
```

##### `api.cache.get(key)`

Retrieve a cached value.

**Returns:** `{ type: 'string', value: string }` or `undefined`

**Example:**
```javascript
const cached = api.cache.get('feature_flags');
if (cached) {
  const flags = JSON.parse(cached.value);
}
```

##### `api.cache.delete(key)`

Remove a cached value.

**Example:**
```javascript
api.cache.delete('feature_flags');
```

**Best Practices:**
- ✅ Use for expensive API calls
- ✅ Always JSON.stringify objects
- ✅ Set appropriate TTL
- ✅ Handle cache misses gracefully
- ❌ Don't cache PII

**Related Scripts:** 55, 56

---

### api.transaction

**Purpose:** Share data between sequential Actions in the same flow.

**Triggers:** Post-Login

#### Methods

##### `api.transaction.setMetadata(key, value)`

Store metadata for this transaction.

**Parameters:**
- `key` (string) - Metadata key
- `value` (string | number | boolean | null) - Value

**Example:**
```javascript
// Action 1: Set
api.transaction.setMetadata('risk_score', 85);
api.transaction.setMetadata('scored_at', new Date().toISOString());

// Action 2: Read
const score = event.transaction?.metadata?.risk_score;
```

**Best Practices:**
- ✅ Use for cross-action communication
- ✅ Supports string, number, boolean
- ✅ JSON.stringify objects
- ✅ Set to `null` to remove
- ❌ Not persisted beyond the transaction

**Related Scripts:** 18, 26, 32, 33, 34, 35, 36, 57, 58

---

### api.session

**Purpose:** Manage session lifecycle (Enterprise feature).

**Triggers:** Post-Login

#### Methods

##### `api.session.setExpiresAt(timestamp)`

Set absolute session expiration.

**Example:**
```javascript
// 4-hour absolute session
api.session.setExpiresAt(Date.now() + 4 * 60 * 60 * 1000);
```

##### `api.session.setIdleExpiresAt(timestamp)`

Set idle timeout.

**Example:**
```javascript
// 15-minute idle timeout
api.session.setIdleExpiresAt(Date.now() + 15 * 60 * 1000);
```

##### `api.session.setCookieMode(mode)`

Set session cookie persistence.

**Parameters:**
- `mode` - `'persistent'` or `'non-persistent'`

**Example:**
```javascript
// Ephemeral session (deleted when browser closes)
api.session.setCookieMode('non-persistent');
```

##### `api.session.revoke(reason, options?)`

Revoke the current session.

**Example:**
```javascript
api.session.revoke('IP address changed', {
  preserveRefreshTokens: false
});
```

##### `api.session.setMetadata(key, value)`

Store session metadata.

**Best Practices:**
- ✅ Use for high-security apps
- ✅ Detect session hijacking (IP changes)
- ✅ Short sessions for sensitive data
- ❌ Enterprise feature only

**Related Scripts:** 59, 60

---

### api.refreshToken

**Purpose:** Manage refresh token lifecycle (Enterprise feature).

**Triggers:** Post-Login

#### Methods

##### `api.refreshToken.setExpiresAt(timestamp)`

Set refresh token expiration.

**Example:**
```javascript
// 7-day refresh token for free tier
api.refreshToken.setExpiresAt(Date.now() + 7 * 24 * 3600 * 1000);
```

##### `api.refreshToken.setIdleExpiresAt(timestamp)`

Set refresh token idle timeout.

**Example:**
```javascript
// 1-hour idle timeout
api.refreshToken.setIdleExpiresAt(Date.now() + 60 * 60 * 1000);
```

##### `api.refreshToken.revoke(reason)`

Revoke the refresh token.

**Example:**
```javascript
if (event.refresh_token?.device?.last_asn !== event.refresh_token?.device?.initial_asn) {
  api.refreshToken.revoke('Suspicious network change');
}
```

**Best Practices:**
- ✅ Detect token theft (ASN changes)
- ✅ Shorter lifetime for free tiers
- ✅ Check `event.transaction?.protocol === 'oauth2-refresh-token'`
- ❌ Enterprise feature only

**Related Scripts:** 61, 62

---

### api.prompt

**Purpose:** Render Auth0 Forms inline in the login flow.

**Triggers:** Post-Login

#### Methods

##### `api.prompt.render(formId, options?)`

Render an Auth0 Form.

**Parameters:**
- `formId` (string) - Form ID from Auth0 Dashboard
- `options` (object, optional)
  - `vars` (object) - Variables to pass to form

**Example:**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  api.prompt.render(event.secrets.MFA_PREF_FORM_ID, {
    vars: {
      user_name: event.user.name,
      plan: event.user.app_metadata?.plan
    }
  });
};

exports.onContinuePostLogin = async (event, api) => {
  const preference = event.prompt?.fields?.mfa_preference;
  api.user.setAppMetadata('mfa_preference', preference);
};
```

**Best Practices:**
- ✅ Use for inline data collection
- ✅ No redirect needed
- ✅ Access submitted data in `event.prompt.fields`
- ❌ Forms must be created in Dashboard first

**Related Scripts:** 36, 63

---

### api.samlResponse

**Purpose:** Customize SAML responses for SAML applications.

**Triggers:** Post-Login (SAML protocol only)

#### Methods

##### `api.samlResponse.setAttribute(name, value)`

Add/modify SAML attribute.

**Example:**
```javascript
if (event.transaction?.protocol === 'samlp') {
  api.samlResponse.setAttribute(
    'http://schemas.auth0.com/groups',
    event.authorization.roles
  );
}
```

##### `api.samlResponse.setNameIdentifierFormat(format)`

Set SAML NameID format.

**Example:**
```javascript
api.samlResponse.setNameIdentifierFormat(
  'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
);
```

##### `api.samlResponse.setEncryptionAlgorithm(algorithm)`

Set encryption algorithm.

**Example:**
```javascript
api.samlResponse.setEncryptionAlgorithm('aes256-gcm');
```

##### `api.samlResponse.setLifetimeInSeconds(seconds)`

Set SAML assertion lifetime.

**Example:**
```javascript
api.samlResponse.setLifetimeInSeconds(1800); // 30 minutes
```

**Best Practices:**
- ✅ Check `event.transaction?.protocol === 'samlp'`
- ✅ Use AES-256-GCM encryption
- ✅ Map Auth0 roles to SAML groups
- ❌ Only works for SAML apps

**Related Scripts:** 64, 65

---

### api.validation

**Purpose:** Reject user registration with validation errors.

**Triggers:** Pre-User Registration

#### Methods

##### `api.validation.error(code, message)`

Reject registration with an error.

**Parameters:**
- `code` (string) - Error code
- `message` (string) - User-facing message

**Example:**
```javascript
exports.onExecutePreUserRegistration = async (event, api) => {
  const domain = event.user.email?.split('@')[1];
  
  if (domain === 'gmail.com') {
    api.validation.error(
      'corporate_email_required',
      'Please use your corporate email address.'
    );
  }
};
```

**Best Practices:**
- ✅ Use descriptive error codes
- ✅ Provide actionable messages
- ✅ Localize messages: `event.request.language`
- ❌ Don't expose internal validation logic

**Related Scripts:** 19, 22, 66, 67

---

### api.rules

**Purpose:** Check if legacy Rules have executed (migration helper).

**Triggers:** Post-Login

#### Methods

##### `api.rules.wasExecuted(ruleId)`

Check if a specific Rule ran.

**Returns:** boolean

**Example:**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Skip if legacy Rule already ran
  if (api.rules.wasExecuted('abc123LegacyRuleId')) {
    return;
  }
  
  // New Action logic
  api.multifactor.enable('any');
};
```

**Best Practices:**
- ✅ Use during Rules → Actions migration
- ✅ Remove once migration complete
- ❌ Not needed for new implementations

**Related Scripts:** 68

---

### api.groups

**Purpose:** Check group membership and retrieve user groups (Enterprise feature).

**Triggers:** Post-Login

#### Methods

##### `api.groups.hasGroupMembership(groupNames)`

Check if user is in any of the specified groups.

**Returns:** `{ isMember: boolean, groups: array }`

**Example:**
```javascript
const result = await api.groups.hasGroupMembership([
  'platform-admins',
  'super-admins'
]);

if (result.isMember) {
  api.idToken.setCustomClaim('https://example.com/is_admin', true);
}
```

##### `api.groups.getUserGroups(options?)`

Get all groups for the user (paginated).

**Parameters:**
- `options` (object, optional)
  - `take` (number) - Page size (max 50)
  - `from` (string) - Pagination cursor

**Returns:** `{ groups: array, next: string }`

**Example:**
```javascript
const allGroups = [];
let cursor;

do {
  const params = { take: 50 };
  if (cursor) params.from = cursor;
  
  const page = await api.groups.getUserGroups(params);
  allGroups.push(...(page.groups || []));
  cursor = page.next;
} while (cursor);
```

**Best Practices:**
- ✅ Use for RBAC with groups
- ✅ Paginate for users with many groups
- ✅ Cache group lookups if expensive
- ❌ Enterprise feature only

**Related Scripts:** 69, 70

---

## Quick Reference

### Token Customization
```javascript
// ID Token (user profile)
api.idToken.setCustomClaim('https://app.com/name', event.user.name);

// Access Token (API authorization)
api.accessToken.setCustomClaim('https://app.com/role', 'admin');
api.accessToken.addScope('read:data');
```

### Access Control
```javascript
// Deny login
api.access.deny('reason_code', 'User-facing message');

// Require MFA
api.multifactor.enable('any');
```

### User Metadata
```javascript
// User preferences (user-editable)
api.user.setUserMetadata('theme', 'dark');

// System data (not user-editable)
api.user.setAppMetadata('plan', 'premium');
```

### Redirect Flow
```javascript
// Send user to external page
const token = api.redirect.encodeToken({
  secret: event.secrets.SECRET,
  expiresInSeconds: 300,
  payload: { userId: event.user.user_id }
});
api.redirect.sendUserTo('https://verify.com', {
  query: { session_token: token }
});

// Validate on return
const payload = api.redirect.validateToken({
  secret: event.secrets.SECRET
});
```

---

## Related Documentation

- [Actions API Object](https://auth0.com/docs/customize/actions/actions-api-object)
- [Actions Triggers](https://auth0.com/docs/customize/actions/triggers)
- [Actions Limitations](https://auth0.com/docs/customize/actions/limitations)

---

**Last Updated:** 2026-07-24  
**Source:** auth0.com/docs/customize/actions
