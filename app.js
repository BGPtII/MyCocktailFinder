let listTypeForm = document.getElementById("list-type-form");
let currentSelectionHeader = document.getElementById("current-selection-header");
let selectionDetailsContainer = document.getElementById("selection-details-container");
let selectedItemContainer = document.getElementById("selected-item-container");

listTypeForm.onchange = function() {
    selectionDetailsContainer.innerHTML = "";
    let currentListType = document.querySelector("input[name='list-type']:checked").value;

    // Handle list of ingredients
    if (currentListType === "ingredient") {
        currentSelectionHeader.innerText = "List of Ingredients";
        let ingredientList = document.createElement("ul");
        fetch("http://thecocktaildb.com/api/json/v1/1/list.php?i=list")
            .then((response) => response.json())
            .then((data) => {
                // Display list of ingredients
                for (let i = 0; i < data.drinks.length; i++) {
                    let ingredientListItem = document.createElement("li");
                    ingredientListItem.innerText = data.drinks[i].strIngredient1;
                    ingredientListItem.style.width = "fit-content";
                    // Handle ingredient information
                    ingredientListItem.addEventListener("mouseover", (event) => {
                        ingredientListItem.style.textDecoration = "underline";
                        ingredientListItem.style.cursor = "pointer";
                    });
                    ingredientListItem.addEventListener("mouseout", (event) => {
                        ingredientListItem.style.textDecoration = "none";
                        ingredientListItem.style.cursor = "none";
                    });
                    ingredientListItem.addEventListener("click", (event) => {
                        selectedItemContainer.innerHTML = "";
                        fetch("http://thecocktaildb.com/api/json/v1/1/search.php?i=" + ingredientListItem.innerText)
                            .then((response) => response.json())
                            .then((data) => {
                                let selectedItemHeader = document.createElement("h2");
                                selectedItemHeader.innerText = ingredientListItem.innerText;
                                selectedItemContainer.append(selectedItemHeader);
                                let selectedItemDescription = document.createElement("p");
                                selectedItemDescription.innerText = data.ingredients[0].strDescription;
                                selectedItemContainer.append(selectedItemDescription);
                        });
                    });
                    ingredientList.append(ingredientListItem);
                }
        });
        selectionDetailsContainer.append(ingredientList);
        selectionDetailsContainer.style.borderRight = "3px solid black";
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
    }
}