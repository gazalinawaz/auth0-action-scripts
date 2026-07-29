# Quick Start Guide

## 🚀 5-Minute Setup

### 1. Upload Logos
Upload these two logos to your CDN:
- `cng-scg-ui-logo.png` (for CNG, SCG, UINET)
- `nyseg-rge-logo.png` (for NYSEG, RGE)

### 2. Update Logo URLs
Edit `portal-config.js` and replace:
```javascript
logo: 'https://your-cdn.com/logos/cng-scg-ui-logo.png'
```
with your actual CDN URLs.

### 3. Deploy to Auth0
1. Go to Auth0 Dashboard → **Branding** → **Universal Login**
2. Click **Advanced Options**
3. Toggle **Customize Login Page**
4. Copy/paste contents of `login-page-template.html`
5. Click **Save**

### 4. Update Your Angular App
Add portal parameter when redirecting to login:

```typescript
// In your auth service
loginWithRedirect({
  authorizationParams: {
    portal: this.detectPortal() // 'cng', 'scg', 'uinet', 'nyseg', or 'rge'
  }
});

detectPortal(): string {
  const hostname = window.location.hostname;
  const match = hostname.match(/portal\.ldev-(\w+)\.avangrid\.us/);
  return match ? match[1] : 'cng';
}
```

### 5. Test
Visit each portal URL and verify:
- ✅ Correct logo displays
- ✅ Navigation links point to correct portal
- ✅ Login works

## 📋 Portal URLs

| Portal | URL | Logo |
|--------|-----|------|
| CNG | https://portal.ldev-cng.avangrid.us/medical/login | CNG-SCG-UI |
| SCG | https://portal.ldev-scg.avangrid.us/medical/login | CNG-SCG-UI |
| UINET | https://portal.ldev-uinet.avangrid.us/medical/login | CNG-SCG-UI |
| NYSEG | https://portal.ldev-nyseg.avangrid.us/medical/login | NYSEG-RGE |
| RGE | https://portal.ldev-rge.avangrid.us/medical/login | NYSEG-RGE |

## 🎨 Customization

### Change Brand Colors
Edit in `portal-config.js`:
```javascript
brandColor: '#003366' // Your hex color
```

### Update Welcome Text
Edit in `login-page-template.html`:
```html
<div class="welcome-text">
  <p>Your custom message...</p>
</div>
```

## 🔧 Optional: Add Portal Tracking

Deploy the Action in `action-pass-portal-context.js`:
1. Go to **Actions** → **Library** → **Build Custom**
2. Paste the code
3. Deploy
4. Add to **Login** flow

This will:
- ✅ Track which portal users log in from
- ✅ Add portal info to tokens
- ✅ Log portal usage for analytics

## 📱 Mobile Support

The template is fully responsive and works on all devices.

## 🆘 Need Help?

See `deployment-guide.md` for detailed instructions.
