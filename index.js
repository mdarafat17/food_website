document.addEventListener('DOMContentLoaded', () => {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => displayCategories(data.categories))
        .catch(error => console.error('Error fetching categories:', error));
});

function displayCategories(categories) {
    const categoryContainer = document.getElementById('category-container');
    categoryContainer.innerHTML = '';

    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'col-md-4 mb-4';

        categoryCard.innerHTML = `
            <div class="card" onclick="fetchAndShowDetails('${category.idCategory}', 'category')">
                <img src="${category.strCategoryThumb}" class="card-img-top" alt="${category.strCategory}">
                <div class="card-body">
                    <h5 class="card-title">${category.strCategory}</h5>
                    <p class="card-text">${category.strCategoryDescription.substring(0, 100)}...</p>
                </div>
            </div>
        `;

        categoryContainer.appendChild(categoryCard);
    });
}

function fetchAndShowDetails(id, type) {
    let fetchUrl = '';
    if (type === 'category') {
        fetchUrl = `https://www.themealdb.com/api/json/v1/1/categories.php`;
    } else if (type === 'meal') {
        fetchUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    }

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            if (type === 'category') {
                const category = data.categories.find(cat => cat.idCategory === id);
                showPopup(category.strCategory, category.strCategoryThumb, category.strCategoryDescription);
            } else if (type === 'meal') {
                const meal = data.meals[0];
                showPopup(meal.strMeal, meal.strMealThumb, meal.strInstructions);
            }
        })
        .catch(error => console.error('Error fetching details:', error));
}

function showPopup(title, imageUrl, description) {
    const popupBody = document.getElementById('popup-body');
    popupBody.innerHTML = `
        <h2>${title}</h2>
        <img src="${imageUrl}" class="img-fluid mb-3" alt="${title}">
        <p>${description}</p>
    `;
    document.getElementById('details-popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('details-popup').style.display = 'none';
}

function searchFood() {
    const query = document.getElementById('search-field-hero').value.trim() || document.getElementById('search-field').value.trim();
    const message = document.getElementById('message');
    const categoryContainer = document.getElementById('category-container');

    if (query === '') {
        message.textContent = 'Please enter the food name in the search bar';
        categoryContainer.innerHTML = '';
        return;
    }

    message.textContent = '';
    categoryContainer.style.display = 'flex';

    // Hide hero section classes
    document.querySelector('.hero-section').classList.add('hidden');
    document.querySelector('.input-group').classList.add('hidden');
    document.querySelector('.asol').classList.add('hidden');
    document.querySelector('.text01').classList.add('hidden');

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            if (!data.meals) {
                message.textContent = 'Sorry, another one was not found';
                categoryContainer.innerHTML = '';
                return;
            }
            displayMeals(data.meals);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayMeals(meals) {
    const categoryContainer = document.getElementById('category-container');
    categoryContainer.innerHTML = '';

    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'col-md-4 mb-4';

        mealCard.innerHTML = `
            <div class="card" onclick="fetchAndShowDetails('${meal.idMeal}', 'meal')">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p class="card-text">${meal.strInstructions.substring(0, 100)}...</p>
                </div>
            </div>
        `;

        categoryContainer.appendChild(mealCard);
    });
}

function resetHome() {
    document.querySelector('.hero-section').classList.remove('hidden');
    document.querySelector('.input-group').classList.remove('hidden');
    document.querySelector('.asol').classList.remove('hidden');
    document.querySelector('.text01').classList.remove('hidden');
    document.getElementById('category-container').innerHTML = '';
    document.getElementById('message').textContent = '';
}
