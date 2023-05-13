require("dotenv").config();
const db = require('./db');

const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;

// Get recipe data based on user's ingredients
const getRecipes = async (userId, pantry) => {
  rows = await db.executeSQL(`SELECT ingredient
                           FROM ingredients
                           WHERE userId = ?`,
    [userId]);
  let ingredientList = "";

  rows.forEach(ingredient => {
    ingredientList += `${ingredient.ingredient},`
  })
  ingredientList = ingredientList.slice(0, -1);

  const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${spoonacularApiKey}&number=5&ranking=1&ingredients=${ingredientList}&ignorePantry=${pantry}`);
  const json = await response.json();
  return json;
}

// Resolve the common name of items based on their product name
const resolveName = async (product) => {
  const settings = {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": `{"title":${product}}`
  };
  response = await fetch(`https://api.spoonacular.com/food/products/classify?apiKey=${spoonacularApiKey}`, settings);
  json = await response.json();
  return json.matched;
}

module.exports = {
  getRecipes: getRecipes,
  resolveName: resolveName
}