# Complete Working Examples

This folder contains complete, production-ready examples that combine multiple Auth0 Actions concepts.

## 📚 Available Examples

### 1. Complete RBAC Example
**File:** `complete-rbac-example.js`

A comprehensive Role-Based Access Control implementation including:
- ✅ Automatic role assignment on first login
- ✅ Role-based MFA requirements
- ✅ Role-based scope assignment
- ✅ Token customization with roles
- ✅ Account suspension checks
- ✅ Frontend and backend usage examples

**Use this when:** Building applications with different user permission levels.

---

## 🚀 How to Use These Examples

### Step 1: Copy the Code
1. Open the example file
2. Copy the entire code

### Step 2: Create Action in Auth0
1. Go to Auth0 Dashboard → Actions → Library
2. Click "Build Custom"
3. Name your Action (e.g., "Complete RBAC")
4. Select trigger: "Login / Post Login"
5. Paste the code

### Step 3: Configure (if needed)
Some examples may require:
- Secrets (API keys, URLs)
- Application metadata
- M2M applications

Check the comments in each example for requirements.

### Step 4: Deploy
1. Click "Deploy" button
2. Go to Actions → Flows → Login
3. Drag your Action into the flow
4. Click "Apply"

### Step 5: Test
1. Log in to your application
2. Check Auth0 Logs for output
3. Verify tokens contain expected claims

---

## 💡 Example Categories

### Security & Access Control
- Complete RBAC (Role-Based Access Control)
- Coming soon: Risk-based authentication
- Coming soon: Geo-blocking with exceptions

### User Management
- Coming soon: Progressive profiling
- Coming soon: Account linking with enrichment
- Coming soon: User onboarding flow

### Integration
- Coming soon: External API enrichment
- Coming soon: CRM synchronization
- Coming soon: Analytics tracking

---

## 🎯 Best Practices Demonstrated

All examples follow these best practices:

### Security
- ✅ Use app_metadata for authorization data
- ✅ Never use user_metadata for security decisions
- ✅ Validate all external data
- ✅ Use namespaced claims in tokens
- ✅ Log security events

### Performance
- ✅ Set timeouts for external API calls
- ✅ Handle errors gracefully
- ✅ Don't block login for non-critical operations
- ✅ Use caching when appropriate

### Maintainability
- ✅ Clear variable names
- ✅ Comprehensive comments
- ✅ Structured logging (JSON)
- ✅ Error handling
- ✅ Usage examples included

---

## 📖 Learning Path

**Beginner:**
1. Start with Complete RBAC Example
2. Understand roles and permissions
3. Test in development environment

**Intermediate:**
4. Modify roles and scopes for your needs
5. Add custom business logic
6. Integrate with your application

**Advanced:**
7. Combine multiple examples
8. Add external API integrations
9. Implement custom authentication flows

---

## 🔗 Related Documentation

- [Auth0 Actions Overview](https://auth0.com/docs/customize/actions)
- [Actions Best Practices](https://auth0.com/docs/customize/actions/best-practices)
- [Token Claims](https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims)
- [RBAC Guide](https://auth0.com/docs/manage-users/access-control/rbac)

---

## 💬 Need Help?

- Check the main [README.md](../README.md) for repository overview
- See [API_MODULES.md](../API_MODULES.md) for API reference
- Review [TRIGGERS.md](../TRIGGERS.md) for trigger documentation
- Check [AVAILABLE_SCRIPTS.md](../AVAILABLE_SCRIPTS.md) for all scripts

---

**Last Updated:** 2026-07-28  
**Maintained by:** gazalinawaz
