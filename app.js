let listType = document.getElementById("list-type-form");
let currentSelectionHeader = document.getElementById("current-selection-header");
let selectionDetailsContainer = document.getElementById("selection-details-container");
selectionDetailsContainer.style.width = "fit-content";

listType.onchange = function() {
    selectionDetailsContainer.innerHTML = "";
    let currentListType = document.querySelector("input[name='list-type']:checked").value;

    // Handle list of ingredients
    if (currentListType === "ingredient") {
        currentSelectionHeader.innerText = "List of Ingredients";
        let ingredientList = document.createElement("ul");
        fetch("http://thecocktaildb.com/api/json/v1/1/list.php?i=list")
            .then((response) => response.json())
            .then((data) => {
                for (let i = 0; i < data.drinks.length; i++) {
                    let ingredientListItem = document.createElement("li");
                    ingredientListItem.innerText = data.drinks[i].strIngredient1;
                    ingredientList.append(ingredientListItem);
                }
        });
        selectionDetailsContainer.append(ingredientList);
    }
    // Handle list of cocktails
    else if (currentListType === "cocktail") {
        currentSelectionHeader.innerText = "List of Cocktails";
        // List alcoholic cocktails
        let alcoholicCocktailTitle = document.createElement("h2");
        alcoholicCocktailTitle.innerText = "Alcoholic Drinks";
        selectionDetailsContainer.append(alcoholicCocktailTitle);
        let alcoholicCocktailList = document.createElement("ul");
        fetch("http://thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic")
            .then((response) => response.json())
            .then((data) => {
                for (let i = 0; i < data.drinks.length; i++) {
                    let alcoholicCocktailListItem = document.createElement("li");
                    alcoholicCocktailListItem.innerText = data.drinks[i].strDrink;
                    alcoholicCocktailList.append(alcoholicCocktailListItem);
                }
        });
        selectionDetailsContainer.append(alcoholicCocktailList);
          
        // List non-alcoholic cocktails
        let nonAlcoholicCocktailTitle = document.createElement("h2");
        nonAlcoholicCocktailTitle.innerText = "Non-Alcoholic Drinks";
        let nonAlcoholicCocktailList = document.createElement("ul");
        selectionDetailsContainer.append(nonAlcoholicCocktailTitle);
        fetch("http://thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic")
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.drinks.length; i++) {
                let nonAlcoholicCocktailListItem = document.createElement("li");
                nonAlcoholicCocktailListItem.innerText = data.drinks[i].strDrink;
                nonAlcoholicCocktailList.append(nonAlcoholicCocktailListItem);
            }
        });
        selectionDetailsContainer.append(nonAlcoholicCocktailList);
    
    // Nothing is selected
    }
    else {
        currentSelectionHeader.innerText = "Select an option"
    }
}