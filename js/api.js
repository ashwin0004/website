const container = document.getElementById('food-container');




// Create the popup
const popup = document.createElement('div');
popup.id = 'popup-message';
document.body.appendChild(popup); 

// Function creates here to show popup message
function showPopup(message) {
  popup.textContent = message;          // message evidai set akkum
  popup.classList.add('display');          // visible akkan
  setTimeout(() => {
    popup.classList.remove('display');     
  }, 2500);
}


function displayMeals(meals) {
  container.innerHTML = ''; 
  if (!meals) {
    showPopup("No food items found!"); 3       

    container.innerHTML = '<p>No food found!</p>';
    return;
  }

  meals.forEach(meal => {
    const card = document.createElement('div');
    card.className = 'food-card';

    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
    `;
    container.appendChild(card);
  });
}

function fetchMeals(query = 'pizza') {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(res => res.json())
    .then(data => displayMeals(data.meals))
    .catch(err => console.error('Error:', err));
}


fetchMeals();


function searchFood() {
  const query = document.getElementById('search').value;
  fetchMeals(query);
}








