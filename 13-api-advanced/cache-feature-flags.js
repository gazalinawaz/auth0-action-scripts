/**
 * Script 55 — Cache Feature Flags
 * 
 * Trigger: Post-Login
 * API Modules: api.cache, api.idToken
 * 
 * Use Case:
 * Cache feature flags from external service to avoid repeated API calls.
 * Improves performance and reduces external API load.
 * 
 * Best Practices:
 * - Set appropriate TTL (time to live)
 * - Handle cache misses gracefully
 * - JSON.stringify objects for storage
 * - Use cache for expensive operations only
 * - Don't cache PII or sensitive data
 * 
 * Secrets Required:
 * - FEATURE_FLAG_API_URL: URL of feature flag service
 * - FEATURE_FLAG_API_KEY: API key for authentication
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const CACHE_KEY = 'feature_flags';
  const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  
  let featureFlags = {};
  
  // Try to get from cache first
  const cached = api.cache.get(CACHE_KEY);
  
  if (cached) {
    featureFlags = JSON.parse(cached.value);
    console.log('Feature flags loaded from cache');
  } else {
    // Cache miss - fetch from API
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(event.secrets.FEATURE_FLAG_API_URL, {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${event.secrets.FEATURE_FLAG_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeout);
      
      if (response.ok) {
        featureFlags = await response.json();
        
        // Store in cache
        api.cache.set(CACHE_KEY, JSON.stringify(featureFlags), {
          ttl: CACHE_TTL
        });
        
        console.log('Feature flags fetched and cached');
      } else {
        console.log('Failed to fetch feature flags:', response.status);
      }
    } catch (error) {
      console.log('Error fetching feature flags:', error.message);
      // Use default flags on error
      featureFlags = {
        new_dashboard: false,
        beta_features: false
      };
    }
  }
  
  // Add feature flags to ID token
  const namespace = 'https://myapp.com';
  api.idToken.setCustomClaim(`${namespace}/features`, featureFlags);
};
