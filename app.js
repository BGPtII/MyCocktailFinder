function displayError() {
    clearResults();
    document.getElementById('error-message').style.display = 'block';
}

async function fetchData(url, typeSelected) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            switch (typeSelected) {
                case 'cocktailDetails':
                    const validData = {};
                    if (Array.isArray(data.drinks) && data.drinks !== null) {
                        return data.drinks.reduce((validData, drink) => {
                            Object.entries(drink).forEach(([key, value]) => {
                                if (value !== null) {
                                    validData[key] = value;
                                }
                            });
                            return validData;
                        }, {});
                    }
                    break;
                case 'filterOptions':
                    return (Array.isArray(data.drinks)) ? [].concat(...data.drinks.map(Object.values)) : false;
                case 'cocktailOptions':
                    return (Array.isArray(data.drinks)) ? data.drinks.map(drink => drink.strDrink) : false;
            }
        }
        return false;
    }
    catch (error) {
        displayError();
    }
}

function clearResults() {
    document.getElementById('rc-name').textContent = '';
    document.getElementById('rc-alcoholic').textContent = '';
    document.getElementById('rc-category').textContent = '';
    document.getElementById('rc-glass').textContent = '';
    document.getElementById('rc-ingredients').innerHTML = '';
    document.getElementById('rc-instructions').innerHTML = '';
    document.getElementById('result-picture').src = '';
    document.getElementById('error-message').style.display = 'none';
}

async function preloadImage(imageURL) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
            displayError();
        };
        img.src = imageURL;
    });
}

async function preloadAndSetImage(imageURL, targetElementId) {
    try {
        const preloadedImage = await preloadImage(imageURL);
        const targetElement = document.getElementById(targetElementId);
        targetElement.setAttribute('src', imageURL);
    } 
    catch (error) {
        displayError();
    }
}

async function displayResults(cocktail) {
    const resultPictureIMG = 'result-picture';
    try {
        await preloadAndSetImage(cocktail.strDrinkThumb, resultPictureIMG);

        const nameH2 = document.getElementById('rc-name');
        const alcoholicP = document.getElementById('rc-alcoholic');
        const categoryP = document.getElementById('rc-category');
        const glassP = document.getElementById('rc-glass');
        const ingredientsUL = document.getElementById('rc-ingredients');
        const instructionsOL = document.getElementById('rc-instructions');

        Array.from(document.getElementById('results')).forEach(child => {
            child.innerText = '';
        });
        ingredientsUL.innerHTML = '';
        instructionsOL.innerHTML = '';

        nameH2.innerText = cocktail.strDrink;
        alcoholicP.innerText = cocktail.strAlcoholic;
        categoryP.innerText = 'Category: ' + cocktail.strCategory;
        glassP.innerText = 'Glass type: ' + cocktail.strGlass;

        const instructions = cocktail.strInstructions.split('.').map(sentence => sentence.trim()).filter(Boolean);
        const measures = Object.entries(cocktail)
            .filter(([key, value]) => key.startsWith('strMeasure') && value !== null && value !== '')
            .map(([key, value]) => value);
        const ingredients = Object.entries(cocktail)
            .filter(([key, value]) => key.startsWith('strIngredient') && value !== null && value !== '')
            .map(([key, value]) => value);

        const ingredientsFragment = document.createDocumentFragment();
        for (let i = 0; i < measures.length; i++) {
            const measure = measures[i];
            const ingredient = ingredients[i];
            const listItem = document.createElement('li');
            listItem.textContent = `${measure || ''}: ${ingredient || ''}`.trim();
            ingredientsFragment.appendChild(listItem);
        }
        ingredientsUL.appendChild(ingredientsFragment);

        const instructionsFragment = document.createDocumentFragment();
        for (let i = 0; i < instructions.length; i++) {
            const instruction = document.createElement('li');
            instruction.textContent = instructions[i];
            instructionsFragment.appendChild(instruction);
        }
        instructionsOL.appendChild(instructionsFragment);
    } 
    catch (error) {
        displayError();
    }
}

