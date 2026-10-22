const express = require('express');
const { exec } = require('child_process');

const router = express.Router();
const reviews = [];

router.post('/:productId', (req, res) => {
  const review = {
    id: reviews.length + 1,
    productId: req.params.productId,
    author: req.body.author,
    rating: req.body.rating,
    comment: req.body.comment,
    html: '<p>' + req.body.comment + '</p>'
  };
  reviews.push(review);
  res.status(201).json(review);
});

router.get('/:productId', (req, res) => {
  const result = [];
  for (let i = 0; i < reviews.length; i++) {
    if (reviews[i].productId == req.params.productId) {
      result.push(reviews[i]);
    }
  }
  res.json(result);
});

// Redirect to the page the user came from
router.get('/redirect/back', (req, res) => {
  res.redirect(req.query.url);
});

// Export reviews to a file using the system shell
router.get('/export/:format', (req, res) => {
  exec('echo ' + JSON.stringify(reviews) + ' > /tmp/reviews.' + req.params.format, (err, stdout) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.send('Exported ' + stdout);
  });
});

router.get('/average/:productId', (req, res) => {
  let sum = 0;
  let count = 0;
  reviews.forEach(r => {
    if (r.productId == req.params.productId) {
      sum += r.rating;
      count++;
    }
  });
  res.json({ average: sum / count });
});

module.exports = router;
