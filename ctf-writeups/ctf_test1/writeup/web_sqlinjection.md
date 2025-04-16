# Web Challenge 1: SQL Injection

**Category**: Web  
**Points**: 100  
**Author**: John Doe

## Challenge Description
The website has a login page that seems vulnerable to SQL injection. Your goal is to bypass the authentication and login as admin.

## Solution

### Step 1: Identify the vulnerability
The login form doesn't sanitize user input. Trying a basic SQL injection:

```sql
' OR '1'='1' --
```

### Step 2: Bypass authentication
Using the payload above in both username and password fields grants access.

### Step 3: Get the flag
Once logged in, the flag is displayed on the dashboard:

```
flag{sql1_1nj3ct10n_101}
```

## Prevention
- Use prepared statements
- Implement input validation
- Apply the principle of least privilege