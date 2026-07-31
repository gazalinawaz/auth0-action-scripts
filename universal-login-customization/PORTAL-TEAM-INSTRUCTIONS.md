# Portal Team Instructions: Auth0 Migration

## 📋 Overview

This document provides step-by-step instructions for portal development teams to migrate from Liferay OAuth2 to Auth0.

**Scope of Change:** Minimal - One parameter change in your OAuth2 authorization call.

**Estimated Effort:** 1-2 hours per portal (including testing)

---

## 🎯 What You Need to Change

### Summary

Replace the non-standard Liferay parameters (`0=`, `1=`, `length=`) with a single Auth0-compatible parameter (`ext-opco`).

### Before (Liferay)

```javascript
// ❌ OLD - Non-standard parameters that Auth0 will strip
const authUrl = `https://sso.medical.avangrid.com/o/oauth2/authorize` +
  `?client_id=id-dd429932...` +
  `&redirect_uri=https://portal.nyseg.com/medical/login` +
  `&response_type=code` +
  `&scope=openid profile` +
  `&state=${state}` +
  `&0=https://portal.nyseg.com` +      // ❌ Non-standard
  `&1=origin` +                         // ❌ Non-standard
  `&length=2`;                          // ❌ Non-standard

window.location.href = authUrl;
```

### After (Auth0)

```javascript
// ✅ NEW - Standard OAuth2 with ext- parameter
const authUrl = `https://medical.avangrid.auth0.com/authorize` +
  `?client_id=${CLIENT_ID}` +           // ✅ New Auth0 client_id (provided by Auth0 team)
  `&redirect_uri=https://portal.nyseg.com/medical/login` +
  `&response_type=code` +
  `&scope=openid profile email` +
  `&state=${state}` +
  `&ext-opco=nyseg`;                    // ✅ Single clean parameter

window.location.href = authUrl;
```

---

## 🔧 Step-by-Step Implementation

### Step 1: Update Authorization URL

**Location:** Your login redirect logic (typically in auth service or login controller)

**Change Required:**

1. **Update domain:**
   - FROM: `https://sso.medical.avangrid.com/o/oauth2/authorize`
   - TO: `https://medical.avangrid.auth0.com/authorize`

2. **Update client_id:**
   - FROM: `id-dd429932...` (Liferay client ID)
   - TO: `[NEW_CLIENT_ID]` (provided by Auth0 team - see table below)

3. **Replace custom parameters:**
   - REMOVE: `&0=https://portal.nyseg.com&1=origin&length=2`
   - ADD: `&ext-opco=nyseg`

### Step 2: Update Client ID

Each portal will use one of two Auth0 client IDs based on logo group:

| Portal | Opco Code | Auth0 Client ID | Logo Group |
|--------|-----------|-----------------|------------|
| CNG Corp | `cng` | `[GROUP_A_CLIENT_ID]` | A |
| SCG | `scg` | `[GROUP_A_CLIENT_ID]` | A |
| UI Net | `uinet` | `[GROUP_A_CLIENT_ID]` | A |
| NYSEG | `nyseg` | `[GROUP_B_CLIENT_ID]` | B |
| RGE | `rge` | `[GROUP_B_CLIENT_ID]` | B |

**Note:** The Auth0 team will provide the actual client IDs during provisioning.

### Step 3: Update Callback URL Handler

**Location:** Your OAuth2 callback endpoint (e.g., `/medical/login`)

**Change Required:**

1. **Update token endpoint:**
   - FROM: `https://sso.medical.avangrid.com/o/oauth2/token`
   - TO: `https://medical.avangrid.auth0.com/oauth/token`

2. **Update token validation:**
   - FROM: Liferay's JWKS endpoint
   - TO: `https://medical.avangrid.auth0.com/.well-known/jwks.json`

### Step 4: Update Logout

**Location:** Your logout logic

**Change Required:**

1. **Update logout URL:**
   - FROM: `https://sso.medical.avangrid.com/c/portal/logout`
   - TO: `https://medical.avangrid.auth0.com/v2/logout?client_id=${CLIENT_ID}&returnTo=${RETURN_URL}`

---

## 📝 Code Examples

> **💡 Important:** All examples below use **dynamic opco detection** from the portal's URL. This means:
> - ✅ **No hardcoding required** - Same code works for all portals
> - ✅ **Environment-agnostic** - Works in dev, QA, UAT, and production
> - ✅ **Single codebase** - Deploy the same code to all 5 portals
> - ✅ **Automatic detection** - Extracts opco from `portal.{opco}.com` hostname
>
> Example: `portal.nyseg.com` → automatically detects `opco=nyseg`

### Example 1: Angular Application

