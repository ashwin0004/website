const container = document.getElementById('food-container');
let currentPage = 1; // Track current page
let lastQuery = '';  // Keep track of last search query
let debounceTimer = null;

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
      <h3>${productName}</h3>
      <p class="brand">${brands}</p>
    `;
    container.appendChild(card);
  });

  // Add pagination buttons
  const pagination = document.createElement('div');
  pagination.className = 'pagination';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.disabled = currentPage === 1; // Disable on first page
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

  lastQuery = query; // store query for pagination
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
  }, 5000); // ms debounce
}

document.getElementById('search')?.addEventListener('input', debounceSearch);

container.innerHTML = '<p>Please enter a Food Item to search!....</p>';
