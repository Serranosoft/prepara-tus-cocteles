import React, { useCallback, useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import getCocktails from "../utils/cocktails";
import { getAsyncStorage } from "../utils/storage";
import { useFocusEffect } from "expo-router";
import { ui } from "../utils/styles";
import CocktailsListItem from "./cocktails-list-item";

export default function CocktailsList({ id }) {

    const [cocktails, setCocktails] = useState(getCocktails());
    const [doableQty, setDoableQty] = useState(null);
    const [fridge, setFridge] = useState();
    const [noCocktailsFound, setNoCocktailsFound] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getFridge();
        }, [])
    );

    // Encargado de renderizar cocktails.
    useEffect(() => {
        if (fridge) {
            id ? renderById(id) : render();
        }
    }, [fridge])

    async function getFridge() {
        let fridge = await getAsyncStorage();
        fridge = JSON.parse(fridge);
        setFridge(fridge);
    }

    async function render() {
        handleCocktails(cocktails);
    }

    async function renderById() {
        const result = cocktails.filter(cocktail => cocktail.ingredients.some(ingredient => ingredient == parseInt(id)));
        if (result.length > 0) {
            handleCocktails(result);
        } else {
            setNoCocktailsFound(true);
        }
    }    

    

    function handleCocktails(cocktails) {
        // Ordena los cócteles por coincidencia
        const cocktailsSorted = [...cocktails].sort((cocktail1, cocktail2) => {
            const coincidence1 = isDoable(cocktail1.ingredients).highlight;
            const coincidence2 = isDoable(cocktail2.ingredients).highlight;
            return coincidence2 - coincidence1;
        });

        cocktailsSorted.forEach(async cocktail => {
            const { coincidenceQty, highlight } = isDoable(cocktail.ingredients);
            cocktail.highlight = highlight
            cocktail.coincidenceQty = coincidenceQty
        });

        setCocktails([...cocktailsSorted]);
        setDoableQty(cocktailsSorted.filter(cocktail => cocktail.highlight === true).length);
    }


    function isDoable(ingredients) {
        const accomplish = Math.ceil(0.75 * ingredients.length);
        const coincidences = ingredients.filter(ingredient => fridge.includes(ingredient));
        return {
            coincidenceQty: coincidences.length || 0,
            highlight: coincidences.length >= accomplish,
        }
    }

    const renderItem = ({ item, index }) => <CocktailsListItem item={item} index={index} doableQty={doableQty} id={id} />

    return (
        noCocktailsFound ?
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={ui.muted}>No existen cócteles con este ingrediente</Text>
            </View>
            :
            <FlatList
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 8 }}
                data={cocktails}
                numColumns={1}
                initialNumToRender={10}
                renderItem={renderItem}
            />
    )
}