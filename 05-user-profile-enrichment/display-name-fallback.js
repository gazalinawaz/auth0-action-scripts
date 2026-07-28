/**
 * Script 20 — Connection-Safe Display Name
 * 
 * Trigger: Post-Login
 * API Modules: api.idToken
 * 
 * Use Case:
 * Provide a consistent display name across different connection types.
 * Social providers give full names, database connections may only have email.
 * 
 * Best Practices:
 * - Fallback chain: name → nickname → email
 * - Handle missing profile data gracefully
 * - Add to ID token for UI display
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://myapp.com';
  
  // Build display name with fallback chain
  let displayName = event.user.name;
  
  // If name is just email, try to get better name from identities
  if (!displayName || displayName === event.user.email) {
    // Check for social identity with profile data
    const socialIdentity = event.user.identities?.find(
      identity => identity.isSocial && identity.profileData?.name
    );
    
    if (socialIdentity?.profileData?.name) {
      displayName = socialIdentity.profileData.name;
    } else if (event.user.nickname) {
      displayName = event.user.nickname;
    } else {
      displayName = event.user.email?.split('@')[0] || 'User';
    }
  }
  
  // Add to ID token for UI
  api.idToken.setCustomClaim(`${namespace}/display_name`, displayName);
  
  console.log('Display name set:', displayName);
};
