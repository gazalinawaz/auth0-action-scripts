/**
 * Script 34 — Share Values Between Sequential Actions
 * 
 * Trigger: Post-Login
 * API Modules: api.transaction
 * 
 * Use Case:
 * Pass data between multiple Actions in the same login flow.
 * Useful for risk scoring, progressive profiling, or multi-step validation.
 * 
 * Best Practices:
 * - Use transaction metadata for temporary data
 * - Data only persists during the transaction
 * - Supports string, number, boolean, null
 * - JSON.stringify objects if needed
 * - Clear/remove when no longer needed
 */

/**
 * Action 1: Calculate Risk Score
 */
exports.onExecutePostLogin = async (event, api) => {
  // This would be Action 1 in your flow
  
  // Calculate risk score based on various factors
  let riskScore = 0;
  
  // Check login location
  const knownCountries = ['US', 'GB', 'CA'];
  if (!knownCountries.includes(event.request.geoip?.country_code)) {
    riskScore += 30;
  }
  
  // Check device
  const knownDevices = event.user.app_metadata?.known_devices || [];
  const currentDevice = event.request.user_agent;
  if (!knownDevices.includes(currentDevice)) {
    riskScore += 20;
  }
  
  // Check time of day
  const hour = new Date().getHours();
  if (hour < 6 || hour > 22) {
    riskScore += 15;
  }
  
  // Store risk score for next action
  api.transaction.setMetadata('risk_score', riskScore);
  api.transaction.setMetadata('risk_factors', JSON.stringify({
    unknown_location: !knownCountries.includes(event.request.geoip?.country_code),
    unknown_device: !knownDevices.includes(currentDevice),
    unusual_time: hour < 6 || hour > 22
  }));
  
  console.log('Risk score calculated:', riskScore);
};

/**
 * Action 2: Apply Risk-Based Controls
 * (This would be a separate Action later in the flow)
 */
// exports.onExecutePostLogin = async (event, api) => {
//   // Read risk score from previous action
//   const riskScore = event.transaction?.metadata?.risk_score || 0;
//   const riskFactors = JSON.parse(event.transaction?.metadata?.risk_factors || '{}');
//   
//   console.log('Applying controls for risk score:', riskScore);
//   
//   if (riskScore >= 50) {
//     // High risk - require MFA
//     api.multifactor.enable('any', { allowRememberBrowser: false });
//     console.log('High risk detected - MFA required');
//   } else if (riskScore >= 30) {
//     // Medium risk - challenge with specific factor
//     api.authentication.challengeWith({ type: 'otp' });
//     console.log('Medium risk detected - OTP challenge');
//   }
//   
//   // Clean up transaction metadata
//   api.transaction.setMetadata('risk_score', null);
//   api.transaction.setMetadata('risk_factors', null);
// };
