/**
 * Portal Configuration for Multi-Portal Universal Login
 * 
 * This configuration maps portal identifiers to their branding and navigation.
 */

const PORTAL_CONFIG = {
  'cng': {
    name: 'CNG',
    fullName: 'Connecticut Natural Gas',
    logo: 'https://your-cdn.com/logos/cng-scg-ui-logo.png', // Replace with actual CDN URL
    logoAlt: 'CNG · SCG · UI - Part of the Avangrid Family',
    baseUrl: 'https://portal.ldev-cng.avangrid.us/medical',
    brandColor: '#003366', // Customize per brand
    links: {
      signUp: 'https://portal.ldev-cng.avangrid.us/medical/sign-up',
      forgotPassword: 'https://portal.ldev-cng.avangrid.us/medical/forgot-password',
      forgotUserId: 'https://portal.ldev-cng.avangrid.us/medical/forgot-userid'
    }
  },
  'scg': {
    name: 'SCG',
    fullName: 'Southern Connecticut Gas',
    logo: 'https://your-cdn.com/logos/cng-scg-ui-logo.png', // Same as CNG
    logoAlt: 'CNG · SCG · UI - Part of the Avangrid Family',
    baseUrl: 'https://portal.ldev-scg.avangrid.us/medical',
    brandColor: '#003366',
    links: {
      signUp: 'https://portal.ldev-scg.avangrid.us/medical/sign-up',
      forgotPassword: 'https://portal.ldev-scg.avangrid.us/medical/forgot-password',
      forgotUserId: 'https://portal.ldev-scg.avangrid.us/medical/forgot-userid'
    }
  },
  'uinet': {
    name: 'UINET',
    fullName: 'UI Net',
    logo: 'https://your-cdn.com/logos/cng-scg-ui-logo.png', // Same as CNG
    logoAlt: 'CNG · SCG · UI - Part of the Avangrid Family',
    baseUrl: 'https://portal.ldev-uinet.avangrid.us/medical',
    brandColor: '#003366',
    links: {
      signUp: 'https://portal.ldev-uinet.avangrid.us/medical/sign-up',
      forgotPassword: 'https://portal.ldev-uinet.avangrid.us/medical/forgot-password',
      forgotUserId: 'https://portal.ldev-uinet.avangrid.us/medical/forgot-userid'
    }
  },
  'nyseg': {
    name: 'NYSEG',
    fullName: 'New York State Electric & Gas',
    logo: 'https://your-cdn.com/logos/nyseg-rge-logo.png', // Different logo
    logoAlt: 'NYSEG · RG&E - Part of the Avangrid Family',
    baseUrl: 'https://portal.ldev-nyseg.avangrid.us/medical',
    brandColor: '#0066CC', // Different brand color
    links: {
      signUp: 'https://portal.ldev-nyseg.avangrid.us/medical/sign-up',
      forgotPassword: 'https://portal.ldev-nyseg.avangrid.us/medical/forgot-password',
      forgotUserId: 'https://portal.ldev-nyseg.avangrid.us/medical/forgot-userid'
    }
  },
  'rge': {
    name: 'RGE',
    fullName: 'Rochester Gas and Electric',
    logo: 'https://your-cdn.com/logos/nyseg-rge-logo.png', // Same as NYSEG
    logoAlt: 'NYSEG · RG&E - Part of the Avangrid Family',
    baseUrl: 'https://portal.ldev-rge.avangrid.us/medical',
    brandColor: '#0066CC',
    links: {
      signUp: 'https://portal.ldev-rge.avangrid.us/medical/sign-up',
      forgotPassword: 'https://portal.ldev-rge.avangrid.us/medical/forgot-password',
      forgotUserId: 'https://portal.ldev-rge.avangrid.us/medical/forgot-userid'
    }
  }
};

/**
 * Detect portal from URL or query parameter
 * @param {string} url - Current URL or referrer
 * @returns {object} Portal configuration
 */
function detectPortal(url) {
  // Try to extract portal from URL
  const urlMatch = url.match(/portal\.ldev-(\w+)\.avangrid\.us/);
  if (urlMatch) {
    const portalKey = urlMatch[1].toLowerCase();
    return PORTAL_CONFIG[portalKey] || PORTAL_CONFIG['cng']; // Default to CNG
  }
  
  // Default fallback
  return PORTAL_CONFIG['cng'];
}

/**
 * Get portal configuration from query parameter
 * @param {URLSearchParams} params - URL search parameters
 * @returns {object} Portal configuration
 */
function getPortalFromParams(params) {
  const portal = params.get('portal') || params.get('brand');
  if (portal && PORTAL_CONFIG[portal.toLowerCase()]) {
    return PORTAL_CONFIG[portal.toLowerCase()];
  }
  return null;
}

/**
 * Initialize portal branding on page load
 */
function initializePortalBranding() {
  // Get portal from URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  let portalConfig = getPortalFromParams(urlParams);
  
  // Fallback to referrer detection
  if (!portalConfig && document.referrer) {
    portalConfig = detectPortal(document.referrer);
  }
  
  // Fallback to current URL
  if (!portalConfig) {
    portalConfig = detectPortal(window.location.href);
  }
  
  // Apply branding
  applyPortalBranding(portalConfig);
  
  return portalConfig;
}

/**
 * Apply portal-specific branding to the page
 * @param {object} config - Portal configuration
 */
function applyPortalBranding(config) {
  // Update logo
  const logoImg = document.querySelector('.portal-logo');
  if (logoImg) {
    logoImg.src = config.logo;
    logoImg.alt = config.logoAlt;
  }
  
  // Update page title
  document.title = `${config.fullName} - Medical Certification Portal`;
  
  // Update navigation links
  const signUpLink = document.querySelector('[data-link="signup"]');
  const forgotPasswordLink = document.querySelector('[data-link="forgot-password"]');
  const forgotUserIdLink = document.querySelector('[data-link="forgot-userid"]');
  
  if (signUpLink) signUpLink.href = config.links.signUp;
  if (forgotPasswordLink) forgotPasswordLink.href = config.links.forgotPassword;
  if (forgotUserIdLink) forgotUserIdLink.href = config.links.forgotUserId;
  
  // Apply brand color (optional)
  document.documentElement.style.setProperty('--brand-color', config.brandColor);
  
  // Store portal context for Auth0
  sessionStorage.setItem('portal_context', JSON.stringify({
    portal: config.name.toLowerCase(),
    baseUrl: config.baseUrl
  }));
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PORTAL_CONFIG, detectPortal, initializePortalBranding };
}
