/**
 * Script 08 — Corporate Network Only (IP Range)
 * 
 * Trigger: Post-Login
 * API Modules: api.access
 * 
 * Use Case:
 * Allow login only from corporate IP addresses or VPN.
 * Useful for internal applications that should only be accessed from office network.
 * 
 * Best Practices:
 * - Store IP ranges in secrets or configuration
 * - Support CIDR notation for IP ranges
 * - Provide exception for specific users (admins, remote workers)
 * - Log blocked attempts for security monitoring
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Define allowed IP ranges (corporate network)
  const allowedIpRanges = [
    '192.168.1.0/24',    // Office network
    '10.0.0.0/8',        // VPN range
    '203.0.113.0/24'     // Remote office
  ];
  
  const userIp = event.request.ip;
  
  // Simple IP check (for production, use a proper CIDR library)
  const isAllowedIp = allowedIpRanges.some(range => {
    // Simplified check - in production use ip-range-check or similar
    const rangePrefix = range.split('/')[0].split('.').slice(0, 3).join('.');
    const userPrefix = userIp.split('.').slice(0, 3).join('.');
    return rangePrefix === userPrefix;
  });
  
  // Allow admins from anywhere
  const isAdmin = event.user.app_metadata?.roles?.includes('admin');
  
  if (!isAllowedIp && !isAdmin) {
    console.log('Blocked login from IP:', userIp);
    
    api.access.deny(
      'ip_not_allowed',
      'Access is only allowed from the corporate network. Please connect to VPN or contact IT support.'
    );
  }
};
