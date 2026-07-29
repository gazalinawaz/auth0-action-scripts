/**
 * Auth0 Action: Pass Portal Context
 * 
 * Trigger: Post-Login
 * 
 * This Action captures which portal the user logged in from and:
 * 1. Logs it for analytics
 * 2. Adds it to the user's app_metadata
 * 3. Includes it in the ID token for the application
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
  const namespace = 'https://avangrid.us';
  
  // Detect portal from various sources
  let portal = null;
  let portalSource = 'unknown';
  
  // Method 1: From query parameter
  const queryPortal = event.request.query?.portal;
  if (queryPortal) {
    portal = queryPortal.toLowerCase();
    portalSource = 'query_parameter';
  }
  
  // Method 2: From redirect_uri
  if (!portal && event.transaction?.redirect_uri) {
    const match = event.transaction.redirect_uri.match(/portal\.ldev-(\w+)\.avangrid\.us/);
    if (match) {
      portal = match[1].toLowerCase();
      portalSource = 'redirect_uri';
    }
  }
  
  // Method 3: From referer header (if available)
  if (!portal && event.request.headers?.referer) {
    const match = event.request.headers.referer.match(/portal\.ldev-(\w+)\.avangrid\.us/);
    if (match) {
      portal = match[1].toLowerCase();
      portalSource = 'referer_header';
    }
  }
  
  // Validate portal
  const validPortals = ['cng', 'scg', 'uinet', 'nyseg', 'rge'];
  if (!portal || !validPortals.includes(portal)) {
    portal = 'cng'; // Default fallback
    portalSource = 'default_fallback';
  }
  
  // Map portal to full name
  const portalNames = {
    'cng': 'Connecticut Natural Gas',
    'scg': 'Southern Connecticut Gas',
    'uinet': 'UI Net',
    'nyseg': 'New York State Electric & Gas',
    'rge': 'Rochester Gas and Electric'
  };
  
  const portalFullName = portalNames[portal];
  
  // Store portal in app_metadata for tracking
  api.user.setAppMetadata('last_login_portal', portal);
  api.user.setAppMetadata('last_login_portal_name', portalFullName);
  api.user.setAppMetadata('last_login_timestamp', new Date().toISOString());
  
  // Track portal usage history
  const portalHistory = event.user.app_metadata?.portal_login_history || {};
  portalHistory[portal] = (portalHistory[portal] || 0) + 1;
  api.user.setAppMetadata('portal_login_history', portalHistory);
  
  // Add portal context to ID token
  api.idToken.setCustomClaim(`${namespace}/portal`, portal);
  api.idToken.setCustomClaim(`${namespace}/portal_name`, portalFullName);
  
  // Add portal context to access token (for API calls)
  api.accessToken.setCustomClaim(`${namespace}/portal`, portal);
  
  // Log portal login for analytics
  console.log(JSON.stringify({
    event: 'portal_login',
    user_id: event.user.user_id,
    email: event.user.email,
    portal: portal,
    portal_name: portalFullName,
    portal_source: portalSource,
    connection: event.connection.name,
    ip: event.request.ip,
    user_agent: event.request.user_agent,
    timestamp: new Date().toISOString()
  }));
  
  // Optional: Portal-specific logic
  switch (portal) {
    case 'nyseg':
    case 'rge':
      // NYSEG and RGE specific logic
      console.log('NYSEG/RGE portal login');
      break;
    
    case 'cng':
    case 'scg':
    case 'uinet':
      // CNG/SCG/UINET specific logic
      console.log('CNG/SCG/UINET portal login');
      break;
  }
};

/**
 * Usage in your Angular application:
 * 
 * ```typescript
 * import { AuthService } from '@auth0/auth0-angular';
 * 
 * export class AppComponent {
 *   constructor(private auth: AuthService) {
 *     this.auth.user$.subscribe(user => {
 *       const portal = user['https://avangrid.us/portal'];
 *       const portalName = user['https://avangrid.us/portal_name'];
 *       
 *       console.log('User logged in from:', portalName);
 *       
 *       // Use portal info to customize UI
 *       this.customizeUIForPortal(portal);
 *     });
 *   }
 *   
 *   customizeUIForPortal(portal: string) {
 *     // Apply portal-specific branding, features, etc.
 *   }
 * }
 * ```
 */
