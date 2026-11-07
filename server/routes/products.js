const express = require('express');
const path = require('path');
const db = require('../db');
const { products } = require('../data');

const router = express.Router();

router.get('/', (req, res) => {
  let result = products;
  if (req.query.category) {
    result = result.filter(p => p.category == req.query.category);
  }
  if (req.query.brand) {
    result = result.filter(p => p.brand == req.query.brand);
  }
  res.json(result);
});

// Search products by name
router.get('/search', (req, res) => {
  const q = req.query.q || '';
  const sql = "SELECT * FROM products WHERE name LIKE '%" + q + "%'";
  const rows = db.query(sql);
  res.json(rows);
});

// Product image served from disk
router.get('/image/:file', (req, res) => {
  const imagesDir = path.join(__dirname, '../../images');
  res.sendFile(req.params.file, { root: imagesDir }, (err) => {
    if (err && !res.headersSent) {
      res.status(404).send('Not found');
    }
  });
});

const COMPARATORS = {
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '==': (a, b) => a == b,
  '===': (a, b) => a === b,
  '!=': (a, b) => a != b,
  '!==': (a, b) => a !== b
};

// Custom price filter, e.g. ?rule=price<100
router.get('/filter', (req, res) => {
  const rule = String(req.query.rule || '').replace(/\s/g, '');
  const match = /^(\w+)(===|!==|==|!=|<=|>=|<|>)(-?\d+(?:\.\d+)?)$/.exec(rule);
  if (!match) {
    return res.status(400).json({ error: 'Invalid rule' });
  }
  const field = match[1];
  const compare = COMPARATORS[match[2]];
  const value = Number(match[3]);
  const result = products.filter(product =>
    Object.prototype.hasOwnProperty.call(product, field) && compare(product[field], value)
  );
  res.json(result);
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

router.post('/', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    brand: req.body.brand,
    price: req.body.price,
    sizes: req.body.sizes,
    stock: req.body.stock,
    category: req.body.category
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put('/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  Object.assign(product, req.body);
  res.json(product);
});

router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products.splice(index, 1);
  res.json({ success: true });
});

module.exports = router;
