# Auth0 Actions Triggers Reference

Complete guide to Auth0 Actions triggers and when to use them.

## 📋 Table of Contents

- [Overview](#overview)
- [Trigger Types](#trigger-types)
- [Trigger Comparison](#trigger-comparison)
- [Event Object Reference](#event-object-reference)
- [Best Practices](#best-practices)

## Overview

Auth0 Actions are executed at specific points (triggers) in the authentication and user management flows. Each trigger provides different context and capabilities.

## Trigger Types

### 1. Post-Login (`post-login`)

**When it runs:** After a user successfully authenticates but before the transaction completes.

**Use cases:**
- Add custom claims to tokens
- Enforce MFA policies
- Deny access based on conditions
- Redirect to external pages
- Enrich user profiles
- Log analytics events

**Available API modules:**
- ✅ api.access
- ✅ api.accessToken
- ✅ api.idToken
- ✅ api.multifactor
- ✅ api.authentication
- ✅ api.redirect
- ✅ api.user
- ✅ api.cache
- ✅ api.transaction
- ✅ api.session (Enterprise)
- ✅ api.refreshToken (Enterprise)
- ✅ api.samlResponse
- ✅ api.groups (Enterprise)

**Event object includes:**
```javascript
{
  user,              // User profile
  client,            // Application details
  connection,        // Connection used
  request,           // IP, geoip, hostname, query params
  transaction,       // Protocol, prompt, metadata
  authentication,    // Methods used (passkey, mfa, etc.)
  authorization,     // Roles, permissions
  organization,      // Org context (if applicable)
  stats,             // logins_count
  resource_server    // API audience (if applicable)
}
```

**Example:**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  if (event.request.geoip.continentCode !== 'EU') {
    api.multifactor.enable('any');
  }
};
```

**Documentation:** https://auth0.com/docs/customize/actions/triggers/post-login

---

### 2. Pre-User Registration (`pre-user-registration`)

**When it runs:** Before a new user account is created in the Auth0 database.

**Use cases:**
- Block sign-ups from specific domains
- Validate email format
- Set initial metadata
- Detect bot registrations
- Enforce corporate email requirements

**Available API modules:**
- ✅ api.access
- ✅ api.user
- ✅ api.validation

**Event object includes:**
```javascript
{
  user,              // Email, username (not yet created)
  client,            // Application details
  connection,        // Connection used
  request,           // IP, geoip, hostname, language
  security_context   // JA3/JA4 TLS fingerprints
}
```

**Example:**
```javascript
exports.onExecutePreUserRegistration = async (event, api) => {
  const personalDomains = ['gmail.com', 'yahoo.com'];
  const domain = event.user.email?.split('@')[1];
  
  if (personalDomains.includes(domain)) {
    api.validation.error(
      'corporate_email_required',
      'Please use your corporate email.'
    );
  }
};
```

**Documentation:** https://auth0.com/docs/customize/actions/triggers/pre-user-registration

---

### 3. Post-User Registration (`post-user-registration`)

**When it runs:** After a new user account is successfully created.

**Use cases:**
- Send welcome emails
- Create records in external systems
- Provision user in downstream services
- Log registration events
- Trigger onboarding workflows

**Available API modules:**
- ✅ api.cache
- ✅ api.user (read-only)

**Event object includes:**
```javascript
{
  user,              // Newly created user profile
  client,            // Application details
  connection,        // Connection used
  request            // IP, geoip, hostname
}
```

**Example:**
```javascript
exports.onExecutePostUserRegistration = async (event, api) => {
  await fetch('https://crm.example.com/users', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${event.secrets.CRM_API_KEY}` },
    body: JSON.stringify({
      auth0_id: event.user.user_id,
      email: event.user.email,
      created_at: event.user.created_at
    })
  });
};
```

**Documentation:** https://auth0.com/docs/customize/actions/triggers/post-user-registration

---

### 4. Post-Change Password (`post-change-password`)

**When it runs:** After a user successfully changes their password.

**Use cases:**
- Send password change notifications
- Log security events
- Revoke existing sessions
- Trigger security alerts
- Update external systems

**Available API modules:**
- ✅ api.cache
- ✅ api.user (read-only)

**Event object includes:**
```javascript
{
  user,              // User profile
  client,            // Application details
  connection,        // Connection used
  request            // IP, geoip, hostname
}
```

**Example:**
```javascript
exports.onExecutePostChangePassword = async (event, api) => {
  await fetch('https://notifications.example.com/send', {
    method: 'POST',
    body: JSON.stringify({
      to: event.user.email,
      template: 'password-changed',
      data: {
        ip: event.request.ip,
        timestamp: new Date().toISOString()
      }
    })
  });
};
```

**Documentation:** https://auth0.com/docs/customize/actions/triggers/post-change-password

---

### 5. Send Phone Message (`send-phone-message`)

**When it runs:** When Auth0 needs to send an SMS or voice message (MFA, passwordless).

**Use cases:**
- Use custom SMS provider (Twilio, AWS SNS, etc.)
- Add custom message formatting
- Implement rate limiting
- Log SMS events
- Route by country code

**Available API modules:**
- ✅ api.cache

**Event object includes:**
```javascript
{
  user,                    // User profile
  message_type,            // 'sms' or 'voice'
  message_format,          // 'liquid' or 'md_with_macros'
  recipient,               // Phone number
  text,                    // Message content
  client,                  // Application details
  request                  // IP, geoip
}
```

**Example:**
```javascript
exports.onExecuteSendPhoneMessage = async (event, api) => {
  const twilioResponse = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${event.secrets.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${event.secrets.TWILIO_ACCOUNT_SID}:${event.secrets.TWILIO_AUTH_TOKEN}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: event.recipient,
        From: event.secrets.TWILIO_PHONE_NUMBER,
        Body: event.text
      })
    }
  );
};
```

**Documentation:** https://auth0.com/docs/customize/actions/triggers/send-phone-message

---

### 6. Custom Token Exchange (`custom-token-exchange`)

**When it runs:** During OAuth 2.0 Token Exchange flow (RFC 8693).

**Use cases:**
- Exchange tokens for different audiences
- Add custom claims during exchange
- Validate subject tokens
- Implement custom authorization logic

**Available API modules:**
- ✅ api.access
- ✅ api.accessToken
- ✅ api.idToken

**Event object includes:**
```javascript
{
  user,                    // User profile
  request,                 // Token exchange request details
  transaction              // Protocol, metadata
}
```

**Example:**
```javascript
exports.onExecuteCustomTokenExchange = async (event, api) => {
  const subjectToken = event.request.body.subject_token;
  
  if (!subjectToken) {
    api.access.deny('missing_subject_token', 'Subject token required.');
    return;
  }
  
  api.accessToken.setCustomClaim(
    'https://example.com/original_sub',
    event.user.user_id
  );
};
```

**Documentation:** https://auth0.com/docs/customize/actions/triggers/custom-token-exchange

---

## Trigger Comparison

| Feature | Post-Login | Pre-Registration | Post-Registration | Post-Change-Password | Send-Phone-Message | Token Exchange |
|---------|------------|------------------|-------------------|----------------------|-------------------|----------------|
| **Modify tokens** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Deny access** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Modify user** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Redirect** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **MFA control** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **External API** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Caching** | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |

---

## Event Object Reference

### Common Fields (All Triggers)

```javascript
{
  client: {
    client_id: string,
    name: string,
    metadata: object
  },
  request: {
    ip: string,
    hostname: string,
    geoip: {
      countryCode: string,
      continentCode: string,
      cityName: string,
      latitude: number,
      longitude: number
    },
    query: object,
    body: object,
    language: string
  },
  secrets: object,  // Your configured secrets
  connection: {
    id: string,
    name: string,
    strategy: string,  // 'auth0', 'google-oauth2', 'okta', etc.
    metadata: object
  }
}
```

### Post-Login Specific

```javascript
{
  user: {
    user_id: string,
    email: string,
    email_verified: boolean,
    name: string,
    nickname: string,
    picture: string,
    user_metadata: object,
    app_metadata: object,
    created_at: string,
    updated_at: string,
    identities: array,
    enrolledFactors: array  // MFA factors
  },
  authentication: {
    methods: [
      { name: 'pwd', timestamp: number },
      { name: 'mfa', timestamp: number },
      { name: 'passkey', timestamp: number }
    ]
  },
  authorization: {
    roles: string[],
    permissions: string[]
  },
  transaction: {
    protocol: string,  // 'oidc-basic-profile', 'oauth2-refresh-token', etc.
    prompt: string,    // 'login', 'consent', 'none'
    requested_scopes: string[],
    metadata: object,
    correlation_id: string
  },
  stats: {
    logins_count: number
  },
  resource_server: {
    identifier: string  // API audience
  },
  organization: {
    id: string,
    name: string,
    display_name: string,
    metadata: object
  }
}
```

---

## Best Practices

### 1. Choose the Right Trigger

- **Post-Login** - Token customization, access control, MFA
- **Pre-Registration** - Input validation, bot detection
- **Post-Registration** - External provisioning, notifications
- **Post-Change-Password** - Security notifications
- **Send-Phone-Message** - Custom SMS providers
- **Token Exchange** - Cross-audience token flows

### 2. Performance

- Keep Actions under 20 seconds execution time
- Use `api.cache` for expensive operations
- Implement timeouts for external API calls
- Use AbortController for fetch requests

### 3. Error Handling

- Never throw errors in Post-Login (use `api.access.deny()`)
- Use `api.validation.error()` in Pre-Registration
- Log errors for debugging (keep under 256 chars)
- Fail gracefully for non-critical operations

### 4. Security

- Store credentials in Secrets Manager
- Never log PII
- Validate untrusted input (query params, form data)
- Use signed redirect tokens (no PII in URLs)

### 5. Testing

- Test with different connection types
- Test silent auth flows (prompt=none)
- Test refresh token exchanges
- Test with missing/optional fields

---

## Related Documentation

- [Actions API Object](https://auth0.com/docs/customize/actions/actions-api-object)
- [Actions Limitations](https://auth0.com/docs/customize/actions/limitations)
- [Actions Best Practices](https://auth0.com/docs/customize/actions/best-practices)
- [Event Object](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/event-object)

---

**Last Updated:** 2026-07-24  
**Source:** auth0.com/docs/customize/actions/triggers
