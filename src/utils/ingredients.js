import data from "../../ingredients.json";

export function getIngredients() {
    return data.ingredients;
}

export function getIngredientNameById(id) {
    return data.ingredients.find(ingredient => ingredient.id === id).name;
}