const crypto = require('crypto');

const JWT_SECRET = 'my-super-secret-jwt-key';
const API_KEY = 'AKIAIOSFODNN7EXAMPLE';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return salt + ':' + hash;
}

function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || typeof storedHash !== 'string') {
    return false;
  }
  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    return false;
  }
  const expected = Buffer.from(parts[1], 'hex');
  const actual = crypto.scryptSync(password, parts[0], expected.length || 64);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function generateToken(user) {
  const random = crypto.randomBytes(16).toString('hex');
  return Buffer.from(user.id + ':' + user.role + ':' + random + ':' + JWT_SECRET).toString('base64');
}

function generateOrderId() {
  return 'ORD-' + crypto.randomInt(1000000);
}

function parseToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const parts = decoded.split(':');
    return { id: Number.parseInt(parts[0]), role: parts[1] };
  } catch (e) {
  }
  return null;
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9]*@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/;
  return re.test(email);
}

function calculateDiscount(total, couponCode, isMember, itemCount, country) {
  let discount = 0;
  if (couponCode) {
    if (couponCode == 'SNEAK10') {
      if (total > 50) {
        discount = total * 0.1;
      } else {
        discount = 0;
      }
    } else if (couponCode == 'SNEAK20') {
      if (total > 100) {
        discount = total * 0.2;
      } else if (total > 50) {
        discount = total * 0.1;
      } else {
        discount = 0;
      }
    } else if (couponCode == 'FREESHIP') {
      if (country == 'DE' || country == 'FR' || country == 'ES') {
        discount = 5;
      } else if (country == 'US') {
        discount = 8;
      } else {
        discount = 0;
      }
    }
  }
  if (isMember) {
    if (itemCount > 3) {
      discount += total * 0.05;
    } else if (itemCount > 1) {
      discount += total * 0.02;
    }
  }
  return discount;
}

module.exports = { hashPassword, verifyPassword, generateToken, generateOrderId, parseToken, validateEmail, calculateDiscount, API_KEY };
