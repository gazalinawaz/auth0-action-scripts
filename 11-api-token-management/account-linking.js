/**
 * Script 44 — Account Linking - Set Primary User
 * 
 * Trigger: Post-Login
 * API Modules: api.authentication
 * 
 * Use Case:
 * Automatically link social/enterprise accounts to existing database accounts
 * when they share the same verified email address. This prevents duplicate
 * user profiles and allows users to log in with multiple identity providers
 * while maintaining a single user profile.
 * 
 * How It Works:
 * 1. User logs in with social provider (Google, Facebook, etc.)
 * 2. Action searches for existing users with same verified email
 * 3. Finds primary database account (auth0 connection)
 * 4. Links social identity to database account via Management API
 * 5. Sets database account as primary for this session
 * 6. User gets database account profile with all metadata preserved
 * 
 * Best Practices:
 * - Only link verified email addresses (security)
 * - Use database accounts as primary (most stable)
 * - Link via Management API before setting primary user
 * - Handle errors gracefully (don't block login)
 * - Log all linking attempts for audit trail
 * - Set timeouts for API calls
 * 
 * Secrets Required:
 * - M2M_CLIENT_ID: Machine-to-Machine application Client ID
 * - M2M_CLIENT_SECRET: Machine-to-Machine application Client Secret
 * 
 * M2M Application Setup:
 * 1. Create M2M application in Auth0 Dashboard
 * 2. Authorize for Auth0 Management API
 * 3. Grant scopes: read:users, update:users
 * 4. Add Client ID and Secret to Action secrets
 * 
 * Related Scripts:
 * - Script 19: Store External User ID (Pre-Registration)
 * - Script 23: Set Metadata on User Profile (Pre-Registration)
 * - Script 45: Record Custom Auth Method
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  console.log('🔍 Account Linking Action Started');
  console.log('User:', event.user.user_id);
  console.log('Email:', event.user.email);
  console.log('Connection:', event.connection.name);
  console.log('Strategy:', event.connection.strategy);

  // Skip for database connections (they are the primary accounts)
  if (event.connection.strategy === 'auth0') {
    console.log('✅ Database connection - no linking needed');
    return;
  }

  // Require verified email for security
  if (!event.user.email_verified) {
    console.log('❌ Email not verified, skipping account linking');
    return;
  }

  // Set timeout for all API calls
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    console.log('🔑 Step 1: Getting Management API token...');
    
    // Get fresh Management API token using M2M credentials
    const tokenResponse = await fetch(
      `https://${event.request.hostname}/oauth/token`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: event.secrets.M2M_CLIENT_ID,
          client_secret: event.secrets.M2M_CLIENT_SECRET,
          audience: `https://${event.request.hostname}/api/v2/`,
          grant_type: 'client_credentials'
        })
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.log('❌ Failed to get token:', tokenResponse.status, errorText);
      return;
    }

    const tokenData = await tokenResponse.json();
    const access_token = tokenData?.access_token;

    if (!access_token) {
      console.log('❌ No access token in response');
      return;
    }

    console.log('✅ Token obtained successfully');
    console.log('🔍 Step 2: Searching for users with email:', event.user.email);

    // Search for all users with the same email address
    const searchEmail = encodeURIComponent(event.user.email);
    const usersUrl = `https://${event.request.hostname}/api/v2/users-by-email?email=${searchEmail}`;
    
    const usersResponse = await fetch(usersUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!usersResponse.ok) {
      const errorText = await usersResponse.text();
      console.log('❌ Failed to fetch users:', usersResponse.status, errorText);
      return;
    }

    console.log('✅ Users fetched successfully');

    const usersData = await usersResponse.json();
    
    // Validate response is an array
    if (!Array.isArray(usersData)) {
      console.log('❌ Invalid users response format');
      return;
    }

    console.log('📊 Found', usersData.length, 'user(s) with this email');

    // Find primary account (database connection with verified email)
    const primaryUser = usersData.find(u => {
      const identities = u?.identities;
      if (!Array.isArray(identities) || identities.length === 0) {
        return false;
      }
      const isPrimary = identities[0]?.provider === 'auth0' && u?.email_verified === true;
      if (isPrimary) {
        console.log('✅ Found primary user:', u.user_id);
      }
      return isPrimary;
    });

    if (!primaryUser) {
      console.log('❌ No verified primary database account found');
      console.log('Available users:', usersData.map(u => ({
        user_id: u.user_id,
        connection: u.identities?.[0]?.connection,
        email_verified: u.email_verified
      })));
      return;
    }

    if (primaryUser.user_id === event.user.user_id) {
      console.log('✅ User is already the primary account');
      return;
    }

    console.log('🔍 Step 3: Checking if already linked...');

    // Extract provider and user_id from current user
    const userIdParts = event.user.user_id.split('|');
    if (userIdParts.length !== 2) {
      console.log('❌ Invalid user_id format:', event.user.user_id);
      return;
    }

    const [provider, userId] = userIdParts;

    // Check if accounts are already linked
    const alreadyLinked = primaryUser.identities?.some(
      identity => 
        identity?.provider === provider && 
        identity?.user_id === userId
    ) || false;

    if (alreadyLinked) {
      console.log('✅ Accounts already linked');
      // Still set primary user for this session
      api.authentication.setPrimaryUser(primaryUser.user_id);
      return;
    }

    console.log('🔗 Step 4: Linking accounts via Management API...');
    console.log('Primary:', primaryUser.user_id);
    console.log('Secondary:', event.user.user_id, '(provider:', provider, ', userId:', userId, ')');

    // Link accounts via Management API
    // This creates the link in Auth0's database
    const linkResponse = await fetch(
      `https://${event.request.hostname}/api/v2/users/${encodeURIComponent(primaryUser.user_id)}/identities`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: provider,
          user_id: userId
        })
      }
    );

    if (!linkResponse.ok) {
      const errorText = await linkResponse.text();
      console.log('❌ Failed to link accounts:', linkResponse.status, errorText);
      return;
    }

    const linkResult = await linkResponse.json();
    console.log('✅ Accounts linked via Management API!');
    console.log('Link result:', JSON.stringify(linkResult));

    // Set the primary user for this session
    // This ensures the user gets the database account profile
    api.authentication.setPrimaryUser(primaryUser.user_id);

    console.log('✅ PRIMARY USER SET!');
    console.log('🎉 ACCOUNT LINKING COMPLETE!');
    
    // Log successful linking for audit trail
    console.log(JSON.stringify({
      action: 'account-linked-success',
      primary_user_id: primaryUser.user_id,
      secondary_user_id: event.user.user_id,
      provider: provider,
      connection: event.connection.name,
      email: event.user.email,
      timestamp: new Date().toISOString()
    }));

  } catch (error) {
    // Non-critical error - log but don't block login
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.log('❌ ACCOUNT LINKING FAILED');
    console.log(JSON.stringify({
      action: 'account-linking-failed',
      error: errorMessage,
      user_id: event.user.user_id,
      email: event.user.email,
      connection: event.connection.name,
      timestamp: new Date().toISOString()
    }));
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Example Result:
 * 
 * Before Linking:
 * - User 1: auth0|abc123 (MerryweatherDB) - Primary
 * - User 2: google-oauth2|xyz789 (Google) - Separate account
 * 
 * After Linking:
 * - User: auth0|abc123 (MerryweatherDB) - Primary
 *   - Identity 1: MerryweatherDB (primary)
 *   - Identity 2: google-oauth2 (linked)
 * 
 * User can now log in with either:
 * - Database credentials → auth0|abc123
 * - Google OAuth → auth0|abc123 (same profile)
 * 
 * Benefits:
 * - Single user profile
 * - Preserved metadata (app_metadata, user_metadata)
 * - Consistent user experience
 * - No duplicate accounts
 * - Audit trail of all logins
 */
