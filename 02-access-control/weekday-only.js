/**
 * Script 07 — Allow Access Only on Weekdays
 * 
 * Trigger: Post-Login
 * API Modules: api.access
 * 
 * Use Case:
 * Restrict login access to weekdays only (Monday-Friday).
 * Useful for corporate applications that should only be accessed during business days.
 * 
 * Best Practices:
 * - Use user's timezone for accurate day calculation
 * - Provide clear error messages
 * - Consider exceptions for admin users
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Get current day (0 = Sunday, 6 = Saturday)
  const today = new Date().getDay();
  
  // Check if weekend (0 = Sunday, 6 = Saturday)
  const isWeekend = today === 0 || today === 6;
  
  if (isWeekend) {
    api.access.deny(
      'weekend_login_blocked',
      'Access is only allowed on weekdays (Monday-Friday). Please try again on a business day.'
    );
  }
};
