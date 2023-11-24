import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import getIngredients from "../utils/ingredients";
import { Text } from "react-native";
import { getAsyncStorage } from "../utils/storage";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { getCocktailsQtyByIngredient, getIngredientsFromCocktail } from "../utils/cocktails";
import { StyleSheet } from "react-native";
import { ui } from "../utils/styles";

export default function IngredientsList({ id }) {

    const [ingredients, setIngredients] = useState(getIngredients());

    useEffect(() => {
        handleIngredients();
    }, [])

    async function handleIngredients() {
        let fridge = await getAsyncStorage();
        fridge = JSON.parse(fridge);

        if (id) {
            const ingredientsAux = getIngredientsFromCocktail(id);           

            if (fridge) {
                for (let i = 0; i < fridge.length; i++) {
                    let index = ingredients.findIndex(ingredient => ingredient.id.toString() === fridge[i]);
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
        }
    }


    const renderItem = ({ item }) => (
        <Link asChild key={item.id} style={styles.row} href={{ pathname: "/ingredient-detail", params: { id: item.id, name: item.name, img: item.img } }}>
            <TouchableOpacity>
                <Image
                    style={styles.image}
                    source={item.img}
                    placeholder={'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['}
                    transition={1000}
                />
                <View style={styles.info}>
                    <Text style={ui.text}>{item.name}</Text>
                    {
                        getCocktailsQtyByIngredient(item.id) > 0 && <Text style={ui.muted}>Prepara {getCocktailsQtyByIngredient(item.id)} cócteles con esto</Text>
                    }
                </View>
            </TouchableOpacity>
        </Link>
    )

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#fff"
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
    },

    image: {
        width: 55,
        height: 55,
        borderRadius: 100,
    }

})