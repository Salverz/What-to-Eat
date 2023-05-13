const express = require('express');
const router = express.Router();
const spoonacularAPI = require('../utils/spoonacularAPI');

router.get('/', async (req, res) => {
    const recipes = await spoonacularAPI.getRecipes(req.session.user.id, false);
    const recipeData = recipes.map(recipe => {
        return {
            title: recipe.title,
            image: recipe.image,
            likes: recipe.likes,
            usedIngredients: recipe.usedIngredients,
            missedIngredients: recipe.missedIngredients
        }
    });

    res.render('recipes', { recipes: recipeData });
});

router.get('/prices', async (req, res) => {
    // this endpoint calls the API once, then saves result in a session and returns to the client
    // If the desired product is already in the session, just return that instead
    
});

module.exports = router;