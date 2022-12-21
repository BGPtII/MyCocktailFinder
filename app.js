let listType = document.getElementById("list-type-form");
let currentSelectionList = document.getElementById("current-selection-list");
let currentSelectionHeader = document.getElementById("current-selection-header");

listType.onchange = function() {
    currentSelectionList.innerHTML = "";
    let currentListType = document.querySelector("input[name='list-type']:checked").value;

    // Handle list of ingredients
    if (currentListType === "ingredient") {
        currentSelectionHeader.innerText = "List of Ingredients";
        fetch("http://thecocktaildb.com/api/json/v1/1/list.php?i=list")
            .then((response) => response.json())
            .then((data) => {
                for (let i = 0; i < data.drinks.length; i++) {
                    let newIngredientListItem = document.createElement("li");
                    newIngredientListItem.innerText = data.drinks[i].strIngredient1;
                    currentSelectionList.append(newIngredientListItem);
                }
            });
    }

    // Handle list of cocktails
    else if (currentListType === "cocktail") {
        currentSelectionHeader.innerText = "List of Cocktails";
        // TO DO list alcoholic
        fetch("http://thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic")
            .then((response) => response.json())
            .then((data) => {
                for (let i = 0; i < data.drinks.length; i++) {
                    let newIngredientListItem = document.createElement("li");
                    newIngredientListItem.innerText = data.drinks[i].strDrink;
                    currentSelectionList.append(newIngredientListItem);
                }
            });
        
        //TO DO list non-alcoholic
        fetch("http://thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic")
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.drinks.length; i++) {
                let newIngredientListItem = document.createElement("li");
                newIngredientListItem.innerText = data.drinks[i].strDrink;
                currentSelectionList.append(newIngredientListItem);
            }
        });
    
    // Nothing is selected
    }
    else {
        currentSelectionHeader.innerText = "Nothing selected or available"
    }
}