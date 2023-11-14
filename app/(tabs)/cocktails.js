import { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import getCocktails from "../../src/utils/cocktails";
import { StyleSheet } from "react-native";
import { ui } from "../../src/utils/styles";
import { FlatList } from "react-native";
import { Image } from "expo-image";
import React from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getAsyncStorage } from "../../src/utils/storage";
import { Pressable } from "react-native";
import { Link, useFocusEffect } from "expo-router";


const colors = ["#EDB285", "#BED09D", "#ECD7B1", "#E6A7A8", "#EAD875", "#DCECF5", "#65d0be"]
export default function Cocktails() {

    const [cocktails, setCocktails] = useState(getCocktails());
    const [cocktailsHighlighted, setCocktailsHighlighted] = useState(getCocktails());
    const [store, setStore] = useState();


    // Obtener todos los ingredientes que tiene el usuario
    useFocusEffect(
        useCallback(() => {
            console.log("fetch store");
            fetchStore();
        }, [])
    );

    // Ordenar los cocteles
    useEffect(() => sortCocktails(), [store]);


    function sortCocktails() {
        if (store) {
            const cocktailsSorted = [...cocktails].sort((cocktail1, cocktail2) => {
                const coincidence1 = calculateCoincidence(cocktail1.ingredients);
                const coincidence2 = calculateCoincidence(cocktail2.ingredients);
                return coincidence2 - coincidence1;
            });

            cocktailsSorted.forEach(cocktail => {
                cocktail.highlight = calculateCoincidence(cocktail.ingredients);

            });
            const objetosDestacados = cocktailsSorted.filter(obj => obj.highlight === true);
            console.log(objetosDestacados.length);
            setCocktailsHighlighted(objetosDestacados.length);
            setCocktails(cocktailsSorted);
        }
    }

    async function fetchStore() {
        let result = await getAsyncStorage();
        console.log(result);
        setStore(result);
    }

    function calculateCoincidence(cocktailIngredients) {
        const totalIngredientes = cocktailIngredients.length;
        const coincidenciaNecesaria = Math.ceil(0.75 * totalIngredientes);

        const coincidencias = cocktailIngredients.filter(ingrediente =>
            JSON.parse(store).includes(ingrediente.id)
        );

        return coincidencias.length >= coincidenciaNecesaria;
    }

    function generateRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }


    const renderItem = ({ item, index }) => (
        <View key={item.id} style={styles.list}>

            <View style={item.highlight ? [styles.row, { backgroundColor: generateRandomColor() }] : [styles.row, styles.noHighlighted]}>
                <View style={styles.content}>


                    <View>
                        <Text style={ui.h4}>{item.name}</Text>
                        <Text style={[ui.muted, { width: 245 }]} numberOfLines={1}>
                            {item.ingredients.map((ingr, index) => (
                                <React.Fragment key={index}>
                                    {ingr.name}{index < item.ingredients.length - 1 ? ', ' : ''}
                                </React.Fragment>
                            ))}
                        </Text>
                    </View>

                    <Image
                        style={styles.image}
                        source={item.img}
                        placeholder={'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['}
                        transition={1000}
                    />
                </View>
            </View>
            {
                (index + 1) === cocktailsHighlighted &&
                <View style={styles.alert}>
                    <Text style={[ui.text, { textAlign: "center", maxWidth: 320 }]}>Necesitas mas ingredientes para los cócteles indicados a continuación</Text>
                    <MaterialCommunityIcons name="emoticon-sad-outline" size={30} color="#000" />
                </View>
            }
        </View>
    )

    return (
        <View style={styles.container}>
            {cocktails && cocktails.length > 0 && store &&
                <View style={styles.list}>
                    <FlatList
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingVertical: 8 }}
                        data={cocktails}
                        numColumns={1}
                        initialNumToRender={10}
                        renderItem={renderItem}
                    />
                </View>

            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: "#fff"
    },

    list: {
        flex: 1,

    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
        marginHorizontal: 8,
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 8,
        justifyContent: "space-between",
        borderRadius: 16,

    },

    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        flex: 1,
    },

    ingredients: {
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
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
        alignItems: "center",
        marginTop: 8,
        marginBottom: 24

    },

    noHighlighted: {
        borderTopWidth: 1,
        borderColor: "#cccccc",
        marginTop: 0,
        marginBottom: 8,
        paddingVertical: 16,
        paddingTop: 16,
        paddingBottom: 8,
    }

})