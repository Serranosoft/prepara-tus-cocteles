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
import Animated, { SlideInDown } from "react-native-reanimated";

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


    const renderItem = ({ item, index }) => (
        <Animated.View key={item.id} entering={SlideInDown.duration(850).delay(index * 50)}>
            <Link asChild href={{ pathname: "/ingredient-detail", params: { id: item.id, name: item.name, img: item.img } }}>
                <TouchableOpacity>
                    <View style={styles.row}>
                        <View style={styles.imageWrapper}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.img }}
                                placeholder={'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['}
                                transition={1000}
                            />
                        </View>
                        <View style={styles.column}>
                            <Text style={ui.h4}>{item.name}</Text>
                            {
                                getCocktailsQtyByIngredient(item.id) > 0 && <Text style={ui.muted}>Puedes preparar {getCocktailsQtyByIngredient(item.id)} cócteles con esto</Text>
                            }

                        </View>
                    </View>
                </TouchableOpacity>
            </Link>
        </Animated.View>
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

})