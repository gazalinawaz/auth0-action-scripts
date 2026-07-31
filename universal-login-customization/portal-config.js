/**
 * Portal Configuration for Avangrid Medical Certification Portal
 * 
 * This configuration maps operating company (opco) identifiers to their branding and navigation.
 * 
 * Architecture:
 * - 5 operating companies (opcos): CNG, SCG, UINET, NYSEG, RGE
 * - 2 logo groups: Group A (CNG/SCG/UINET), Group B (NYSEG/RGE)
 * - 2 Auth0 applications: Medical_GroupA, Medical_GroupB
 * - Opco passed via ext-opco parameter in /authorize call
 */

const PORTAL_CONFIG = {
  'cng': {
    name: 'CNG',
    fullName: 'CNG Corp',
    opco: 'cng',
    logoGroup: 'A',
    logo: 'https://cdn.avangrid.com/medical/logos/group-a-logo.png', // CNG/SCG/UINET/BGC logo
    logoAlt: 'CNG · SCG · UI - Part of the Avangrid Family',
    baseUrl: 'https://portal.cngcorp.com/medical',
    brandColor: '#003366',
    links: {
      signUp: 'https://portal.cngcorp.com/medical/sign-up',
      forgotPassword: 'https://portal.cngcorp.com/medical/forgot-password',
      forgotUserId: 'https://portal.cngcorp.com/medical/forgot-userid'
    }
  },
  'scg': {
    name: 'SCG',
    fullName: 'Southern Connecticut Gas',
    opco: 'scg',
    logoGroup: 'A',
    logo: 'https://cdn.avangrid.com/medical/logos/group-a-logo.png', // Same as CNG
    logoAlt: 'CNG · SCG · UI - Part of the Avangrid Family',
    baseUrl: 'https://portal.scg.com/medical',
    brandColor: '#003366',
    links: {
      signUp: 'https://portal.scg.com/medical/sign-up',
      forgotPassword: 'https://portal.scg.com/medical/forgot-password',
      forgotUserId: 'https://portal.scg.com/medical/forgot-userid'
    }
  },
  'uinet': {
    name: 'UINET',
    fullName: 'UI Net',
    opco: 'uinet',
    logoGroup: 'A',
    logo: 'https://cdn.avangrid.com/medical/logos/group-a-logo.png', // Same as CNG
    logoAlt: 'CNG · SCG · UI - Part of the Avangrid Family',
    baseUrl: 'https://portal.uinet.com/medical',
    brandColor: '#003366',
    links: {
      signUp: 'https://portal.uinet.com/medical/sign-up',
      forgotPassword: 'https://portal.uinet.com/medical/forgot-password',
      forgotUserId: 'https://portal.uinet.com/medical/forgot-userid'
    }
  },
  'nyseg': {
    name: 'NYSEG',
    fullName: 'New York State Electric & Gas',
    opco: 'nyseg',
    logoGroup: 'B',
    logo: 'https://cdn.avangrid.com/medical/logos/group-b-logo.png', // NYSEG/RGE logo
    logoAlt: 'NYSEG · RG&E - Part of the Avangrid Family',
    baseUrl: 'https://portal.nyseg.com/medical',
    brandColor: '#0066CC',
    links: {
      signUp: 'https://portal.nyseg.com/medical/sign-up',
      forgotPassword: 'https://portal.nyseg.com/medical/forgot-password',
      forgotUserId: 'https://portal.nyseg.com/medical/forgot-userid'
    }
  },
  'rge': {
    name: 'RGE',
    fullName: 'Rochester Gas and Electric',
    opco: 'rge',
    logoGroup: 'B',
    logo: 'https://cdn.avangrid.com/medical/logos/group-b-logo.png', // Same as NYSEG
    logoAlt: 'NYSEG · RG&E - Part of the Avangrid Family',
    baseUrl: 'https://portal.rge.com/medical',
    brandColor: '#0066CC',
    links: {
      signUp: 'https://portal.rge.com/medical/sign-up',
      forgotPassword: 'https://portal.rge.com/medical/forgot-password',
      forgotUserId: 'https://portal.rge.com/medical/forgot-userid'
    }
  }
};

/**
 * Logo group mapping for Auth0 applications
 * Maps client_id to logo group
 */
const LOGO_GROUP_BY_CLIENT = {
  // Replace with actual Auth0 client IDs after provisioning
  'GROUP_A_CLIENT_ID': 'A', // Medical_GroupA (CNG, SCG, UINET)
  'GROUP_B_CLIENT_ID': 'B'  // Medical_GroupB (NYSEG, RGE)
};

/**
 * Get opco from Auth0 config object (Universal Login)
 * @param {object} config - Auth0 config object from @@config@@
 * @returns {string} Opco identifier (cng, scg, uinet, nyseg, rge)
 */
function getOpcoFromAuth0Config(config) {
  // Primary method: ext-opco parameter
  // Portal calls: /authorize?ext-opco=nyseg
  const opco = config.extraParams?.opco;
  
  if (opco && PORTAL_CONFIG[opco.toLowerCase()]) {
    return opco.toLowerCase();
  }
  
  // Fallback: derive from redirect_uri
  const redirectUri = config.callbackURL || config.redirect_uri;
  if (redirectUri) {
    const match = redirectUri.match(/portal\.(\w+)\.com\/medical/);
    if (match && PORTAL_CONFIG[match[1].toLowerCase()]) {
      return match[1].toLowerCase();
    }
  }
  
  // Default to CNG
  return 'cng';
}

/**
 * Get logo group from Auth0 client_id
 * @param {string} clientId - Auth0 application client_id
 * @returns {string} Logo group ('A' or 'B')
 */
function getLogoGroupFromClientId(clientId) {
  return LOGO_GROUP_BY_CLIENT[clientId] || 'A';
}

/**
 * Initialize portal branding from Auth0 config
 * This is called from Universal Login template after @@config@@ is parsed
 * @param {object} auth0Config - Parsed Auth0 config object
 * @returns {object} Portal configuration
 */
function initializePortalBranding(auth0Config) {
  // Get opco from ext-opco parameter
  const opco = getOpcoFromAuth0Config(auth0Config);
  const portalConfig = PORTAL_CONFIG[opco];
  
  // Verify logo group matches client_id (optional validation)
  const logoGroup = getLogoGroupFromClientId(auth0Config.clientID);
  if (portalConfig.logoGroup !== logoGroup) {
    console.warn(`Logo group mismatch: opco=${opco} expects group ${portalConfig.logoGroup}, but client_id maps to group ${logoGroup}`);
  }
  
  // Apply branding
  applyPortalBranding(portalConfig);
  
  // Log for debugging
  console.log('Portal initialized:', {
    opco: opco,
    logoGroup: portalConfig.logoGroup,
    clientId: auth0Config.clientID
  });
  
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
