/**
 * Script 03 — user_metadata vs app_metadata Separation
 * 
 * Trigger: Post-Login
 * API Modules: api.user, api.idToken
 * 
 * Use Case:
 * Demonstrate proper separation between user_metadata (user preferences)
 * and app_metadata (system/business data). Shows how to add both types
 * to tokens for use in your application.
 * 
 * Best Practices:
 * - user_metadata: User preferences (theme, language, notifications)
 * - app_metadata: Business data (roles, subscription, internal IDs)
 * - Never use user_metadata for authorization (users can modify it)
 * - Always use namespaced claims in tokens
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://myapp.com';
  
  // Set user preferences (user_metadata) - user-editable
  if (!event.user.user_metadata?.theme) {
    api.user.setUserMetadata('theme', 'light');
    api.user.setUserMetadata('language', event.request.language || 'en');
  }
  
  // Set business data (app_metadata) - admin-only
  if (event.stats.logins_count === 1) {
    api.user.setAppMetadata('signup_date', new Date().toISOString());
    api.user.setAppMetadata('signup_method', event.connection.name);
  }
  
  // Add user preferences to ID token (for UI)
  api.idToken.setCustomClaim(`${namespace}/theme`, event.user.user_metadata?.theme);
  api.idToken.setCustomClaim(`${namespace}/language`, event.user.user_metadata?.language);
  
  // Add business data to tokens (for authorization)
  api.idToken.setCustomClaim(`${namespace}/roles`, event.user.app_metadata?.roles || []);
  api.idToken.setCustomClaim(`${namespace}/subscription`, event.user.app_metadata?.subscription_tier);
};
