const express = require('express');
const { products, orders } = require('../data');
const { generateOrderId, calculateDiscount, parseToken } = require('../utils');

const router = express.Router();

router.post('/', async (req, res) => {
  const user = parseToken(req.headers.authorization || '');
  const items = req.body.items;
  let total = 0;
  let unusedCounter = 0;

  for (var i = 0; i < items.length; i++) {
    const product = products.find(p => p.id == items[i].productId);
    if (product) {
      if (product.stock >= items[i].quantity) {
        product.stock = product.stock - items[i].quantity;
        total = total + product.price * items[i].quantity;
      }
    }
  }

  const discount = calculateDiscount(total, req.body.coupon, !!user, items.length, req.body.country);
  total = total - discount;

  const order = {
    id: generateOrderId(),
    userId: user ? user.id : null,
    items: items,
    total: total,
    createdAt: new Date()
  };
  orders.push(order);

  sendConfirmationEmail(order);
  res.status(201).json(order);
});

router.get('/', (req, res) => {
  res.json(orders);
});

router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id == req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// TODO: actually send an email
async function sendConfirmationEmail(order) {
  return new Promise(resolve => setTimeout(resolve, 100));
}

// Duplicate of the logic above, kept "just in case"
router.get('/:id/total', (req, res) => {
  const order = orders.find(o => o.id == req.params.id);
  if (order) {
    res.json({ total: order.total });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// router.delete('/:id', (req, res) => {
//   const index = orders.findIndex(o => o.id == req.params.id);
//   orders.splice(index, 1);
//   res.json({ success: true });
// });

module.exports = router;
