/**
 * Script 01 — HTTP Request with AbortController Timeout
 * 
 * Trigger: Post-Login
 * API Modules: api.user
 * 
 * Use Case:
 * Make an HTTP request to an external API with a timeout to prevent the Action
 * from hanging. If the request fails or times out, log the error but continue
 * the login (non-critical operation).
 * 
 * Best Practices:
 * - Always set timeouts for external API calls
 * - Use AbortController for fetch timeout
 * - Don't block login for non-critical operations
 * - Clear timeout in finally block
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch('https://entitlements.example.com/user/' + event.user.user_id, {
      signal: controller.signal
    });
    const { roles } = await res.json();
    api.user.setAppMetadata('roles', roles);
  } catch (err) {
    // Non-critical: log and continue login
    console.log('Entitlement fetch failed:', err.message);
  } finally {
    clearTimeout(timer);
  }
};
