import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { FlatList } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import getCocktails from "../utils/cocktails";
import { StyleSheet } from "react-native";
import { getAsyncStorage } from "../utils/storage";
import { Link, useFocusEffect } from "expo-router";
import { ui } from "../utils/styles";
import Animated, { SlideInDown } from "react-native-reanimated";
import { TouchableOpacity } from "react-native";
import { getIngredientNameById } from "../utils/ingredients";
import CocktailsListItem from "./cocktails-list-item";

export default function CocktailsList({ id }) {

    const [cocktails, setCocktails] = useState(getCocktails());
    const [doableQty, setDoableQty] = useState(0);
    const [fridge, setFridge] = useState();
    const [noCocktailsFound, setNoCocktailsFound] = useState(false);

    // Obtener todos los ingredientes que tiene el usuario para saber cuál puede hacer
    useFocusEffect(
        useCallback(() => {
            getFridge();
        }, [])
    );

    // Eliminar todos los cocteles que no contengan el ingrediente con el id == id.
    useEffect(() => {
        if (id && fridge) {
            const result = cocktails.filter(cocktail => cocktail.ingredients.some(ingredient => ingredient === parseInt(id)));

            if (result.length > 0) {
                handleCocktails(result);
            } else {
                setNoCocktailsFound(true);
            }

        } else if (fridge) {
            handleCocktails(cocktails);
        }
    }, [fridge])

    async function getFridge() {
        let fridge = await getAsyncStorage();
        fridge = JSON.parse(fridge);
        setFridge(fridge);
    }

    function handleCocktails() {

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

        setCocktails(cocktailsSorted);
        setDoableQty(cocktailsSorted.filter(cocktail => cocktail.highlight === true).length);
    }


    function isDoable(ingredients) {
        const accomplish = Math.ceil(0.75 * ingredients.length);
        const coincidences = ingredients.filter(ingredient => fridge.includes(ingredient));

        return {
            coincidenceQty: coincidences.length,
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

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 16,
        paddingHorizontal: 12,
        gap: 16,
        borderBottomWidth: 1,
        borderColor: "#e8e8e8",

    },

    column: {
        gap: 8,
        alignItems: "flex-start",

    },

    imageWrapper: {
        width: 70,
        height: 70,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 100,
    },

    alert: {
        gap: 6,
        padding: 20,
        width: "100%",
        backgroundColor: "#cccccc",
        backgroundColor: "#337AB7",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 8,
        borderWidth: 3,
        borderColor: "#337AB7",
        backgroundColor: "rgba(51, 122, 183, 0.25)",
        alignSelf: "center",
    }

})