# The Vending Machine

A small sneaker shop (Express backend + vanilla JS frontend) built as a **SonarQube test project**.
It contains **intentional** bugs, vulnerabilities, security hotspots and code smells. Do not deploy it.

## Run

```bash
npm install
npm start
# open http://localhost:3000
```

## Scan

```bash
sonar-scanner -Dsonar.host.url=<your server> -Dsonar.token=<your token>
```

## Planted issues (what to look for)

| Area | File | Issue |
|---|---|---|
| Vulnerability | `server/routes/products.js` | SQL injection in `/search`, `eval` of user input in `/filter`, path traversal in `/image/:file` |
| Vulnerability | `server/routes/auth.js` | SQL injection in `/login`, mass assignment of `role` on register, `/users` exposes password hashes, no auth on any admin route |
| Vulnerability | `public/app.js` | DOM XSS via `innerHTML` with unsanitised product/search/order data, `eval` on `location.hash` |
| Secrets | `server/utils.js`, `server/db.js`, `public/app.js` | Hardcoded JWT secret, AWS-style key, DB password |
| Hotspot | `server/utils.js` | MD5 password hashing, `Math.random()` for tokens and order IDs, ReDoS-prone regex |
| Hotspot | `server/index.js` | Wildcard CORS, no rate limiting, no helmet, HTTP only |
| Hotspot | `server/db.js` | Hardcoded IP address |
| Sensitive logging | `server/db.js`, `server/routes/auth.js` | Passwords and credentials written to the console |
| Bugs | `server/routes/orders.js` | Missing `await`/error handling on async call, no validation of `items`, silently skipped out-of-stock items, `var` loop |
| Bugs | `public/app.js` | `unusedHelper` returns wrong value, race on `innerHTML +=` in loops |
| Bugs | `server/utils.js` | Empty `catch` block, `parseInt` without radix |
| Code smells | `server/utils.js` | `calculateDiscount` has very high cognitive complexity and 5 parameters; loose `==` everywhere |
| Code smells | `server/routes/orders.js` | Unused variable, duplicated route logic, commented-out code, TODO comment |
| Code smells | `public/app.js` | `var` instead of `let`/`const`, unused variable `result` |
| Accessibility | `public/index.html` | Missing `lang` attribute, `<img>` without `alt`, inputs without labels |
| Maintainability | whole project | No tests, so coverage will be 0% |
