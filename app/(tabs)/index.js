import { useCallback, useState, } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { getAsyncStorage } from '../../src/utils/storage';
import { ui } from "../../src/utils/styles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import IngredientsList from '../../src/components/ingredients-list';
import getCocktails from '../../src/utils/cocktails';

export default function Root() {

    const [fridgeQty, setFridgeQty] = useState(0);
    const [cocktailQty, setCocktailQty] = useState(0);

    useFocusEffect(
        useCallback(() => {
            getFridgeQty();
            getCocktailQty();
        }, [])
    );
    
    async function getFridgeQty() {
        let fridge = await getAsyncStorage();
        if (fridge) {
            fridge = JSON.parse(fridge);
            setFridgeQty(fridge.length);
        } else {
            setFridgeQty(0)
        }
    }

    async function getCocktailQty() {
        const cocktails = getCocktails();
        let qty = 0;
        let fridge = await getAsyncStorage();
        fridge = JSON.parse(fridge);
        if (fridge) {
            cocktails.forEach(cocktail => {
                const { highlight } = isDoable(cocktail.ingredients, fridge);
                if (highlight) qty++;
            });
        }
        setCocktailQty(qty)
        
    }

    function isDoable(ingredients, fridge) {
        const accomplish = Math.ceil(0.75 * ingredients.length);
        const coincidences = ingredients.filter(ingredient => fridge.includes(ingredient));
        return {
            coincidenceQty: coincidences.length || 0,
            highlight: coincidences.length >= accomplish,
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 16, gap: 16 }}>
                <Text style={ui.h3}>Añade ingredientes a tu nevera para sugerirte cócteles</Text>
                <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", gap: 8 }}>
                    <Text style={[ui.text, ui.highlight,  { backgroundColor: "#BBCB4B" } ]}>Tienes {fridgeQty} ingredientes</Text>
                    <Text style={[ui.text, ui.highlight, { backgroundColor: "#FFBC47" } ]}>Puedes hacer {cocktailQty} cócteles</Text>
                </View>
            </View>
            <View style={ui.list}>
                <IngredientsList />
            </View>

            <Link asChild href="/manage-store">
                <Pressable style={ui.button}>
                    <MaterialCommunityIcons name="basket-plus-outline" size={30} color="black" />
                </Pressable>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#fff",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginVertical: 14,
    },

    info: {
        gap: 4,
        justifyContent: "center",
    }

})