# Auth0 Universal Login Customization for Multi-Portal Application

This guide shows how to customize the Auth0 Universal Login page to display different logos and navigation links based on the portal URL.

## 📋 Requirements

### Portal URLs
- `https://portal.ldev-cng.avangrid.us/medical/login`
- `https://portal.ldev-scg.avangrid.us/medical/login`
- `https://portal.ldev-uinet.avangrid.us/medical/login`
- `https://portal.ldev-nyseg.avangrid.us/medical/login`
- `https://portal.ldev-rge.avangrid.us/medical/login`

### Logo Requirements
- **CNG, SCG, UINET**: Share the same logo (CNG-SCG-UI logo)
- **NYSEG, RGE**: Share a different logo (NYSEG-RGE logo)

### Navigation Links (per portal)
- Sign Up: `https://portal.ldev-{portal}.avangrid.us/medical/sign-up`
- Forgot Password: `https://portal.ldev-{portal}.avangrid.us/medical/forgot-password`
- Forgot User ID: `https://portal.ldev-{portal}.avangrid.us/medical/forgot-userid`

## 🚀 Implementation Approach

### Option 1: Using Application Metadata (Recommended)
Store portal configuration in Auth0 Application metadata and pass via query parameters.

### Option 2: Using Referrer Header
Detect the portal from the HTTP Referrer header.

### Option 3: Using Custom Domain per Portal
Use different custom domains for each portal.

## 📁 Files in This Directory

1. `login-page-template.html` - Main Universal Login page template
2. `login-prompt.liquid` - Liquid template for login form
3. `portal-config.js` - Portal configuration and logo mapping
4. `custom-css.css` - Custom styling for the login page
5. `deployment-guide.md` - Step-by-step deployment instructions
6. `action-pass-portal-context.js` - Auth0 Action to pass portal context

## 🎨 Customization Features

- ✅ Dynamic logo based on portal
- ✅ Portal-specific navigation links
- ✅ Consistent branding per portal group
- ✅ Responsive design
- ✅ Accessibility compliant
- ✅ Works with all Auth0 features (MFA, social login, etc.)

## 📖 Quick Start

See `deployment-guide.md` for detailed setup instructions.
