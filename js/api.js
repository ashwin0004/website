const container = document.getElementById('food-container');
const cartBadge = document.getElementById('cart-badge');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartContent = document.getElementById('cart-content');

let currentPage = 1;
let lastQuery = '';
let debounceTimer = null;
let cart = [];

// Load cart from localStorage on page load
function loadCart() {
  const savedCart = localStorage.getItem('foodCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('foodCart', JSON.stringify(cart));
  updateCartUI();
}

// Add item to cart
function addToCart(meal) {
  const itemId = meal.id || meal.code || Date.now().toString();
  const existingItem = cart.find(item => item.id === itemId);
  
  if (existingItem) {
    existingItem.quantity += 1;
    showPopup('✅ Item quantity updated in cart!');
  } else {
    cart.push({
      id: itemId,
      name: meal.product_name || 'Unknown Product',
      brand: meal.brands || 'No brand',
      image: meal.image_url || meal.image_front_url || 'https://via.placeholder.com/100x100?text=No+Image',
      quantity: 1
    });
    showPopup('✅ Item added to cart!');
  }
  
  saveCart();
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  showPopup('🗑️ Item removed from cart!');
}

// Update item quantity
function updateQuantity(itemId, change) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      saveCart();
    }
  }
}

// Clear entire cart
function clearCart() {
  if (cart.length === 0) {
    showPopup('⚠️ Cart is already empty!');
    return;
  }
  
  Swal.fire({
    title: 'Clear Cart?',
    text: "Are you sure you want to remove all items?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, clear it!'
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      saveCart();
      showPopup('🗑️ Cart cleared!');
      Swal.fire('Cleared!', 'Your cart has been cleared.', 'success');
    }
  });
}

// Toggle cart modal
function toggleCart() {
  cartModal.style.display = cartModal.style.display === 'flex' ? 'none' : 'flex';
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    showPopup('⚠️ Your cart is empty!');
    return;
  }
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  Swal.fire({
    title: 'Checkout',
    html: `
      <p>Total Items: <strong>${totalItems}</strong></p>
      <p>Ready to proceed with your order?</p>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirm Order'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Success!', 'Your order has been placed!', 'success');
      cart = [];
      saveCart();
      toggleCart();
    }
  });
}

// Update cart UI
function updateCartUI() {
  // Update badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;
  cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';

  // Update cart modal content
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartContent.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartContent.style.display = 'block';
    
    // Render cart items
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="item-brand">${item.brand}</p>
          <div class="quantity-controls">
            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.id}')">×</button>
      </div>
    `).join('');
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target === cartModal) {
    toggleCart();
  }
}

// Create the popup
const popup = document.createElement('div');
popup.id = 'popup-message';
document.body.appendChild(popup);

function showPopup(message) {
  popup.textContent = message;
  popup.classList.add('display');
  setTimeout(() => {
    popup.classList.remove('display');     
  }, 2500);
}

function showLoading() {
  container.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>🍕 Loading delicious food items 🍕...</p>
    </div>
  `;
}

function displayMeals(meals) {
  container.innerHTML = ''; 
  if (!meals || meals.length === 0) {
    showPopup("No food items found!");
    container.innerHTML = '<p>No food found!....</p>';
    return;
  }

  meals.forEach(meal => {
    const card = document.createElement('div');
    card.className = 'food-card';

    const imageUrl = meal.image_url || meal.image_front_url || 'https://via.placeholder.com/200x200?text=No+Image';
    const productName = meal.product_name || 'Unknown Product';
    const brands = meal.brands || 'No brand';

    card.innerHTML = `
      <img src="${imageUrl}" alt="${productName}">
      <div class="card-content">
        <h3>${productName}</h3>
        <p class="brand">${brands}</p>
        <button class="add-to-cart-btn" onclick='addToCart(${JSON.stringify(meal).replace(/'/g, "&apos;")})'>
          🛒 Add to Cart
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Add pagination buttons
  const pagination = document.createElement('div');
  pagination.className = 'pagination';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchMeals(lastQuery);
    }
  });

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchMeals(lastQuery);
  });

  pagination.appendChild(prevBtn);
  pagination.appendChild(nextBtn);
  container.appendChild(pagination);
}

function fetchMeals(query) {
  if (!query){
    container.innerHTML = '<p>Please enter a Food Item to search!....</p>';
    return;
  }

  lastQuery = query;
  showLoading();

  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&page=${currentPage}&json=true`;

  fetch(url)
    .then(res => res.json())
    .then(data => displayMeals(data.products))
    .catch(err => {
      console.error('Error:', err);
      container.innerHTML = '<p>Error loading food items. Please try again.</p>';
      showPopup('Error loading food items!');
    });
}

function debounceSearch() {
  const query = document.getElementById('search').value.trim();

  if(debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    currentPage = 1;
    fetchMeals(query);
  }, 2000);
}

document.getElementById('search')?.addEventListener('input', debounceSearch);

container.innerHTML = '<p>Please enter a Food Item to search!....</p>';

// Load cart on page load
loadCart();




