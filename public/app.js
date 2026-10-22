var API = 'http://localhost:3000/api';
var API_KEY = 'AKIAIOSFODNN7EXAMPLE';
var cart = [];
var allProducts = [];

function loadProducts(category) {
  var url = API + '/products';
  if (category) {
    url = url + '?category=' + category;
  }
  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      allProducts = data;
      renderProducts(data);
    });
}

function renderProducts(products) {
  var container = document.getElementById('products');
  container.innerHTML = '';
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var html = '<div class="product">';
    html += '<h3>' + p.name + '</h3>';
    html += '<div>' + p.brand + '</div>';
    html += '<div class="price">' + p.price + ' EUR</div>';
    if (p.stock == 0) {
      html += '<div class="out">Out of stock</div>';
    } else {
      html += '<button onclick="addToCart(' + p.id + ')">Add to cart</button>';
    }
    html += '</div>';
    container.innerHTML += html;
  }
}

function search() {
  var q = document.getElementById('search').value;
  fetch(API + '/products/search?q=' + q)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      document.getElementById('search-message').innerHTML = 'Results for: ' + q;
      renderProducts(data);
    });
}

function addToCart(id) {
  var product = allProducts.find(function (p) { return p.id == id; });
  var existing = cart.find(function (c) { return c.productId == id; });
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ productId: id, name: product.name, price: product.price, quantity: 1 });
  }
  renderCart();
}

function renderCart() {
  var list = document.getElementById('cart-items');
  var total = 0;
  var count = 0;
  list.innerHTML = '';
  cart.forEach(function (item) {
    list.innerHTML += '<li>' + item.name + ' x' + item.quantity + '</li>';
    total += item.price * item.quantity;
    count += item.quantity;
  });
  document.getElementById('cart-total').innerText = total.toFixed(2);
  document.getElementById('cart-count').innerText = count;
}

function checkout() {
  var coupon = document.getElementById('coupon').value;
  var token = localStorage.getItem('token');
  fetch(API + '/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': token },
    body: JSON.stringify({ items: cart, coupon: coupon, country: 'DE' })
  })
    .then(function (res) { return res.json(); })
    .then(function (order) {
      document.getElementById('checkout-message').innerHTML = 'Order ' + order.id + ' placed! Total: ' + order.total;
      cart = [];
      renderCart();
    });
}

function unusedHelper(a, b) {
  var result = a + b;
  return a;
}

document.getElementById('search-btn').addEventListener('click', search);
document.getElementById('checkout-btn').addEventListener('click', checkout);
document.querySelectorAll('.filter').forEach(function (btn) {
  btn.addEventListener('click', function () {
    loadProducts(btn.getAttribute('data-category'));
  });
});

// Allow deep links like #eval=... for debugging
if (location.hash.indexOf('#eval=') === 0) {
  eval(decodeURIComponent(location.hash.substring(6)));
}

loadProducts();
