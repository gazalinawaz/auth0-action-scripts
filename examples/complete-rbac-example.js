/**
 * Complete RBAC (Role-Based Access Control) Example
 * 
 * This example demonstrates a complete RBAC implementation including:
 * - Role assignment on first login
 * - Role-based MFA requirements
 * - Role-based scope assignment
 * - Role mapping to tokens
 * - Access control based on roles
 * 
 * Setup:
 * 1. Create this Action in Auth0 Dashboard
 * 2. Add to Post-Login flow
 * 3. Deploy
 * 
 * Roles:
 * - admin: Full access, always requires MFA
 * - editor: Can read and write, MFA optional
 * - viewer: Read-only access
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://myapp.com';
  
  // Step 1: Assign default role on first login
  if (event.stats.logins_count === 1) {
    // Default role based on email domain
    const emailDomain = event.user.email?.split('@')[1];
    let defaultRole = 'viewer';
    
    if (emailDomain === 'admin.example.com') {
      defaultRole = 'admin';
    } else if (emailDomain === 'staff.example.com') {
      defaultRole = 'editor';
    }
    
    api.user.setAppMetadata('roles', [defaultRole]);
    api.user.setAppMetadata('role_assigned_at', new Date().toISOString());
    
    console.log('Assigned default role:', defaultRole);
  }
  
  // Step 2: Get user roles
  const roles = event.user.app_metadata?.roles || ['viewer'];
  const primaryRole = roles[0];
  
  // Step 3: Role-based MFA requirements
  if (roles.includes('admin')) {
    // Admins always require MFA
    api.multifactor.enable('any', { allowRememberBrowser: false });
    console.log('MFA required for admin role');
  } else if (roles.includes('editor')) {
    // Editors require MFA outside corporate network
    const isOnCorporateNetwork = event.request.ip?.startsWith('192.168.');
    if (!isOnCorporateNetwork) {
      api.multifactor.enable('any', { allowRememberBrowser: true });
      console.log('MFA required for editor outside network');
    }
  }
  
  // Step 4: Role-based scope assignment
  const scopesByRole = {
    'admin': [
      'read:users',
      'write:users',
      'delete:users',
      'read:reports',
      'write:reports',
      'admin:settings'
    ],
    'editor': [
      'read:users',
      'write:users',
      'read:reports',
      'write:reports'
    ],
    'viewer': [
      'read:users',
      'read:reports'
    ]
  };
  
  const scopes = scopesByRole[primaryRole] || scopesByRole['viewer'];
  scopes.forEach(scope => api.accessToken.addScope(scope));
  
  // Step 5: Add roles and permissions to tokens
  api.idToken.setCustomClaim(`${namespace}/roles`, roles);
  api.idToken.setCustomClaim(`${namespace}/primary_role`, primaryRole);
  api.idToken.setCustomClaim(`${namespace}/permissions`, scopes);
  
  api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
  api.accessToken.setCustomClaim(`${namespace}/permissions`, scopes);
  
  // Step 6: Block access for suspended users
  if (event.user.app_metadata?.account_suspended === true) {
    api.access.deny(
      'account_suspended',
      'Your account has been suspended. Please contact support.'
    );
    return;
  }
  
  // Step 7: Log successful login with role info
  console.log(JSON.stringify({
    event: 'rbac_login_success',
    user_id: event.user.user_id,
    email: event.user.email,
    roles: roles,
    scopes: scopes,
    mfa_required: roles.includes('admin'),
    timestamp: new Date().toISOString()
  }));
};

/**
 * Usage in your application:
 * 
 * Frontend (React):
 * ```javascript
 * const { user } = useAuth0();
 * const roles = user['https://myapp.com/roles'];
 * const isAdmin = roles.includes('admin');
 * 
 * if (isAdmin) {
 *   return <AdminDashboard />;
 * }
 * ```
 * 
 * Backend (Node.js):
 * ```javascript
 * const checkRole = (requiredRole) => {
 *   return (req, res, next) => {
 *     const roles = req.user['https://myapp.com/roles'];
 *     if (roles.includes(requiredRole)) {
 *       next();
 *     } else {
 *       res.status(403).json({ error: 'Insufficient permissions' });
 *     }
 *   };
 * };
 * 
 * app.delete('/users/:id', checkRole('admin'), deleteUser);
 * ```
 */
