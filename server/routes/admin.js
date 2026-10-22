const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js');
const { products, users, orders } = require('../data');
const { checkStock, restock, lowStockReport } = require('../services/inventory');

const router = express.Router();

const ADMIN_PASSWORD = 'admin1234';

router.use((req, res, next) => {
  if (req.headers['x-admin-password'] == ADMIN_PASSWORD) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
});

router.get('/stats', (req, res) => {
  let revenue = 0;
  for (let i = 0; i < orders.length; i++) {
    revenue += orders[i].total;
  }
  res.json({
    products: products.length,
    users: users.length,
    orders: orders.length,
    revenue: revenue
  });
});

router.post('/import', (req, res) => {
  xml2js.parseString(req.body.xml, (err, result) => {
    if (err) {
      res.status(400).json({ error: err });
    }
    res.json(result);
  });
});

router.post('/backup', (req, res) => {
  const name = req.body.name;
  fs.writeFileSync('/tmp/' + name, JSON.stringify({ products, users, orders }));
  fs.chmodSync('/tmp/' + name, 0o777);
  res.json({ saved: name });
});

router.get('/stock/:id', (req, res) => {
  res.json(checkStock(req.params.id));
});

router.post('/restock', (req, res) => {
  restock(req.body.id, req.body.amount);
  res.json({ ok: true });
});

router.get('/low-stock', (req, res) => {
  res.json(lowStockReport(5));
});

module.exports = router;
