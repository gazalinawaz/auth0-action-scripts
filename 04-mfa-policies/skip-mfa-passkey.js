/**
 * Script 17 — Skip MFA When Passkey Used
 * 
 * Trigger: Post-Login
 * API Modules: api.multifactor
 * 
 * Use Case:
 * Skip traditional MFA when user authenticates with a passkey (WebAuthn).
 * Passkeys are inherently multi-factor (possession + biometric/PIN).
 * 
 * Best Practices:
 * - Check authentication methods used
 * - Passkeys = possession + biometric = already MFA
 * - Still require MFA for high-risk operations
 * - Log authentication methods for audit
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Check if user authenticated with passkey
  const authMethods = event.authentication?.methods || [];
  const usedPasskey = authMethods.some(method => 
    method.name === 'webauthn-roaming' || 
    method.name === 'webauthn-platform'
  );
  
  if (usedPasskey) {
    // Passkey is already multi-factor (possession + biometric)
    console.log('MFA skipped - User authenticated with passkey');
    return;
  }
  
  // Require traditional MFA for other authentication methods
  api.multifactor.enable('any', { allowRememberBrowser: true });
  console.log('MFA required - Traditional authentication method used');
};
