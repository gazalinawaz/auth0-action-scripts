/**
 * Script 37 — Block Suspended Accounts
 * 
 * Trigger: Post-Login
 * API Modules: api.access
 * 
 * Use Case:
 * Block login attempts from suspended user accounts.
 * Useful for temporary account suspension without deletion.
 * 
 * Best Practices:
 * - Store suspension status in app_metadata
 * - Include suspension reason and date
 * - Provide clear error message to user
 * - Log suspension attempts for audit
 * - Consider auto-unsuspension after period
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Check if account is suspended
  const isSuspended = event.user.app_metadata?.account_suspended === true;
  
  if (isSuspended) {
    const suspensionReason = event.user.app_metadata?.suspension_reason || 'Account suspended';
    const suspendedAt = event.user.app_metadata?.suspended_at;
    
    // Log the attempt
    console.log(JSON.stringify({
      action: 'blocked_suspended_account',
      user_id: event.user.user_id,
      email: event.user.email,
      reason: suspensionReason,
      suspended_at: suspendedAt,
      ip: event.request.ip
    }));
    
    // Deny access
    api.access.deny(
      'account_suspended',
      `Your account has been suspended. Reason: ${suspensionReason}. Please contact support@example.com for assistance.`
    );
  }
};
