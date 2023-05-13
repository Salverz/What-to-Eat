// Add ingredient button
document.querySelector("#ingredient-add-button").addEventListener("click", addIngredient);
// Remove ingredient button
const buttons = document.querySelectorAll(".remove-button");
buttons.forEach(function(button) {
    button.addEventListener('click', removeIngredient);
});

// document.querySelector("#pantry").addEventListener("click", togglePantry);

// // ON INIT
// // Set the checked value based on the current session value of pantry
// initPantry();
// async function initPantry() {
//     const pantry = await fetch("/pantry");
//     const json = await pantry.json()
//     document.querySelector("#pantry").checked = json.checked;
// }


// Remove an ingredient to the database and then remove it from the page
async function removeIngredient() {
    const ingredientName = this.getAttribute('data-ingredient');

    const response = await fetch('/ingredients/remove', {
        method:"POST",
        body: JSON.stringify({"ingredient":ingredientName}),
        headers: {
            "Content-Type":"application/json"
        }
    });
    const json = await response.json();

    // If ingredient is successfully removed, remove the ingredient from the page
    if (json.success) {
        const ingredientElement = document.querySelector(`#${ingredientName}`);
        ingredientElement.remove();
    }
}

// Add ingredient to the database and then add it to the page
async function addIngredient() {
    const ingredientName = document.querySelector("#ingredient-input").value;
    const response = await fetch('/ingredients/add',
    {
        method:"POST",
        body: JSON.stringify({"ingredient":ingredientName}),
        headers: {
            "Content-Type":"application/json"
        }
    });
    const json = await response.json();

    // Item successfully added to database
    if (json.success) {
        document.querySelector("#ingredient-list").innerHTML +=
        `<li id="${ingredientName}>">
            <button class="remove-button" data-ingredient="${ingredientName}">Remove</button>
            ${ingredientName}
        </li>`;

        // Add event listeners to remove button
        const buttons = document.querySelectorAll(".remove-button");
        buttons.forEach(function(button) {
            button.addEventListener('click', removeIngredient);
        });
        document.querySelector("#ingredient-input").value = "";
    }
}

// Toggle ignore pantry items setting
async function togglePantry() {
    const pantryChecked = document.querySelector("#pantry").checked;
    console.log(pantryChecked);

    fetch('/pantry',
    {
        method:"POST",
        body: JSON.stringify({"pantry":pantryChecked}),
        headers: {
            "Content-Type":"application/json"
        }
    });
    
}