```typescript
// auth.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // ✅ Configuration
  private readonly AUTH0_DOMAIN = 'medical.avangrid.auth0.com';
  private readonly CLIENT_ID = 'YOUR_CLIENT_ID'; // Provided by Auth0 team
  
  /**
   * Detect opco from current portal URL
   * Extracts opco identifier from hostname (e.g., portal.nyseg.com → nyseg)
   */
  private detectOpco(): string {
    const hostname = window.location.hostname;
    
    // Extract opco from hostname pattern: portal.{opco}.com
    const match = hostname.match(/portal\.(\w+)\.com/);
    if (match) {
      return match[1].toLowerCase(); // Returns: cng, scg, uinet, nyseg, or rge
    }
    
    // Fallback for dev/local environments
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      // Read from environment variable or config
      return 'nyseg'; // Default for local dev
    }
    
    throw new Error('Unable to detect opco from hostname: ' + hostname);
  }
  
  /**
   * Get redirect URI for current portal
   */
  private getRedirectUri(): string {
    return `${window.location.origin}/medical/login`;
  }
  
  /**
   * Redirect user to Auth0 login page
   */
  login(): void {
    const opco = this.detectOpco();
    const redirectUri = this.getRedirectUri();
    const state = this.generateState();
    
    sessionStorage.setItem('auth_state', state);
    
    const authUrl = `https://${this.AUTH0_DOMAIN}/authorize` +
      `?client_id=${this.CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=openid profile email` +
      `&state=${state}` +
      `&ext-opco=${opco}`; // ✅ Dynamically detected opco
    
    window.location.href = authUrl;
  }
  
  /**
   * Handle OAuth2 callback
   */
  async handleCallback(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    // Validate state
    const savedState = sessionStorage.getItem('auth_state');
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }
    
    // Exchange code for tokens
    const tokens = await this.exchangeCodeForTokens(code);
    
    // Store tokens
    sessionStorage.setItem('access_token', tokens.access_token);
    sessionStorage.setItem('id_token', tokens.id_token);
    
    // Redirect to app
    window.location.href = '/medical/dashboard';
  }
  
  /**
   * Exchange authorization code for tokens
   */
  private async exchangeCodeForTokens(code: string): Promise<any> {
    const redirectUri = this.getRedirectUri(); // ✅ Dynamic redirect_uri
    
    const response = await fetch(`https://${this.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: this.CLIENT_ID,
        code: code,
        redirect_uri: redirectUri
      })
    });
    
    if (!response.ok) {
      throw new Error('Token exchange failed');
    }
    
    return response.json();
  }
  
  /**
   * Logout user
   */
  logout(): void {
    const returnTo = encodeURIComponent('https://portal.nyseg.com/medical');
    
    const logoutUrl = `https://${this.AUTH0_DOMAIN}/v2/logout` +
      `?client_id=${this.CLIENT_ID}` +
      `&returnTo=${returnTo}`;
    
    // Clear local storage
    sessionStorage.clear();
    
    // Redirect to Auth0 logout
    window.location.href = logoutUrl;
  }
  
  /**
   * Generate random state for CSRF protection
   */
  private generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
```

### Example 2: React Application

```javascript
// authService.js

const AUTH0_DOMAIN = 'medical.avangrid.auth0.com';
const CLIENT_ID = 'YOUR_CLIENT_ID'; // Provided by Auth0 team

/**
 * Detect opco from current portal URL
 */
const detectOpco = () => {
  const hostname = window.location.hostname;
  
  // Extract opco from hostname pattern: portal.{opco}.com
  const match = hostname.match(/portal\.(\w+)\.com/);
  if (match) {
    return match[1].toLowerCase(); // Returns: cng, scg, uinet, nyseg, or rge
  }
  
  // Fallback for dev/local environments
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'nyseg'; // Default for local dev
  }
  
  throw new Error('Unable to detect opco from hostname: ' + hostname);
};

/**
 * Get redirect URI for current portal
 */
const getRedirectUri = () => {
  return `${window.location.origin}/medical/login`;
};

export const login = () => {
  const opco = detectOpco();
  const redirectUri = getRedirectUri();
  const state = generateState();
  
  sessionStorage.setItem('auth_state', state);
  
  const authUrl = `https://${AUTH0_DOMAIN}/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=openid profile email` +
    `&state=${state}` +
    `&ext-opco=${opco}`; // ✅ Dynamically detected opco
  
  window.location.href = authUrl;
};

export const handleCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  
  // Validate state
  const savedState = sessionStorage.getItem('auth_state');
  if (state !== savedState) {
    throw new Error('Invalid state parameter');
  }
  
  const redirectUri = getRedirectUri(); // ✅ Dynamic redirect_uri
  
  // Exchange code for tokens
  const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code: code,
      redirect_uri: redirectUri
    })
  });
  
  const tokens = await response.json();
  
  // Store tokens
  sessionStorage.setItem('access_token', tokens.access_token);
  sessionStorage.setItem('id_token', tokens.id_token);
  
  return tokens;
};

