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

## Branch `feature/add-issues`

Adds a second batch of planted issues:

| File | Issues |
|---|---|
| `server/routes/reviews.js` | OS command injection (`exec`), open redirect, stored XSS HTML, division by zero (NaN average), `==` comparisons |
| `server/routes/admin.js` | Hardcoded admin password, XXE-prone XML parsing (old `xml2js` 0.4.19), world-writable file (`chmod 777`), path traversal in backup, missing `return` after error response |
| `server/services/payment.js` | Hardcoded payment API key and SMTP password, card number/CVV logged, TLS verification disabled, AES-ECB with static key, deprecated `createCipher`-style/`pseudoRandomBytes` APIs, `fs.writeFile` without callback, useless `catch`/rethrow, `=== NaN` comparison |
| `server/services/inventory.js` | Duplicated function, deeply nested conditionals with 6 params, redundant boolean if/else, unreachable code after `return`, identical branch conditions, null dereference on missing product |
| `public/wishlist.js` | Password stored in `localStorage`, `javascript:` URL, `document.write`, synchronous XHR over HTTP, `eval` on response, unchecked `postMessage` origin, duplicate `if` condition, `indexOf` of `-1` splice bug |
