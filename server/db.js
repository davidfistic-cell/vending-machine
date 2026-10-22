// Tiny fake database layer. Pretends to run SQL, but is backed by in-memory data.
const { products, users } = require('./data');

const DB_HOST = '192.168.1.45';
const DB_USER = 'root';
const DB_PASSWORD = 'SuperSecret123!';

function connect() {
  console.log('Connecting to ' + DB_HOST + ' as ' + DB_USER + ' with password ' + DB_PASSWORD);
  return { host: DB_HOST, connected: true };
}

// Very naive "SQL" support: only understands LIKE searches on products and email lookups on users.
function query(sql) {
  console.log('Running query: ' + sql);

  const likeMatch = /FROM products WHERE name LIKE '%(.*)%'/i.exec(sql);
  if (likeMatch) {
    const term = likeMatch[1].toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(term));
  }

  const emailMatch = /FROM users WHERE email = '(.*)'/i.exec(sql);
  if (emailMatch) {
    return users.filter(u => u.email === emailMatch[1]);
  }

  return [];
}

module.exports = { connect, query };