export const logout = () => {
  const returnTo = encodeURIComponent('https://portal.nyseg.com/medical');
  const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${CLIENT_ID}&returnTo=${returnTo}`;
  
  sessionStorage.clear();
  window.location.href = logoutUrl;
};

const generateState = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
```

### Example 3: Plain JavaScript

```javascript
// login.js

/**
 * Detect opco from current portal URL
 */
function detectOpco() {
  const hostname = window.location.hostname;
  
  // Extract opco from hostname pattern: portal.{opco}.com
  const match = hostname.match(/portal\.(\w+)\.com/);
  if (match) {
    return match[1].toLowerCase(); // Returns: cng, scg, uinet, nyseg, or rge
  }
  
  // Fallback for dev/local environments
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'nyseg'; // Default for local dev
  }
  
  throw new Error('Unable to detect opco from hostname: ' + hostname);
}

/**
 * Get redirect URI for current portal
 */
function getRedirectUri() {
  return window.location.origin + '/medical/login';
}

function redirectToLogin() {
  const AUTH0_DOMAIN = 'medical.avangrid.auth0.com';
  const CLIENT_ID = 'YOUR_CLIENT_ID';
  
  const opco = detectOpco();
  const redirectUri = getRedirectUri();
  const state = generateRandomString(32);
  
  sessionStorage.setItem('auth_state', state);
  
  const authUrl = `https://${AUTH0_DOMAIN}/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=openid profile email` +
    `&state=${state}` +
    `&ext-opco=${opco}`; // ✅ Dynamically detected opco
  
  window.location.href = authUrl;
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
```

---

## 🧪 Testing Checklist

### Pre-Deployment Testing (Dev/QA Environment)

- [ ] Login redirects to Auth0 Universal Login page
- [ ] Correct logo displays (Group A or Group B)
- [ ] Navigation links point to correct portal URLs
  - [ ] Sign Up link works
  - [ ] Forgot Password link works
  - [ ] Forgot UserID link works
- [ ] User can log in with valid credentials
- [ ] Callback handler receives authorization code
- [ ] Token exchange succeeds
- [ ] ID token contains correct opco claim: `https://avangrid.com/opco`
- [ ] User is redirected to portal dashboard
- [ ] Logout redirects to Auth0 logout
- [ ] User is logged out completely

### Cross-Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if applicable)

### Mobile Testing

- [ ] iOS Safari
- [ ] Android Chrome

---

## 🔍 Troubleshooting

### Issue 1: Login page shows wrong logo

**Cause:** `ext-opco` parameter not being passed or incorrect value

**Solution:**
1. Check browser network tab for `/authorize` call
2. Verify `ext-opco` parameter is present
3. Verify value matches your portal: `cng`, `scg`, `uinet`, `nyseg`, or `rge`

### Issue 2: Navigation links point to wrong portal

**Cause:** Same as Issue 1

**Solution:** Ensure `ext-opco` parameter is correct

### Issue 3: Token exchange fails

**Cause:** Incorrect client_id or redirect_uri

**Solution:**
1. Verify client_id matches what Auth0 team provided
2. Verify redirect_uri exactly matches what's configured in Auth0
3. Check Auth0 logs in dashboard for detailed error

### Issue 4: Logout doesn't work

**Cause:** Incorrect logout URL

**Solution:**
1. Use Auth0's `/v2/logout` endpoint
2. Include `client_id` and `returnTo` parameters
3. Ensure `returnTo` URL is in Auth0's allowed logout URLs

---

## 📞 Support Contacts

### Auth0 Team
- **Email:** auth0-team@avangrid.com
- **Slack:** #auth0-migration
- **For:** Auth0 configuration, client IDs, technical issues

### Portal Team Leads
- **CNG/SCG/UINET:** [Contact Name]
- **NYSEG/RGE:** [Contact Name]

---

## 📚 Additional Resources

- [Auth0 Authorization Code Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow)
- [Auth0 Logout](https://auth0.com/docs/authenticate/login/logout)
- [Universal Login Customization](https://auth0.com/docs/customize/universal-login-pages)

---

## ✅ Sign-Off Checklist

Before marking your portal as "migration complete":

- [ ] Code changes implemented
- [ ] All tests passing
- [ ] QA sign-off received
- [ ] Deployed to UAT environment
- [ ] UAT testing complete
- [ ] Production deployment scheduled
- [ ] Rollback plan documented

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-31  
**Maintained by:** Auth0 Migration Team
