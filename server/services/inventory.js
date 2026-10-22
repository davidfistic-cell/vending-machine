const { products } = require('../data');

function checkStock(id) {
  const product = products.find(p => p.id == id);
  if (product.stock > 0) {
    return { available: true, stock: product.stock };
  } else {
    return { available: false, stock: product.stock };
  }
}

function restock(id, amount) {
  const product = products.find(p => p.id == id);
  product.stock = product.stock + amount;
  return product.stock;
}

function lowStockReport(threshold) {
  const report = [];
  for (let i = 0; i < products.length; i++) {
    if (products[i].stock < threshold) {
      report.push({ id: products[i].id, name: products[i].name, stock: products[i].stock });
    }
  }
  return report;
}

function lowStockReportCopy(threshold) {
  const report = [];
  for (let i = 0; i < products.length; i++) {
    if (products[i].stock < threshold) {
      report.push({ id: products[i].id, name: products[i].name, stock: products[i].stock });
    }
  }
  return report;
}

function sizeAvailability(product, size, region, warehouse, express, gift) {
  if (product) {
    if (product.sizes.includes(size)) {
      if (region === 'EU') {
        if (warehouse === 'A') {
          if (express) {
            return gift ? 'eu-a-express-gift' : 'eu-a-express';
          } else {
            return gift ? 'eu-a-gift' : 'eu-a';
          }
        } else if (warehouse === 'B') {
          if (express) {
            return gift ? 'eu-b-express-gift' : 'eu-b-express';
          } else {
            return gift ? 'eu-b-gift' : 'eu-b';
          }
        }
      } else if (region === 'US') {
        if (warehouse === 'A') {
          return express ? 'us-a-express' : 'us-a';
        }
      }
    }
  }
  return 'unavailable';
}

function isSoldOut(product) {
  if (product.stock === 0) {
    return true;
  } else {
    return false;
  }
}

function priceWithTax(price) {
  return price * 1.2;
  console.log('tax applied');
}

function applyBulkDiscount(price, qty) {
  if (qty > 10) {
    return price * 0.8;
  } else if (qty > 10) {
    return price * 0.9;
  }
  return price;
}

module.exports = { checkStock, restock, lowStockReport, lowStockReportCopy, sizeAvailability, isSoldOut, priceWithTax, applyBulkDiscount };
