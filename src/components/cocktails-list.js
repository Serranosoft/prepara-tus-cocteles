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

    const [cocktails, setCocktails] = useState([]);
    const [doableQty, setDoableQty] = useState(null);
    const [fridge, setFridge] = useState();
    const [noCocktailsFound, setNoCocktailsFound] = useState(false);
    const [flag, setFlag] = useState(true);

    useFocusEffect(
        useCallback(() => {
            // Llamará siempre que haga focus.
            // Comprobar si hay cambios en el asyncStorage, es decir, si fridge es diferente a lo que hay en asyncStorage.
            checkChanges
        }, [])
    );


    async function checkChanges() {
        if (fridge) {
            let currentIngredients = await getAsyncStorage();
            let parsed = JSON.parse(currentIngredients);
            if (fridge !== parsed) {
                // Hay cambios, hay que re-renderizar
            } else {
                // No hay cambios, no hay que re-renderizar
            }
        }
    }

    async function test() {
        let fridge = await getAsyncStorage();
        let parsed = JSON.parse(fridge);
        console.log(parsed);
        return parsed;
    }





















    // Obtener todos los ingredientes que tiene el usuario para saber cuál puede hacer
    /* useFocusEffect(
        useCallback(() => {
            // setFlag(true);
            getAllCocktails();
        }, [])
    ); */

    async function getAllCocktails() {
        setCocktails(getCocktails());
    }

    useEffect(() => {
        if (cocktails && cocktails.length > 0 && flag) {
            getFridge();
        }
    }, [cocktails])

    async function getFridge() {
        // setFlag(false);
        let fridge = await getAsyncStorage();
        fridge = JSON.parse(fridge);
        setFridge(fridge);
    }


    // Eliminar todos los cocteles que no contengan el ingrediente con el id == id.
    useEffect(() => {
        if (id && fridge) {
            const result = cocktails.filter(cocktail => cocktail.ingredients.some(ingredient => ingredient == parseInt(id)));
            if (result.length > 0) {
                handleCocktails(result);
            } else {
                setNoCocktailsFound(true);
            }

        } else if (fridge) {
            handleCocktails(cocktails);
        }
    }, [fridge])

    function handleCocktails(cocktails) {
        console.log("Handle cocktails");
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