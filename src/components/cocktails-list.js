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

export default function CocktailsList({ id }) {

    const [cocktails, setCocktails] = useState(getCocktails());
    const [doableQty, setDoableQty] = useState(0);
    const [fridge, setFridge] = useState();

    // Obtener todos los ingredientes que tiene el usuario para saber cuál puede hacer
    useFocusEffect(
        useCallback(() => {
            getFridge();
        }, [])
    );

    // Eliminar todos los cocteles que no contengan el ingrediente con el id == id.
    useEffect(() => {
        if (id && fridge) {
            const result = cocktails.filter(cocktail => cocktail.ingredients.some(ingredient => ingredient.id === parseInt(id)));
            result.length > 0 && handleCocktails(result);
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
        if (!fridge) {
            return
        }

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
        const coincidences = ingredients.filter(ingredient => fridge.includes(ingredient.id));

        return {
            coincidenceQty: coincidences.length,
            highlight: coincidences.length >= accomplish,
        }
    }


    const renderItem = ({ item, index }) => (
        <Animated.View key={item.id} entering={SlideInDown.duration(850).delay(index * 50)}>
            <Link asChild key={item.id} href={{ pathname: "/cocktail-detail", params: { id: item.id, name: item.name, img: item.img, steps: item.steps } }}>
                <TouchableOpacity>
                    <View style={[styles.row, { borderBottomWidth: index + 1 === doableQty ? 0 : 1 }]}>
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
                            <Text style={[ui.muted, { width: 270 }]} numberOfLines={2}>
                                {item.ingredients.map((ingr, index) => (
                                    <React.Fragment key={index}>
                                        {ingr.name}{index < item.ingredients.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                ))}
                            </Text>
                            {
                                item.highlight ?
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                        <View style={{ width: 17, height: 17, backgroundColor: "#3DB36E", borderRadius: 100 }}></View>
                                        <Text><Text style={{ fontWeight: "bold" }}>{item.coincidenceQty}/{item.ingredients.length}</Text> ingredientes</Text>
                                    </View>
                                    :
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                        <View style={{ width: 17, height: 17, backgroundColor: "#EECA5D", borderRadius: 100 }}></View>
                                        <Text><Text style={{ fontWeight: "bold" }}>{item.coincidenceQty}/{item.ingredients.length}</Text> ingredientes</Text>
                                    </View>

                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </Link >
            {
                !id && (index + 1) === doableQty &&
                <View style={styles.alert}>
                    <Text style={[ui.text, { textAlign: "center", maxWidth: 320 }]}>Necesitas mas ingredientes para los cócteles indicados a continuación</Text>
                    <MaterialCommunityIcons name="emoticon-sad-outline" size={30} color="#000" />
                </View>
            }
        </Animated.View>
    )

    return (
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