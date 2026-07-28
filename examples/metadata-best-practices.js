/**
 * Complete Metadata Best Practices Example
 * 
 * This example demonstrates the proper use of app_metadata vs user_metadata:
 * 
 * app_metadata (System/Business Data):
 * - Only admins can modify
 * - Use for authorization (roles, permissions)
 * - Use for business data (customer ID, subscription)
 * - Safe for security decisions
 * 
 * user_metadata (User Preferences):
 * - Users can modify via API
 * - Use for personalization (theme, language)
 * - Never use for authorization
 * - Safe for UI preferences only
 * 
 * Setup:
 * 1. Create this Action in Auth0 Dashboard
 * 2. Add to Post-Login flow
 * 3. Deploy
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://myapp.com';
  
  // ========================================
  // FIRST LOGIN: Initialize Metadata
  // ========================================
  
  if (event.stats.logins_count === 1) {
    console.log('First login - initializing metadata');
    
    // ✅ app_metadata: System/Business Data (Admin-only)
    api.user.setAppMetadata('signup_date', new Date().toISOString());
    api.user.setAppMetadata('signup_method', event.connection.name);
    api.user.setAppMetadata('customer_id', `CUST-${Date.now()}`);
    api.user.setAppMetadata('account_tier', 'free');
    api.user.setAppMetadata('roles', ['user']); // Default role
    api.user.setAppMetadata('subscription_expires', null);
    api.user.setAppMetadata('internal_notes', ''); // For admin use
    
    // ✅ user_metadata: User Preferences (User-editable)
    api.user.setUserMetadata('theme', 'light');
    api.user.setUserMetadata('language', event.request.language || 'en');
    api.user.setUserMetadata('timezone', event.request.geoip?.time_zone || 'UTC');
    api.user.setUserMetadata('notifications_enabled', true);
    api.user.setUserMetadata('newsletter_subscribed', false);
    api.user.setUserMetadata('email_frequency', 'weekly');
  }
  
  // ========================================
  // UPDATE LOGIN TRACKING (app_metadata)
  // ========================================
  
  // Track login count and last login (system data)
  api.user.setAppMetadata('last_login', new Date().toISOString());
  api.user.setAppMetadata('total_logins', event.stats.logins_count);
  
  // Track last login IP and location (for security)
  api.user.setAppMetadata('last_ip', event.request.ip);
  api.user.setAppMetadata('last_country', event.request.geoip?.country_code);
  
  // ========================================
  // AUTHORIZATION (app_metadata ONLY)
  // ========================================
  
  // ✅ CORRECT: Use app_metadata for authorization
  const roles = event.user.app_metadata?.roles || [];
  const accountTier = event.user.app_metadata?.account_tier || 'free';
  const customerId = event.user.app_metadata?.customer_id;
  
  // Add to tokens for authorization
  api.idToken.setCustomClaim(`${namespace}/roles`, roles);
  api.idToken.setCustomClaim(`${namespace}/tier`, accountTier);
  api.idToken.setCustomClaim(`${namespace}/customer_id`, customerId);
  
  api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
  api.accessToken.setCustomClaim(`${namespace}/tier`, accountTier);
  
  // Role-based access control
  if (roles.includes('admin')) {
    api.accessToken.addScope('admin:all');
  } else if (roles.includes('premium')) {
    api.accessToken.addScope('premium:features');
  }
  
  // Tier-based access control
  if (accountTier === 'premium' || accountTier === 'enterprise') {
    api.accessToken.addScope('advanced:reports');
  }
  
  // ❌ WRONG: Never use user_metadata for authorization
  // const isAdmin = event.user.user_metadata?.is_admin; // Users can change this!
  // if (isAdmin) {
  //   api.accessToken.addScope('admin:all'); // SECURITY RISK!
  // }
  
  // ========================================
  // PERSONALIZATION (user_metadata)
  // ========================================
  
  // ✅ CORRECT: Use user_metadata for UI preferences
  const theme = event.user.user_metadata?.theme || 'light';
  const language = event.user.user_metadata?.language || 'en';
  const timezone = event.user.user_metadata?.timezone || 'UTC';
  
  // Add to ID token for UI personalization
  api.idToken.setCustomClaim(`${namespace}/preferences`, {
    theme: theme,
    language: language,
    timezone: timezone,
    notifications: event.user.user_metadata?.notifications_enabled || true
  });
  
  // ========================================
  // BUSINESS LOGIC EXAMPLES
  // ========================================
  
  // Example 1: Check subscription expiration (app_metadata)
  const subscriptionExpires = event.user.app_metadata?.subscription_expires;
  if (subscriptionExpires && new Date(subscriptionExpires) < new Date()) {
    // Downgrade to free tier
    api.user.setAppMetadata('account_tier', 'free');
    console.log('Subscription expired - downgraded to free tier');
  }
  
  // Example 2: Upgrade tracking (app_metadata)
  const previousTier = event.user.app_metadata?.account_tier;
  // If tier changed (would be set by your backend/webhook)
  if (previousTier === 'free' && accountTier === 'premium') {
    api.user.setAppMetadata('upgraded_at', new Date().toISOString());
    console.log('User upgraded to premium');
  }
  
  // Example 3: Security flags (app_metadata)
  const accountSuspended = event.user.app_metadata?.account_suspended === true;
  const requiresPasswordReset = event.user.app_metadata?.force_password_reset === true;
  
  if (accountSuspended) {
    api.access.deny('account_suspended', 'Your account has been suspended. Contact support.');
    return;
  }
  
  if (requiresPasswordReset) {
    // Redirect to password reset (would need redirect action)
    console.log('User requires password reset');
  }
  
  // ========================================
  // LOGGING (Structured)
  // ========================================
  
  console.log(JSON.stringify({
    event: 'login_with_metadata',
    user_id: event.user.user_id,
    email: event.user.email,
    // app_metadata (business data)
    customer_id: customerId,
    account_tier: accountTier,
    roles: roles,
    total_logins: event.stats.logins_count,
    // user_metadata (preferences)
    theme: theme,
    language: language,
    // context
    connection: event.connection.name,
    ip: event.request.ip,
    timestamp: new Date().toISOString()
  }));
};

/**
 * ========================================
 * USAGE IN YOUR APPLICATION
 * ========================================
 */

