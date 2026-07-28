/**
 * Script 30 — Safe Logging
 * 
 * Trigger: Post-Login
 * API Modules: None
 * 
 * Use Case:
 * Demonstrate safe logging practices that avoid exposing PII or sensitive data.
 * Essential for compliance (GDPR, HIPAA, etc.) and security.
 * 
 * Best Practices:
 * - Never log passwords, tokens, or secrets
 * - Mask or hash PII (email, phone, SSN)
 * - Log only necessary information
 * - Use structured logging (JSON)
 * - Include correlation IDs for tracing
 */

/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // ❌ BAD: Logging full user object (contains PII)
  // console.log('User:', event.user);
  
  // ✅ GOOD: Log only necessary, non-sensitive data
  console.log(JSON.stringify({
    event: 'user_login',
    user_id: event.user.user_id,
    connection: event.connection.name,
    client_id: event.client.client_id,
    ip: event.request.ip,
    user_agent: event.request.user_agent,
    timestamp: new Date().toISOString(),
    transaction_id: event.transaction?.id
  }));
  
  // ✅ GOOD: Mask email for logging
  const maskedEmail = event.user.email?.replace(/(.{2})(.*)(@.*)/, '$1***$3');
  console.log('Login attempt:', maskedEmail);
  
  // ✅ GOOD: Hash sensitive identifiers
  // const crypto = require('crypto');
  // const hashedUserId = crypto.createHash('sha256').update(event.user.user_id).digest('hex');
  // console.log('User hash:', hashedUserId);
};
