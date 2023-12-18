import { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { getIngredients } from "../utils/ingredients";
import { getAsyncStorage } from "../utils/storage";
import { getIngredientDataFromId, getIngredientsIdsFromCocktail } from "../utils/cocktails";
import IngredientListItem from "./ingredient-list-item";
import { useFocusEffect } from "expo-router";

export default function IngredientsList({ id }) {

    const [ingredients, setIngredients] = useState(getIngredients());
    const [fridge, setFridge] = useState();

    useFocusEffect(
        useCallback(() => {
            getFridge();
        }, [])
    );

    async function getFridge() {
        let fridge = await getAsyncStorage();
        fridge = JSON.parse(fridge);
        setFridge(fridge);
    }
    
    useEffect(() => {
        handleIngredients();
    }, [fridge])
    
    async function handleIngredients() {
        let ingredientsAux = [];

        // Si recibo un id entonces debo modificar ingredientsAux para poner en selected aquellos que ya tengo en mi nevera.
        if (id) {
            const ingredientsIds = getIngredientsIdsFromCocktail(id);
            ingredientsIds.forEach(id => {
                ingredientsAux.push(getIngredientDataFromId(id));
            })

            if (fridge) {
                // Si hay fridge, debo recorrer todo el fridge y el que coincida con ingredientsAux debo ponerlo como selected.
                const coincidences = ingredientsAux.filter(ingredient => fridge.includes(ingredient.id));
                for (let coincidence of coincidences) {
                    ingredientsAux[ingredientsAux.indexOf(coincidence)].selected = true;
                }
            }

        } else {
            for (let ingr of fridge) {
                ingredientsAux.push(getIngredientDataFromId(ingr));
            }
        }

        setIngredients(ingredientsAux)
    }

    const renderItem = ({ item, index }) => <IngredientListItem item={item} index={index} showTick={id ? true : false} />

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