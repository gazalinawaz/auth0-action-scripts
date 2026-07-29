# Deployment Guide: Multi-Portal Universal Login

This guide walks you through deploying the customized Universal Login page for your multi-portal application.

## 📋 Prerequisites

- Auth0 tenant with appropriate plan (Universal Login customization requires certain plans)
- Auth0 CLI installed (`npm install -g auth0-cli`)
- Logo files hosted on a CDN or accessible URL
- Admin access to Auth0 Dashboard

## 🚀 Deployment Steps

### Step 1: Upload Logo Files

1. **Host your logos on a CDN** (recommended) or use Auth0's CDN:
   - CNG/SCG/UINET logo: `cng-scg-ui-logo.png`
   - NYSEG/RGE logo: `nyseg-rge-logo.png`

2. **Update logo URLs** in `portal-config.js`:
   ```javascript
   logo: 'https://your-cdn.com/logos/cng-scg-ui-logo.png'
   ```

### Step 2: Configure Application Metadata

For each portal, add metadata to your Auth0 application:

1. Go to **Applications** → **Your Angular App** → **Settings**
2. Scroll to **Application Metadata**
3. Add the following keys:

```json
{
  "portal_urls": "cng,scg,uinet,nyseg,rge",
  "default_portal": "cng"
}
```

### Step 3: Deploy Universal Login Template

#### Option A: Using Auth0 Dashboard (Recommended for testing)

1. Go to **Branding** → **Universal Login** → **Advanced Options**
2. Toggle **Customize Login Page**
3. Copy the contents of `login-page-template.html`
4. Paste into the editor
5. Click **Save Changes**

#### Option B: Using Auth0 CLI (Recommended for production)

```bash
# Login to Auth0 CLI
auth0 login

# Deploy the template
auth0 universal-login templates update \
  --template login \
  --file login-page-template.html
```

### Step 4: Pass Portal Context from Your Application

Update your Angular application to pass the portal identifier when redirecting to Auth0:

```typescript
// In your Angular auth service
import { AuthService } from '@auth0/auth0-angular';

export class CustomAuthService {
  constructor(private auth: AuthService) {}
  
  login(portalId: string) {
    // Detect portal from current URL
    const hostname = window.location.hostname;
    const portalMatch = hostname.match(/portal\.ldev-(\w+)\.avangrid\.us/);
    const portal = portalMatch ? portalMatch[1] : 'cng';
    
    this.auth.loginWithRedirect({
      appState: {
        target: '/dashboard'
      },
      authorizationParams: {
        // Pass portal as query parameter
        portal: portal,
        // Or use redirect_uri with portal info
        redirect_uri: `https://portal.ldev-${portal}.avangrid.us/medical/callback`
      }
    });
  }
}
```

### Step 5: Create Auth0 Action (Optional - for logging)

Create an Action to log which portal users are logging in from:

1. Go to **Actions** → **Library** → **Build Custom**
2. Name: "Log Portal Context"
3. Trigger: "Login / Post Login"
4. Copy code from `action-pass-portal-context.js`
5. Deploy and add to Login flow

### Step 6: Test Each Portal

Test the login flow for each portal:

1. **CNG**: `https://portal.ldev-cng.avangrid.us/medical/login`
   - Verify CNG/SCG/UI logo displays
   - Verify links point to CNG URLs

2. **SCG**: `https://portal.ldev-scg.avangrid.us/medical/login`
   - Verify CNG/SCG/UI logo displays
   - Verify links point to SCG URLs

3. **UINET**: `https://portal.ldev-uinet.avangrid.us/medical/login`
   - Verify CNG/SCG/UI logo displays
   - Verify links point to UINET URLs

4. **NYSEG**: `https://portal.ldev-nyseg.avangrid.us/medical/login`
   - Verify NYSEG/RGE logo displays
   - Verify links point to NYSEG URLs

5. **RGE**: `https://portal.ldev-rge.avangrid.us/medical/login`
   - Verify NYSEG/RGE logo displays
   - Verify links point to RGE URLs

## 🔧 Configuration Options

### Option 1: Query Parameter (Recommended)

Pass portal via URL parameter:
```
https://YOUR_DOMAIN.auth0.com/authorize?portal=cng&...
```

### Option 2: Application Metadata

Store portal mapping in application metadata and detect from redirect_uri.

### Option 3: Custom Domain per Portal

Use different Auth0 custom domains for each portal:
- `auth-cng.avangrid.us`
- `auth-scg.avangrid.us`
- etc.

## 🎨 Customization

### Update Brand Colors

Edit in `portal-config.js`:
```javascript
brandColor: '#003366' // Your brand color
```

### Update Welcome Text

Edit in `login-page-template.html`:
```html
<div class="welcome-text">
  <p>Your custom welcome message...</p>
</div>
```

### Add Social Login Buttons

Add to the login form:
```html
<button type="button" class="btn-social">
  <img src="google-icon.svg" alt="Google">
  Sign in with Google
</button>
```

## 📱 Responsive Design

The template is fully responsive and works on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

## ♿ Accessibility

The template follows WCAG 2.1 AA guidelines:
- ✅ Proper ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast compliance

## 🔒 Security Considerations

1. **Logo URLs**: Use HTTPS for all logo URLs
2. **CSP Headers**: Configure Content Security Policy
3. **CORS**: Ensure proper CORS configuration
4. **Secrets**: Never expose API keys in client-side code

## 🐛 Troubleshooting

### Logo not displaying
- Check logo URL is accessible
- Verify CORS headers allow Auth0 domain
- Check browser console for errors

### Links not working
- Verify portal detection logic
- Check browser console for JavaScript errors
- Ensure portal URLs are correct

### Wrong portal detected
- Check URL parameter is being passed
- Verify referrer header is set
- Add logging to debug portal detection

## 📚 Additional Resources

- [Auth0 Universal Login Customization](https://auth0.com/docs/customize/universal-login-pages)
- [Auth0 Branding](https://auth0.com/docs/customize/universal-login-pages/universal-login-page-templates)
- [Auth0 CLI](https://github.com/auth0/auth0-cli)

## 🆘 Support

For issues or questions:
1. Check Auth0 logs: **Monitoring** → **Logs**
2. Review browser console errors
3. Contact Auth0 support with tenant details
