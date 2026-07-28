/**
 * Script 15 — MFA Outside Corporate Network
 * 
 * Trigger: Post-Login
 * API Modules: api.multifactor
 * 
 * Use Case:
 * Require MFA only when users log in from outside the corporate network.
 * Users on corporate network/VPN can skip MFA for convenience.
 * 
 * Best Practices:
 * - Define corporate IP ranges in secrets or configuration
 * - Always require MFA for high-privilege accounts
 * - Log MFA decisions for security audit
 * - Consider geo-location as additional factor
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Define corporate IP ranges
  const corporateIpRanges = [
    '192.168.1.0/24',    // Office network
    '10.0.0.0/8',        // VPN range
  ];
  
  const userIp = event.request.ip;
  
  // Check if user is on corporate network
  const isOnCorporateNetwork = corporateIpRanges.some(range => {
    const rangePrefix = range.split('/')[0].split('.').slice(0, 3).join('.');
    const userPrefix = userIp.split('.').slice(0, 3).join('.');
    return rangePrefix === userPrefix;
  });
  
  // Always require MFA for admins, regardless of location
  const isAdmin = event.user.app_metadata?.roles?.includes('admin');
  
  if (!isOnCorporateNetwork || isAdmin) {
    api.multifactor.enable('any', { allowRememberBrowser: false });
    console.log('MFA required - User outside corporate network or admin role');
  } else {
    console.log('MFA skipped - User on corporate network');
  }
};
