# Auth0 Event and API Objects Guide

## Overview

In Auth0 Actions, you have access to two primary objects that provide context and capabilities:

### 1. **`event` Object**
The `event` object contains **read-only** information about the authentication transaction currently taking place.

#### Common Properties:

```javascript
// User information
event.user.user_id          // User's unique identifier
event.user.email            // User's email address
event.user.email_verified   // Boolean - email verification status
event.user.username         // Username (if applicable)
event.user.name             // User's full name
event.user.nickname         // User's nickname
event.user.picture          // Profile picture URL
event.user.created_at       // Account creation timestamp
event.user.updated_at       // Last update timestamp
event.user.user_metadata    // Custom user metadata (user-editable)
event.user.app_metadata     // Custom app metadata (admin-only)

// Authentication context
event.client.client_id      // Application client ID
event.client.name           // Application name
event.client.metadata       // Application metadata

// Connection information
event.connection.id         // Connection ID
event.connection.name       // Connection name (e.g., "Username-Password-Authentication")
event.connection.strategy   // Auth strategy (e.g., "auth0", "google-oauth2")

// Request details
event.request.ip            // Client IP address
event.request.user_agent    // User agent string
event.request.hostname      // Hostname
event.request.query         // Query parameters
event.request.body          // Request body
event.request.geoip         // Geographic information
event.request.method        // HTTP method

// Transaction info
event.transaction.id        // Unique transaction ID
event.transaction.protocol  // Protocol used (e.g., "oidc-basic-profile")

// Authentication details
event.authentication.methods // Array of authentication methods used
```

---

### 2. **`api` Object**
The `api` object provides **methods to modify** the authentication flow and tokens.

#### Common Methods:

```javascript
// Access Token customization
api.accessToken.setCustomClaim(name, value)
// Add custom claims to access token
// Example: api.accessToken.setCustomClaim('https://myapp.com/roles', ['admin', 'user'])

// ID Token customization
api.idToken.setCustomClaim(name, value)
// Add custom claims to ID token
// Example: api.idToken.setCustomClaim('https://myapp.com/plan', 'premium')

// User metadata
api.user.setUserMetadata(key, value)
// Update user_metadata
// Example: api.user.setUserMetadata('preferences', { theme: 'dark' })

api.user.setAppMetadata(key, value)
// Update app_metadata
// Example: api.user.setAppMetadata('roles', ['admin'])

// Authentication flow control
api.access.deny(reason)
// Deny authentication
// Example: api.access.deny('Access restricted to corporate network only')

api.redirect.sendUserTo(url, query)
// Redirect user to external URL
// Example: api.redirect.sendUserTo('https://example.com/terms', { userId: event.user.user_id })

// Multi-factor authentication
api.multifactor.enable(provider, options)
// Trigger MFA challenge
// Example: api.multifactor.enable('any', { allowRememberBrowser: false })

// Validation
api.validation.error(code, message)
// Return validation error
// Example: api.validation.error('invalid_signup', 'Email domain not allowed')
```

---

## How to Learn These Objects

### 1. **Official Auth0 Documentation**
- **Actions API Reference**: [https://auth0.com/docs/customize/actions/flows-and-triggers](https://auth0.com/docs/customize/actions/flows-and-triggers)
- **Event Object**: [https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/event-object](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/event-object)
- **API Object**: [https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/api-object](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/api-object)

### 2. **Practical Learning Approach**

#### A. **Use Console Logging**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Log the entire event object to inspect it
  console.log('Event object:', JSON.stringify(event, null, 2));
  
  // Log specific properties
  console.log('User email:', event.user.email);
  console.log('Client name:', event.client.name);
  console.log('Connection:', event.connection.name);
};
```

#### B. **Check Real-Time Logs**
- Go to **Auth0 Dashboard → Monitoring → Logs**
- Trigger a login and view the console output
- Inspect what properties are available for your specific flow

#### C. **Use TypeScript Definitions**
```javascript
// Install Auth0 Actions types for IntelliSense
// npm install --save-dev @types/auth0-actions

/**
 * @param {import('@types/auth0-actions').PostLoginEvent} event
 * @param {import('@types/auth0-actions').PostLoginAPI} api
 */
