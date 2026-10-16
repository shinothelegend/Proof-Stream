---
name: shannon
description: >-
  Autonomous AI pentester for web apps and APIs. Run white-box security
  assessments with full access to source code, endpoints, and configurations.
  Use when the user wants to perform security testing, vulnerability scanning,
  penetration testing, OWASP Top 10 assessment, API security review, or find
  security weaknesses in their codebase. Activate when the user says "pentest",
  "security audit", "find vulnerabilities", "test for XSS/SQLi/CSRF", or
  "security review".
---

# Shannon — AI Pentester Skill

Shannon is an autonomous security assessment skill that performs systematic,
white-box penetration testing of web applications and APIs. It combines static
code analysis, dynamic testing, and security best-practice review.

> ⚠️ **Ethics Notice**: Only test systems you own or have explicit written
> permission to test. Never use this skill against third-party systems without
> authorization.

---

## Assessment Scope

Shannon covers the OWASP Top 10 and common web security weaknesses:

| Category | Coverage |
|----------|----------|
| A01: Broken Access Control | Auth bypass, IDOR, privilege escalation |
| A02: Cryptographic Failures | Weak crypto, plaintext secrets, bad TLS |
| A03: Injection | SQLi, NoSQLi, XSS, SSTI, command injection |
| A04: Insecure Design | Logic flaws, rate limiting, business logic |
| A05: Security Misconfiguration | Headers, CORS, debug mode, defaults |
| A06: Vulnerable Components | Outdated deps, known CVEs |
| A07: Auth Failures | Weak passwords, JWT issues, session fixation |
| A08: Integrity Failures | Deserialization, supply chain |
| A09: Logging Failures | Missing audit logs, sensitive data in logs |
| A10: SSRF | Server-side request forgery |

---

## Workflow

### Phase 1: Reconnaissance

1. **Map the attack surface**
   - List all routes/endpoints (check router files, controllers)
   - Identify authentication boundaries
   - Note user roles and permission levels
   - Find external integrations (APIs, webhooks, OAuth)

2. **Review configuration**
   - Check `.env`, config files for secrets
   - Review CORS policy
   - Check security headers (CSP, HSTS, X-Frame-Options)
   - Inspect dependency versions for known CVEs

```bash
# Check for known vulnerabilities in dependencies
npm audit
pip-audit  # Python
bundler-audit  # Ruby
```

### Phase 2: Static Analysis

Scan source code for common vulnerability patterns:

**SQL Injection patterns:**
```
grep -rn "query\|execute\|raw\|prepare" --include="*.js" .
# Look for: string concatenation in SQL, unsanitized user input in queries
```

**XSS patterns:**
```
grep -rn "innerHTML\|dangerouslySetInnerHTML\|document.write\|eval(" --include="*.js" .
```

**Secrets in code:**
```
grep -rn "password\|secret\|api_key\|token\|private_key" --include="*.{js,ts,py,env}" .
# Also scan: git history, config files
```

**Insecure deserialization:**
```
grep -rn "pickle.loads\|yaml.load\|JSON.parse\|unserialize" .
```

**Command injection:**
```
grep -rn "exec(\|spawn(\|system(\|subprocess" .
# Look for unsanitized user input passed to shell commands
```

**Path traversal:**
```
grep -rn "readFile\|sendFile\|path.join" .
# Look for user-controlled file paths without sanitization
```

### Phase 3: Authentication & Authorization Testing

**JWT Analysis:**
- Check `alg` field — reject `none` or weak algorithms (`HS256` with weak secret)
- Verify expiration (`exp`) is enforced
- Check that tokens are properly validated on every protected route
- Test token with modified claims to check signature verification

**Session Management:**
- Verify `HttpOnly`, `Secure`, `SameSite` flags on session cookies
- Check session invalidation on logout
- Test for session fixation (pre-login session reuse)
- Verify CSRF protection on state-changing endpoints

**Access Control:**
- Test IDOR: change resource IDs in requests to access other users' data
- Test horizontal privilege escalation (user A accessing user B's resources)
- Test vertical privilege escalation (regular user accessing admin endpoints)
- Check if admin routes have proper role validation

### Phase 4: Input Validation Testing

**For each user-controlled input, test:**

1. **XSS**: `<script>alert(1)</script>`, `"><img src=x onerror=alert(1)>`
2. **SQLi**: `' OR '1'='1`, `'; DROP TABLE users; --`, `1 AND SLEEP(5)`
3. **SSTI**: `{{7*7}}`, `${7*7}`, `<%= 7*7 %>`
4. **Path traversal**: `../../../etc/passwd`, `..%2F..%2Fetc%2Fpasswd`
5. **SSRF**: `http://localhost:22`, `http://169.254.169.254/latest/meta-data/`

### Phase 5: API-Specific Testing

- **Mass assignment**: Send extra fields in POST/PUT bodies
- **Rate limiting**: Test if endpoints enforce request limits
- **HTTP method override**: Test `X-HTTP-Method-Override` header
- **GraphQL**: Check for introspection enabled in production, query depth limits
- **Excessive data exposure**: Check if API returns more fields than needed

### Phase 6: Dependency & Supply Chain

```bash
# Node.js
npm audit --audit-level=moderate
npx snyk test

# Python
safety check
pip-audit

# Check for outdated packages with known CVEs
npm outdated
```

---

## Reporting

For each finding, document:

```markdown
## [SEVERITY] Finding Title

**CWE**: CWE-XXX (Vulnerability Type)
**CVSS**: X.X (Critical/High/Medium/Low)
**Location**: `src/controllers/UserController.ts:42`

### Description
What the vulnerability is and why it exists.

### Proof of Concept
Steps to reproduce or code snippet demonstrating the issue.

### Impact
What an attacker could achieve by exploiting this.

### Remediation
Specific code fix or configuration change to resolve the issue.
```

### Severity Levels

| Level | CVSS | Description |
|-------|------|-------------|
| 🔴 Critical | 9.0–10.0 | Immediate exploitation possible, severe impact |
| 🟠 High | 7.0–8.9 | Significant impact, likely exploitable |
| 🟡 Medium | 4.0–6.9 | Moderate impact, requires specific conditions |
| 🟢 Low | 0.1–3.9 | Minor impact or difficult to exploit |
| ℹ️ Info | N/A | Informational, best practice recommendations |

---

## Security Headers Checklist

```
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Common Remediation Patterns

### Prevent SQL Injection
```javascript
// ❌ Vulnerable
db.query(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ Safe — use parameterized queries
db.query('SELECT * FROM users WHERE id = ?', [userId]);
```

### Prevent XSS
```javascript
// ❌ Vulnerable
element.innerHTML = userInput;

// ✅ Safe
element.textContent = userInput;
// Or sanitize with DOMPurify for HTML
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Secure JWT Verification
```javascript
// ✅ Always verify with explicit algorithm
jwt.verify(token, secret, { algorithms: ['HS256'] });
```

### Secure Cookie Settings
```javascript
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 3600000,
});
```