/**
 * Frontend (React) - Reading from ID Token
 */
// const { user } = useAuth0();
// 
// // Authorization (from app_metadata)
// const roles = user['https://myapp.com/roles'];
// const tier = user['https://myapp.com/tier'];
// const customerId = user['https://myapp.com/customer_id'];
// 
// const isAdmin = roles.includes('admin');
// const isPremium = tier === 'premium' || tier === 'enterprise';
// 
// // Personalization (from user_metadata)
// const preferences = user['https://myapp.com/preferences'];
// const theme = preferences.theme;
// const language = preferences.language;
// 
// // Conditional rendering based on role
// if (isAdmin) {
//   return <AdminDashboard />;
// }
// 
// // Conditional features based on tier
// if (isPremium) {
//   return <PremiumFeatures />;
// }
// 
// // Apply theme
// document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';

/**
 * Backend (Node.js) - Updating Metadata
 */
// const { ManagementClient } = require('auth0');
// 
// const management = new ManagementClient({
//   domain: 'YOUR_DOMAIN.auth0.com',
//   clientId: 'YOUR_M2M_CLIENT_ID',
//   clientSecret: 'YOUR_M2M_CLIENT_SECRET'
// });
// 
// // ✅ Update app_metadata (admin/system only)
// await management.updateUser(
//   { id: 'auth0|123456' },
//   {
//     app_metadata: {
//       account_tier: 'premium',
//       subscription_expires: '2027-12-31',
//       roles: ['user', 'premium']
//     }
//   }
// );
// 
// // ✅ Update user_metadata (user can also do this)
// await management.updateUser(
//   { id: 'auth0|123456' },
//   {
//     user_metadata: {
//       theme: 'dark',
//       language: 'es',
//       notifications_enabled: false
//     }
//   }
// );

/**
 * User Self-Service (Frontend) - User Updates Their Preferences
 */
// async function updateUserPreferences(accessToken, preferences) {
//   // User can only update user_metadata, not app_metadata
//   const response = await fetch(
//     `https://YOUR_DOMAIN.auth0.com/api/v2/users/${userId}`,
//     {
//       method: 'PATCH',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         user_metadata: preferences // Only user_metadata allowed
//       })
//     }
//   );
//   
//   return response.json();
// }
// 
// // Usage
// await updateUserPreferences(userAccessToken, {
//   theme: 'dark',
//   language: 'en',
//   notifications_enabled: false
// });

/**
 * ========================================
 * DECISION TREE: Which Metadata to Use?
 * ========================================
 * 
 * Is this data for authorization/security?
 * ├─ YES → Use app_metadata
 * │   └─ Examples: roles, permissions, subscription tier, customer ID
 * │
 * └─ NO → Is this user preference/personalization?
 *     ├─ YES → Use user_metadata
 *     │   └─ Examples: theme, language, notifications, display name
 *     │
 *     └─ NO → Is this sensitive business data?
 *         ├─ YES → Use app_metadata
 *         │   └─ Examples: internal notes, account status, billing info
 *         │
 *         └─ NO → Use user_metadata
 *             └─ Examples: bio, avatar preferences, UI settings
 */

/**
 * ========================================
 * COMMON PATTERNS
 * ========================================
 */

// Pattern 1: Role Assignment Based on Email Domain
// if (event.stats.logins_count === 1) {
//   const emailDomain = event.user.email?.split('@')[1];
//   let role = 'user';
//   
//   if (emailDomain === 'admin.company.com') {
//     role = 'admin';
//   } else if (emailDomain === 'staff.company.com') {
//     role = 'staff';
//   }
//   
//   api.user.setAppMetadata('roles', [role]);
// }

// Pattern 2: Track Feature Usage (app_metadata)
// const featureUsage = event.user.app_metadata?.feature_usage || {};
// featureUsage.last_report_generated = new Date().toISOString();
// api.user.setAppMetadata('feature_usage', featureUsage);

// Pattern 3: Progressive Profiling (user_metadata)
// if (!event.user.user_metadata?.onboarding_completed) {
//   // Redirect to onboarding flow
//   console.log('User needs to complete onboarding');
// }

/**
 * ========================================
 * SECURITY REMINDERS
 * ========================================
 * 
 * ✅ DO:
 * - Use app_metadata for roles, permissions, business data
 * - Use user_metadata for preferences, UI settings
 * - Validate all user-provided data
 * - Use namespaced claims in tokens
 * - Log security-relevant changes
 * 
 * ❌ DON'T:
 * - Use user_metadata for authorization
 * - Store passwords or secrets in metadata
 * - Store large objects (16 KB limit total)
 * - Trust user_metadata for security decisions
 * - Expose sensitive data in ID tokens
 */
