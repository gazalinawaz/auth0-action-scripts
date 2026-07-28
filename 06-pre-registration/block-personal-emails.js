/**
 * Script 66 — Block Personal Email Domains
 * 
 * Trigger: Pre-User Registration
 * API Modules: api.validation
 * 
 * Use Case:
 * Block sign-ups from personal email providers (Gmail, Yahoo, etc.).
 * Enforce corporate email addresses only for B2B applications.
 * 
 * Best Practices:
 * - Maintain list of blocked domains
 * - Provide clear error message
 * - Allow exceptions via allowlist
 * - Consider using email verification service
 */

/**
 * @param {Event} event - Details about the registration request.
 * @param {PreUserRegistrationAPI} api - Interface to control registration.
 */
exports.onExecutePreUserRegistration = async (event, api) => {
  // List of blocked personal email domains
  const blockedDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'protonmail.com'
  ];
  
  const email = event.user.email;
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (blockedDomains.includes(domain)) {
    api.validation.error(
      'corporate_email_required',
      'Please use your corporate email address to sign up. Personal email addresses are not allowed.'
    );
  }
};