exports.onExecutePostLogin = async (event, api) => {
  // Now you get autocomplete and type hints
};
```

### 3. **Different Flows Have Different Objects**

Each Auth0 Action flow has slightly different `event` and `api` objects:

- **Post-Login**: Most comprehensive, includes authentication details
- **Pre-User Registration**: Limited to user profile data being created
- **Post-User Registration**: Similar to login but for new users
- **Post-Change Password**: Password change specific context
- **Send Phone Message**: SMS/MFA specific
- **Credentials Exchange**: M2M token exchange

### 4. **Hands-On Practice**

Create test actions for common scenarios:

```javascript
// Example: Inspect and log everything
exports.onExecutePostLogin = async (event, api) => {
  // User info
  console.log('=== USER INFO ===');
  console.log('ID:', event.user.user_id);
  console.log('Email:', event.user.email);
  console.log('Metadata:', event.user.user_metadata);
  
  // Client info
  console.log('=== CLIENT INFO ===');
  console.log('App:', event.client.name);
  
  // Request info
  console.log('=== REQUEST INFO ===');
  console.log('IP:', event.request.ip);
  console.log('Location:', event.request.geoip);
  
  // Add custom claims
  api.idToken.setCustomClaim('https://myapp.com/email', event.user.email);
  api.accessToken.setCustomClaim('https://myapp.com/roles', 
    event.user.app_metadata?.roles || []);
};
```

### 5. **Key Learning Resources**

- **Auth0 Community**: [https://community.auth0.com](https://community.auth0.com)
- **Sample Actions**: Auth0 Dashboard → Actions → Library (pre-built templates)
- **GitHub Examples**: Search for "auth0-actions" repositories
- **Your own repo**: `auth0-action-scripts/` has practical examples

---

## Important Notes

⚠️ **Custom Claims Namespacing**: Custom claims must use namespaced identifiers (URLs) to avoid conflicts:
```javascript
// ✅ Correct
api.idToken.setCustomClaim('https://myapp.com/role', 'admin');

// ❌ Wrong - will be ignored
api.idToken.setCustomClaim('role', 'admin');
```

⚠️ **Event is Read-Only**: You cannot modify `event` properties directly. Use `api` methods instead.

⚠️ **Async Operations**: Actions support async/await for external API calls:
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const response = await fetch('https://api.example.com/user');
  const data = await response.json();
  api.idToken.setCustomClaim('https://myapp.com/external', data);
};
```

---

## Common Use Cases

### 1. **Adding Roles to Tokens**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const roles = event.user.app_metadata?.roles || [];
  api.accessToken.setCustomClaim('https://myapp.com/roles', roles);
  api.idToken.setCustomClaim('https://myapp.com/roles', roles);
};
```

### 2. **Restricting Access by IP**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const allowedIPs = ['192.168.1.1', '10.0.0.1'];
  
  if (!allowedIPs.includes(event.request.ip)) {
    api.access.deny('Access restricted to corporate network only');
  }
};
```

### 3. **Enriching User Profile**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Fetch additional data from external API
  const response = await fetch(`https://api.example.com/users/${event.user.email}`);
  const userData = await response.json();
  
  // Store in user metadata
  api.user.setUserMetadata('department', userData.department);
  api.user.setUserMetadata('employeeId', userData.id);
  
  // Add to tokens
  api.idToken.setCustomClaim('https://myapp.com/department', userData.department);
};
```

### 4. **Conditional MFA**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const isAdmin = event.user.app_metadata?.roles?.includes('admin');
  const isHighRiskLocation = event.request.geoip?.country_code !== 'US';
  
  if (isAdmin || isHighRiskLocation) {
    api.multifactor.enable('any', { allowRememberBrowser: false });
  }
};
```

### 5. **Tracking Login Metadata**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const loginCount = (event.user.user_metadata?.login_count || 0) + 1;
  const lastLogin = new Date().toISOString();
  
  api.user.setUserMetadata('login_count', loginCount);
  api.user.setUserMetadata('last_login', lastLogin);
  api.user.setUserMetadata('last_ip', event.request.ip);
};
```

---

## Debugging Tips

### 1. **Inspect the Full Event Object**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  console.log('Full event:', JSON.stringify(event, null, 2));
};
```

### 2. **Check Available Properties**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  console.log('Event keys:', Object.keys(event));
  console.log('User keys:', Object.keys(event.user));
  console.log('Request keys:', Object.keys(event.request));
};
```

### 3. **Validate Data Before Using**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Always check if properties exist
  if (event.user.app_metadata?.roles) {
    console.log('User has roles:', event.user.app_metadata.roles);
  } else {
    console.log('No roles found for user');
  }
};
```

---

## Related Files in This Repository

- **01-actions-basics/**: Basic action examples
- **02-access-control/**: Access control patterns
- **03-api-authorization/**: Token customization examples
- **API_MODULES.md**: Available npm modules in Actions
- **AVAILABLE_SCRIPTS.md**: Complete list of example scripts

---

## Additional Resources

- [Auth0 Actions Triggers](https://auth0.com/docs/customize/actions/triggers)
- [Auth0 Actions Limitations](https://auth0.com/docs/customize/actions/limitations)
- [Auth0 Actions Secrets](https://auth0.com/docs/customize/actions/write-your-first-action#add-a-secret)
- [Auth0 Actions Testing](https://auth0.com/docs/customize/actions/test-actions)
