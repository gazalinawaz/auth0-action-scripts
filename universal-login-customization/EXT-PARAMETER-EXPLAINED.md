# Auth0 `ext-` Parameter Mechanism Explained

## 📚 What is the `ext-` Parameter?

The `ext-` prefix is Auth0's **official mechanism** for passing custom parameters through the OAuth2 `/authorize` endpoint to your Universal Login page.

### The Problem It Solves

**Standard OAuth2 parameters** are strictly defined:
- `client_id`
- `redirect_uri`
- `response_type`
- `scope`
- `state`
- `nonce`

If you try to pass **custom parameters** (like your Liferay `0=`, `1=`, `length=`), Auth0 will **strip them** because they're not part of the OAuth2 spec.

### The Solution: `ext-` Prefix

Auth0 provides a **documented workaround**: Any parameter prefixed with `ext-` is:
1. ✅ **Preserved** through the authorization flow
2. ✅ **Available** in the Universal Login page via `config.extraParams`
3. ✅ **Not sent to the token endpoint** (stays in the browser)

---

## 🔧 How It Works

### Step 1: Portal Sends `/authorize` Request

```javascript
// Portal (e.g., portal.nyseg.com) redirects user to Auth0
const authUrl = 'https://medical.avangrid.auth0.com/authorize' +
  '?client_id=YOUR_CLIENT_ID' +
  '&redirect_uri=https://portal.nyseg.com/medical/login' +
  '&response_type=code' +
  '&scope=openid profile email' +
  '&state=abc123' +
  '&ext-opco=nyseg' +              // ✅ Custom parameter with ext- prefix
  '&ext-brand=medical' +            // ✅ Another custom parameter
  '&ext-theme=dark';                // ✅ Yet another custom parameter

window.location.href = authUrl;
```

### Step 2: Auth0 Preserves `ext-` Parameters

Auth0 receives the request and:
1. Validates standard OAuth2 parameters (`client_id`, `redirect_uri`, etc.)
2. **Preserves** all `ext-*` parameters
3. Strips any non-standard parameters without `ext-` prefix
4. Renders the Universal Login page

### Step 3: Universal Login Page Reads Parameters

```html
<!-- Universal Login Template -->
<script>
  // Auth0 injects @@config@@ object at render time
  const config = JSON.parse(
    decodeURIComponent(escape(window.atob('@@config@@')))
  );
  
  // Access ext- parameters via config.extraParams
  console.log(config.extraParams);
  // Output:
  // {
  //   opco: "nyseg",
  //   brand: "medical",
  //   theme: "dark"
  // }
  
  // Use the parameters to customize the page
  const opco = config.extraParams.opco; // "nyseg"
  const brand = config.extraParams.brand; // "medical"
  const theme = config.extraParams.theme; // "dark"
  
  // Apply customization
  if (opco === 'nyseg') {
    document.getElementById('logo').src = 'nyseg-logo.png';
  }
  
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  }
</script>
```

---

## 📋 Complete Example: Avangrid Medical Portal

### Portal Code (Angular)

```typescript
// auth.service.ts
export class AuthService {
  login(): void {
    const opco = this.detectOpco(); // "nyseg"
    
    const authUrl = `https://medical.avangrid.auth0.com/authorize` +
      `?client_id=${this.CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(this.getRedirectUri())}` +
      `&response_type=code` +
      `&scope=openid profile email` +
      `&state=${this.generateState()}` +
      `&ext-opco=${opco}`; // ✅ Pass opco via ext- parameter
    
    window.location.href = authUrl;
  }
}
```

### Universal Login Template

```html
<!DOCTYPE html>
<html>
<head>
  <title>Medical Certification Portal</title>
