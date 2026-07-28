/**
 * Script 64 — Map Roles to SAML Groups
 * 
 * Trigger: Post-Login
 * API Modules: api.samlResponse
 * 
 * Use Case:
 * Map Auth0 roles to SAML group attributes for SAML applications.
 * Required for enterprise SSO integrations.
 * 
 * Best Practices:
 * - Only run for SAML protocol
 * - Map internal roles to SAML-friendly names
 * - Use standard SAML attribute names
 * - Handle missing roles gracefully
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Only run for SAML protocol
  if (event.transaction?.protocol !== 'samlp') {
    return;
  }
  
  // Get user roles from app_metadata
  const roles = event.user.app_metadata?.roles || [];
  
  // Map Auth0 roles to SAML groups
  const samlGroups = roles.map(role => {
    const roleMapping = {
      'admin': 'Administrators',
      'editor': 'Content Editors',
      'viewer': 'Read Only Users',
      'support': 'Support Team'
    };
    
    return roleMapping[role] || role;
  });
  
  // Set SAML group attribute
  api.samlResponse.setAttribute(
    'http://schemas.xmlsoap.org/claims/Group',
    samlGroups
  );
  
  // Also set email as NameID
  api.samlResponse.setAttribute(
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    event.user.email
  );
  
  // Set display name
  api.samlResponse.setAttribute(
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    event.user.name || event.user.email
  );
  
  console.log('SAML attributes set - Groups:', samlGroups);
};
