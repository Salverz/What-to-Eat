const express = require('express');
const router = express.Router();
const spoonacularAPI = require('../utils/spoonacularAPI');
const krogerAPI = require('../utils/krogerAPI');
const categoriesToAisles = require('../utils/categories.json');

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
    let aisles = ["Milk, Eggs, Other Dairy"]; // req.query.aisles
    // this endpoint calls the API once, then saves result in a session and returns to the client
    // If the desired product is already in the session, just return that instead
    if (!(req.query.ingredientName in req.session.data.productData)) {
        console.log(req.query.ingredientName +" doesn't exist");
        fullProductList = [];
        let start = -49;
        do {
            start += 50;
            start = (start == 251) ? 250 : start;
            console.log("Getting ingredients " + start + " to " + (start + 50));
            const products = await krogerAPI.getProducts(req.query.ingredientName, req.session.user.location, start);
            fullProductList.push(...createProductObjects(products, aisles));
            if (products.meta && start + 50 > products.meta.pagination.total) {
                break;
            }
        } while (start != 250);
        req.session.data.productData[req.query.ingredientName] = fullProductList;
    }

    res.json({
        products: req.session.data.productData[req.query.ingredientName]
    });
});

// Take in an API response and return a formatted list of products
function createProductObjects(productData, aisles) {
    let productList = []
    for (let i = 0; i < productData.data.length; i++) {
        const product = productData.data[i];
        if (!product.items[0].price) {
            console.log("no price");
            continue;
        }

        let categoriesMatch;
        aisles.forEach(aisle => {
            const correspondingCategories = categoriesToAisles[aisle];
            categoriesMatch = correspondingCategories.some(category => product.categories.includes(category));
        });
        if (!categoriesMatch) {
            console.log(`aisles ${aisles} do not match ${product.categories}`);
            continue;
        }

        const frontImage = product.images.find(image => image.perspective == "front");
        const sizeOrder = ["xlarge", "large", "medium", "small", "thumbnail"];
        const imageUrl = sizeOrder.reduce((prev, curr) => prev || frontImage.sizes.find(size => size.size === curr)?.url, "");
        productList.push({
            name: product.description,
            categories: product.categories,
            price: product.items[0].price.regular,
            size: product.items.size,
            image: imageUrl
        });
    }
    return productList;
}

module.exports = router;