let listType = document.getElementById("list-type-form");
let currentSelectionList = document.getElementById("current-selection-list");
let currentSelectionHeader = document.getElementById("current-selection-header");

listType.onchange = function() {
    currentSelectionList.innerHTML = "";
    let currentListType = document.querySelector("input[name='list-type']:checked").value;

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
    else if (currentListType === "cocktail") {
        currentSelectionHeader.innerText = "List of Cocktails";
        let currentSelectionListSubHeader = document.createElement("h2");
        currentSelectionListSubHeader.innerText = "Alcoholic Cocktails";
        currentSelectionList.append(currentSelectionListSubHeader);
        fetch("http://thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                for (let i = 0; i < data.drinks.length; i++) {
                    let newIngredientListItem = document.createElement("li");
                    newIngredientListItem.innerText = data.drinks[i].strDrink;
                    currentSelectionList.append(newIngredientListItem);
                }
            });
        // currentSelectionListSubHeader.innerText = "Non-Alcoholic Cocktails";
        // currentSelectionList.append(currentSelectionListSubHeader);
        // fetch("http://thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic")
        // .then((response) => response.json())
        // .then((data) => {
        //     console.log(data);
        //     for (let i = 0; i < data.drinks.length; i++) {
        //         let newIngredientListItem = document.createElement("li");
        //         newIngredientListItem.innerText = data.drinks[i].strDrink;
        //         currentSelectionList.append(newIngredientListItem);
        //     }
        // });
    }
    else {
        console.log("nothing selected or available");
    }
}