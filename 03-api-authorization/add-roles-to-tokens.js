/**
 * Script 12 — Add User Roles to Tokens
 * 
 * Trigger: Post-Login
 * API Modules: api.idToken, api.accessToken
 * 
 * Use Case:
 * Add user roles from app_metadata to both ID token and access token.
 * Essential for Role-Based Access Control (RBAC) in your application.
 * 
 * Best Practices:
 * - Store roles in app_metadata (secure, admin-only)
 * - Use namespaced claims (https://your-domain.com/roles)
 * - Add to both ID token (for UI) and access token (for API)
 * - Keep role names consistent across your system
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://myapp.com';
  
  // Get roles from app_metadata (secure storage)
  const roles = event.user.app_metadata?.roles || [];
  
  // Add roles to ID token (for UI/frontend)
  api.idToken.setCustomClaim(`${namespace}/roles`, roles);
  
  // Add roles to access token (for API authorization)
  api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
  
  // Also add permissions if available
  const permissions = event.user.app_metadata?.permissions || [];
  api.accessToken.setCustomClaim(`${namespace}/permissions`, permissions);
  
  console.log('Added roles to tokens:', roles);
};
