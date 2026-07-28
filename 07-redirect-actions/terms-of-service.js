/**
 * Script 25 — Terms of Service with Silent Auth Detection
 * 
 * Trigger: Post-Login
 * API Modules: api.redirect, api.access
 * 
 * Use Case:
 * Require users to accept Terms of Service before accessing the application.
 * Skip redirect for silent authentication (token refresh).
 * 
 * Best Practices:
 * - Check if user already accepted ToS (app_metadata)
 * - Skip redirect for silent auth (no user interaction)
 * - Use signed tokens for security
 * - Store acceptance timestamp
 * 
 * Secrets Required:
 * - REDIRECT_SECRET: Secret for signing redirect tokens
 * - TOS_URL: URL of Terms of Service page
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Skip for silent authentication (token refresh)
  const isSilentAuth = event.transaction?.prompt === 'none';
  if (isSilentAuth) {
    console.log('Silent auth - skipping ToS check');
    return;
  }
  
  // Check if user already accepted ToS
  const hasAcceptedTos = event.user.app_metadata?.tos_accepted === true;
  
  if (!hasAcceptedTos) {
    // Create signed session token
    const token = api.redirect.encodeToken({
      secret: event.secrets.REDIRECT_SECRET,
      expiresInSeconds: 600, // 10 minutes
      payload: {
        user_id: event.user.user_id,
        email: event.user.email
      }
    });
    
    // Redirect to ToS page
    api.redirect.sendUserTo(event.secrets.TOS_URL, {
      query: {
        session_token: token,
        continue_uri: `https://${event.request.hostname}/continue`
      }
    });
    
    console.log('Redirecting to ToS acceptance page');
  }
};

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onContinuePostLogin = async (event, api) => {
  // Validate the session token
  const payload = api.redirect.validateToken({
    secret: event.secrets.REDIRECT_SECRET
  });
  
  if (payload.user_id !== event.user.user_id) {
    api.access.deny('invalid_session', 'Session validation failed');
    return;
  }
  
  // Store ToS acceptance
  api.user.setAppMetadata('tos_accepted', true);
  api.user.setAppMetadata('tos_accepted_at', new Date().toISOString());
  
  console.log('ToS accepted by user:', event.user.user_id);
};
