/**
 * Script 02 — Application Metadata Filtering
 * 
 * Trigger: Post-Login
 * API Modules: api.multifactor
 * 
 * Use Case:
 * Require MFA only for specific applications based on client metadata.
 * Useful when you have multiple applications with different security requirements.
 * 
 * Best Practices:
 * - Use application metadata to configure MFA requirements
 * - Check client.metadata for application-specific settings
 * - Default to secure behavior if metadata is missing
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Check if the application requires MFA via metadata
  const requiresMfa = event.client.metadata?.requires_mfa === 'true';
  
  if (requiresMfa) {
    api.multifactor.enable('any', { allowRememberBrowser: false });
    console.log('MFA required for application:', event.client.name);
  } else {
    console.log('MFA not required for application:', event.client.name);
  }
};
