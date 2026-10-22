const products = [
  { id: 1, name: 'Air Runner 90', brand: 'Nimbus', price: 129.99, sizes: [40, 41, 42, 43, 44], stock: 12, category: 'running' },
  { id: 2, name: 'Court Classic', brand: 'Baseline', price: 89.5, sizes: [38, 39, 40, 41, 42], stock: 25, category: 'lifestyle' },
  { id: 3, name: 'Street Hawk High', brand: 'Urbanite', price: 149.0, sizes: [41, 42, 43, 44, 45], stock: 7, category: 'basketball' },
  { id: 4, name: 'Trail Blazer X', brand: 'Nimbus', price: 159.99, sizes: [40, 41, 42, 43], stock: 0, category: 'trail' },
  { id: 5, name: 'Retro Wave 85', brand: 'Baseline', price: 109.0, sizes: [39, 40, 41, 42, 43], stock: 18, category: 'lifestyle' },
  { id: 6, name: 'Sprint Pro Elite', brand: 'Urbanite', price: 189.99, sizes: [40, 41, 42, 43, 44, 45], stock: 4, category: 'running' }
];

const users = [
  { id: 1, email: 'admin@vendingmachine.shop', passwordHash: '21232f297a57a5a743894a0e4a801fc3', role: 'admin' },
  { id: 2, email: 'jane@example.com', passwordHash: '5f4dcc3b5aa765d61d8327deb882cf99', role: 'customer' }
];

const orders = [];

module.exports = { products, users, orders };
