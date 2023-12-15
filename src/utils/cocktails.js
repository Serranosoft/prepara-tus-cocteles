import data from "../../cocktails.json";
import { getIngredients } from "./ingredients";

export default function getCocktails() {
    return data.cocktails;
}

export function getCocktailsQtyByIngredient(id) {

    const cocktails = getCocktails();

    let incremental = 0;
    for (let i = 0; i < cocktails.length; i++) {
        for (let j = 0; j < cocktails[i].ingredients.length; j++) {
            if (cocktails[i].ingredients[j] === id) {
                incremental++;
            }
        }
    }

    return incremental;
}

export function getIngredientsIdsFromCocktail(id) {
    const cocktails = getCocktails();
    const cocktail = cocktails.find(cocktail => cocktail.id.toString() === id);
    return cocktail.ingredients;
}

export function getIngredientDataFromId(id) {
    const ingredients = getIngredients();
    const ingredient = ingredients.find(ingredient => ingredient.id === id);
    return ingredient;
}