function setUpAppropriateFunctionality(selection) {
    const randomButtonOption = document.getElementById('random-button-option');
    const filterCocktailOptionDiv = document.getElementById('filter-cocktail-option');
    const cocktailSearchOption = document.getElementById('cocktail-search-option');
    
    randomButtonOption.style.display = (selection === 'random') ? 'block' : 'none';
    filterCocktailOptionDiv.style.display = (selection === 'filter') ? 'block' : 'none';
    cocktailSearchOption.style.display = (selection === 'search') ? 'block' : 'none';

    document.getElementById('random-button-option').removeEventListener('click', randomButtonOptionClickHandler);
    document.getElementById('filter-categories').removeEventListener('change', filterCategorySelectHandler);
    document.getElementById('filter-options').removeEventListener('change', filterOptionSelectHandler);
    document.getElementById('cocktail-options').removeEventListener('change', filterCocktailOptionSelectHandler);
    document.getElementById('cocktail-search-option').removeEventListener('input', handleSearchInputChange);
    switch (selection) {
        case 'random':
            document.getElementById('random-button-option').addEventListener('click', randomButtonOptionClickHandler);
            break;
        case 'filter':
            document.getElementById('filter-categories').addEventListener('change', filterCategorySelectHandler);
            document.getElementById('filter-options').addEventListener('change', filterOptionSelectHandler);
            document.getElementById('cocktail-options').addEventListener('change', filterCocktailOptionSelectHandler);
            break;
        case 'search':
            document.getElementById('cocktail-search-option').addEventListener('input', handleSearchInputChange);
            break;
    }
}

async function randomButtonOptionClickHandler() {
    const randomCocktail = await fetchData('https://www.thecocktaildb.com/api/json/v1/1/random.php', 'cocktailDetails');
    displayResults(randomCocktail);
}

function handleRandomFunctionality() {
    document.getElementById('cocktail-search-option').value = '';
    setUpAppropriateFunctionality('random');
}

async function filterCategorySelectHandler(event) {
    const filterOptionsSelect = document.getElementById('filter-options');
    const cocktailOptionsSelect = document.getElementById('cocktail-options');

    clearResults();
    while (filterOptionsSelect.childElementCount > 1) {
        filterOptionsSelect.removeChild(filterOptionsSelect.lastChild);
    }
    filterOptionsSelect.selectedIndex = 0;
    while (cocktailOptionsSelect.childElementCount > 1) {
        cocktailOptionsSelect.removeChild(cocktailOptionsSelect.lastChild);
    }
    cocktailOptionsSelect.selectedIndex = 0;

    const filterCategoryURLPart = event.target.value;
    const filterOptions = await fetchData(`https://www.thecocktaildb.com/api/json/v1/1/list.php?${filterCategoryURLPart}=list`, 'filterOptions');
    filterOptions.forEach((option) => {
        const optionLI = document.createElement('option');
        optionLI.innerText = option;
        filterOptionsSelect.append(optionLI);
    });
}

async function filterOptionSelectHandler(event) {
    const cocktailOptionsSelect = document.getElementById('cocktail-options');

    clearResults();
    while (cocktailOptionsSelect.childElementCount > 1) {
        cocktailOptionsSelect.removeChild(cocktailOptionsSelect.lastChild);
    }
    cocktailOptionsSelect.selectedIndex = 0;

    const filterCategoryURLPart = document.getElementById('filter-categories').value;
    const filterOptionURLPart = event.target.value.replace(/ /g, "_");
    const cocktailOptions = await fetchData(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?${filterCategoryURLPart}=${filterOptionURLPart}`, 'cocktailOptions');
    cocktailOptions.forEach((option) => {
        const optionLI = document.createElement('option');
        optionLI.innerText = option;
        cocktailOptionsSelect.append(optionLI);
    });
}

async function filterCocktailOptionSelectHandler(event) {
    const selectedCocktailURLPart = event.target.value.replace(/ /g, "_");

    const selectedCocktailInfo = await fetchData(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${selectedCocktailURLPart}`, 'cocktailDetails');
    clearResults();
    displayResults(selectedCocktailInfo);
}

function handleFilterFunctionality() {
    setUpAppropriateFunctionality('filter');
}

async function handleSearchInputChange(event) {
    const cocktailSearchURLPart = event.target.value.trim().replace(/ +/g, '_');
    const cocktailSearchInfo = await fetchData(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailSearchURLPart}`, 'cocktailDetails');
    clearResults();
    if (cocktailSearchInfo) {
        displayResults(cocktailSearchInfo);
    }
}

function handleSearchFunctionality() {
    setUpAppropriateFunctionality('search');
}

async function handleFunctionality() {
    const specificationOptionChoiceDiv = document.getElementById('specification-option-choice');

    specificationOptionChoiceDiv.addEventListener('change', (event) => {
        const specificationOptionChoice = event.target.value;
        clearResults();
        switch (specificationOptionChoice) {
            case 'random-cocktail':
                handleRandomFunctionality();
                break;
            case 'filter-cocktail':
                handleFilterFunctionality();
                break;
            case 'search-cocktail':
                handleSearchFunctionality();
                break;
        }
    });
}

window.onload = handleFunctionality();