</head>
<body>
  <div id="login-container">
    <img id="portal-logo" src="" alt="Logo">
    <h1>Medical Certification Portal</h1>
    <form id="login-form">
      <!-- Login form fields -->
    </form>
    <div id="nav-links">
      <a id="signup-link" href="#">Sign Up</a>
      <a id="forgot-password-link" href="#">Forgot Password</a>
      <a id="forgot-userid-link" href="#">Forgot UserID</a>
    </div>
  </div>
  
  <script>
    // Portal configuration
    const PORTAL_CONFIG = {
      'cng': {
        logo: 'https://cdn.avangrid.com/logos/group-a.png',
        signUp: 'https://portal.cngcorp.com/medical/sign-up',
        forgotPassword: 'https://portal.cngcorp.com/medical/forgot-password',
        forgotUserId: 'https://portal.cngcorp.com/medical/forgot-userid'
      },
      'nyseg': {
        logo: 'https://cdn.avangrid.com/logos/group-b.png',
        signUp: 'https://portal.nyseg.com/medical/sign-up',
        forgotPassword: 'https://portal.nyseg.com/medical/forgot-password',
        forgotUserId: 'https://portal.nyseg.com/medical/forgot-userid'
      }
      // ... other opcos
    };
    
    // Parse Auth0 config object
    const config = JSON.parse(
      decodeURIComponent(escape(window.atob('@@config@@')))
    );
    
    // Get opco from ext-opco parameter
    const opco = config.extraParams?.opco || 'cng'; // ✅ Read ext-opco
    
    // Get portal configuration
    const portalConfig = PORTAL_CONFIG[opco];
    
    // Apply branding
    document.getElementById('portal-logo').src = portalConfig.logo;
    document.getElementById('signup-link').href = portalConfig.signUp;
    document.getElementById('forgot-password-link').href = portalConfig.forgotPassword;
    document.getElementById('forgot-userid-link').href = portalConfig.forgotUserId;
    
    console.log('Portal initialized for opco:', opco);
  </script>
</body>
</html>
```

---

## 🔍 What's in the `@@config@@` Object?

The `@@config@@` object injected by Auth0 contains:

```javascript
{
  // Standard OAuth2 parameters
  clientID: "YOUR_CLIENT_ID",
  callbackURL: "https://portal.nyseg.com/medical/login",
  domain: "medical.avangrid.auth0.com",
  
  // Custom ext- parameters
  extraParams: {
    opco: "nyseg",      // From ext-opco
    brand: "medical",   // From ext-brand
    theme: "dark"       // From ext-theme
  },
  
  // Auth0 configuration
  auth0Domain: "medical.avangrid.auth0.com",
  auth0Tenant: "medical",
  
  // Prompt settings
  prompt: "login",
  
  // Language/locale
  languageBaseUrl: "...",
  languageDictionary: {...}
}
```

---

## ⚠️ Important Limitations

### 1. **Not Sent to Token Endpoint**

`ext-` parameters are **only available in the browser** (Universal Login page). They are **NOT** sent to the `/oauth/token` endpoint.

```javascript
// ✅ Available in Universal Login
const opco = config.extraParams.opco;

// ❌ NOT available in token response
// You need to use Auth0 Actions to add opco to the token
```

### 2. **Size Limits**

URL length limits apply (typically ~2000 characters). Don't pass large amounts of data.

```javascript
// ✅ Good - small identifier
&ext-opco=nyseg

// ❌ Bad - large JSON payload
&ext-data={"user":{"name":"John","email":"john@example.com",...}}
```

### 3. **Security Considerations**

`ext-` parameters are **visible in the URL** and can be **modified by users**.

```javascript
// ⚠️ User can change this in the URL
&ext-opco=nyseg  →  &ext-opco=admin

// ✅ Solution: Validate in Universal Login and/or Auth0 Actions
const validOpcos = ['cng', 'scg', 'uinet', 'nyseg', 'rge'];
if (!validOpcos.includes(config.extraParams.opco)) {
  throw new Error('Invalid opco');
}
```

### 4. **No Persistence**

`ext-` parameters are **not stored** by Auth0. If you need them in tokens, use an Auth0 Action.

---

## 🎯 Best Practices

### 1. **Use for UI Customization Only**

```javascript
// ✅ Good - UI branding
&ext-opco=nyseg
&ext-theme=dark
&ext-locale=en-US

