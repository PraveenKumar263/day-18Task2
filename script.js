// create div element with class
function createDivElement(classname) {
    let ele = document.createElement("div");
    ele.className = classname;
    return ele;
}

// get data from api
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } 
    catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// show food cuisines as category
async function displayCategories() {
    const categoriesDiv = document.getElementById('categories');

    const categories = await fetchData('https://www.themealdb.com/api/json/v1/1/categories.php');
    if (!categories || !categories.categories || categories.categories.length === 0) {
        categoriesDiv.textContent = 'No categories found.';
        return;
    }

    // display each category
    categories.categories.forEach(category => {
        const categoryCol = document.createElement('div');
        categoryCol.classList.add('card', 'text-center', 'mb-3');
        categoryCol.innerHTML = `
            <div class="card-body">
                <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="card-img-top rounded-circle">
                <h5 class="card-title">${category.strCategory}</h5>
            </div>
        `;
        categoryCol.addEventListener('click', () => displayRandomMeal(category.strCategory));
        categoriesDiv.appendChild(categoryCol);
    });
}
 // generate the meal randomly of given category
 async function displayRandomMeal(category) {
    const randomMealDiv = document.getElementById('random-meal');
    randomMealDiv.innerHTML = '';

    const randomMeal = await fetchData(`https://www.themealdb.com/api/json/v1/1/random.php?c=${category}`);
    if (!randomMeal || !randomMeal.meals || randomMeal.meals.length === 0) {
        randomMealDiv.textContent = 'No meals found for this category.';
        return;
    }

    const meal = randomMeal.meals[0];
    const mealCard = document.createElement('div');
    mealCard.classList.add('card', 'text-center', 'mt-3');
    mealCard.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
            <p class="card-text">${meal.strInstructions}</p>
            <button onclick="closeCard()" class="btn btn-danger mr-2">Close</button>
            <button onclick="printCard()" class="btn btn-primary">Print</button>
        </div>
    `;
    randomMealDiv.appendChild(mealCard);
}

// function to close the card
function closeCard() {
    const randomMealDiv = document.getElementById('random-meal');
    if (randomMealDiv) {
        randomMealDiv.innerHTML = '';
    }
}

// function to print the card content
function printCard() {
    window.print();
}
// wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Basic element setup
    const container = createDivElement("container marketing mt-3");
    const row = createDivElement("row");
    
    const titleDiv = createDivElement("title col-md-12");
    titleDiv.innerHTML = `
        <h1>Random Meal Generator</h1>
        <p>Choose a cuisine</p>
    `;

    const cuisinesDiv = createDivElement("col-md-4");
    cuisinesDiv.id = "categories";
    const randomMealDiv = createDivElement("col-md-8");
    randomMealDiv.id = "random-meal";

    row.append(titleDiv, cuisinesDiv, randomMealDiv);
    container.appendChild(row);
    document.body.appendChild(container);

    displayCategories();
});
