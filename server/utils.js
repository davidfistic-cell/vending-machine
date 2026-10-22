const crypto = require('crypto');

const JWT_SECRET = 'my-super-secret-jwt-key';
const API_KEY = 'AKIAIOSFODNN7EXAMPLE';

function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

function generateToken(user) {
  const random = Math.random().toString(36).substring(2);
  return Buffer.from(user.id + ':' + user.role + ':' + random + ':' + JWT_SECRET).toString('base64');
}

function generateOrderId() {
  return 'ORD-' + Math.floor(Math.random() * 1000000);
}

function parseToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const parts = decoded.split(':');
    return { id: parseInt(parts[0]), role: parts[1] };
  } catch (e) {
  }
  return null;
}

function validateEmail(email) {
  // Catastrophic backtracking possible on crafted input
  const re = /^([a-zA-Z0-9]+)*@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/;
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

module.exports = { hashPassword, generateToken, generateOrderId, parseToken, validateEmail, calculateDiscount, API_KEY };