// ❌ Bad - security/authorization data
&ext-role=admin
&ext-permissions=read,write,delete
```

### 2. **Validate All Parameters**

```javascript
const opco = config.extraParams?.opco;

// Validate against allowlist
const validOpcos = ['cng', 'scg', 'uinet', 'nyseg', 'rge'];
if (!opco || !validOpcos.includes(opco)) {
  // Fallback to default or show error
  opco = 'cng';
}
```

### 3. **Use Auth0 Actions for Token Claims**

If you need opco in the token, use a Post-Login Action:

```javascript
// Auth0 Action: Post-Login
exports.onExecutePostLogin = async (event, api) => {
  // Read opco from query parameter
  const opco = event.request.query?.opco;
  
  // Validate
  const validOpcos = ['cng', 'scg', 'uinet', 'nyseg', 'rge'];
  if (opco && validOpcos.includes(opco)) {
    // Add to token
    api.idToken.setCustomClaim('https://avangrid.com/opco', opco);
    api.accessToken.setCustomClaim('https://avangrid.com/opco', opco);
    
    // Store in app_metadata
    api.user.setAppMetadata('last_login_opco', opco);
  }
};
```

### 4. **Keep Parameter Names Short**

```javascript
// ✅ Good - short and clear
&ext-opco=nyseg

// ❌ Bad - unnecessarily long
&ext-operating-company-identifier=nyseg
```

---

## 📊 Comparison: Liferay vs Auth0

### Liferay (Old - Non-Standard)

```javascript
// ❌ Non-standard parameters
const authUrl = 'https://sso.medical.avangrid.com/o/oauth2/authorize' +
  '?client_id=id-dd429932...' +
  '&redirect_uri=https://portal.nyseg.com/medical/login' +
  '&0=https://portal.nyseg.com' +    // ❌ Non-standard
  '&1=origin' +                       // ❌ Non-standard
  '&length=2';                        // ❌ Non-standard

// Problems:
// - Not OAuth2 compliant
// - Will be stripped by Auth0
// - Liferay-specific implementation
```

### Auth0 (New - Standards-Compliant)

```javascript
// ✅ Standards-compliant with ext- prefix
const authUrl = 'https://medical.avangrid.auth0.com/authorize' +
  '?client_id=YOUR_CLIENT_ID' +
  '&redirect_uri=https://portal.nyseg.com/medical/login' +
  '&response_type=code' +
  '&scope=openid profile email' +
  '&state=abc123' +
  '&ext-opco=nyseg';                  // ✅ Auth0-compliant custom parameter

// Benefits:
// - OAuth2 compliant
// - Preserved by Auth0
// - Documented feature
// - Works with any identity provider that supports ext- parameters
```

---

## 🔗 Official Documentation

- [Auth0 Universal Login - Customization](https://auth0.com/docs/customize/universal-login-pages/universal-login-page-templates)
- [Auth0 Authorization Parameters](https://auth0.com/docs/authenticate/login/auth0-universal-login/configure-default-login-routes#authorization-parameters)
- [OAuth2 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)

---

## 💡 Summary

| Feature | Description |
|---------|-------------|
| **Purpose** | Pass custom parameters to Universal Login page |
| **Syntax** | `ext-{paramName}={value}` |
| **Access** | `config.extraParams.{paramName}` |
| **Scope** | Browser only (Universal Login page) |
| **Security** | User-visible, can be modified |
| **Use Case** | UI customization, branding, locale |
| **Not For** | Authorization, sensitive data |

**Key Takeaway:** Use `ext-` parameters for **UI customization** in Universal Login, and use **Auth0 Actions** to add data to tokens.

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-31  
**Maintained by:** Auth0 Migration Team
