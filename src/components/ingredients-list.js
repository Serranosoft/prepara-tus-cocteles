import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { getIngredients } from "../utils/ingredients";
import { getAsyncStorage } from "../utils/storage";
import { getIngredientDataFromId, getIngredientsFromCocktail, getIngredientsIdsFromCocktail } from "../utils/cocktails";
import IngredientListItem from "./ingredient-list-item";

export default function IngredientsList({ id }) {

    const [ingredients, setIngredients] = useState(getIngredients());

    useEffect(() => {
        if (ingredients) {
            handleIngredients();
        }
    }, [ingredients])

    async function handleIngredients() {
        let fridge = await getAsyncStorage();
        fridge = JSON.parse(fridge);


        // Si recibo id entonces tengo que saber los ingredientes del cocktail.id = id.
        if (id) {
            const ingredientsAux = [];
            const ingredientsIds = getIngredientsIdsFromCocktail(id);
            ingredientsIds.forEach(id => {
                ingredientsAux.push(getIngredientDataFromId(id));
            })

            console.log(ingredientsAux);

            if (fridge) {
                // Si hay fridge, debo recorrer todo el fridge y el que coincida con ingredientsAux debo ponerlo como selected.



                /* for (let i = 0; i < fridge.length; i++) {
                    let index = ingredients.findIndex(ingredient => ingredient.id === parseInt(fridge[i]));
                    if (index > -1) {
                        console.log(index);
                        ingredientsAux[index].selected = true;
                    }
                }
                setIngredients(ingredientsAux); */
            } else {
                if (fridge) {
                    const names = ingredients.filter(ingredient => fridge.includes(ingredient.id));
                    setIngredients(names);
                }
            }
        }


        /* if (id) {
            const ingredientsAux = getIngredientsFromCocktail(id);

            if (fridge) {
                for (let i = 0; i < fridge.length; i++) {
                    let index = ingredients.findIndex(ingredient => ingredient.id === parseInt(fridge[i]));
                    if (index > -1) {
                        ingredientsAux[index].selected = true;
                    }
                }
                setIngredients(ingredientsAux);
            }

        } else {
            if (fridge) {
                const names = ingredients.filter(ingredient => fridge.includes(ingredient.id));
                setIngredients(names);
            }
        } */
    }

    const renderItem = ({ item, index }) => <IngredientListItem item={item} index={index} />

    return (
        <View>
            <FlatList
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 8 }}
                data={ingredients}
                numColumns={1}
                initialNumToRender={10}
                renderItem={renderItem}
            />
        </View>
    )
}