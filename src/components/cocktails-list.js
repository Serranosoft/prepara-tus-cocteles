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
import Animated, { SlideInDown, withSpring } from "react-native-reanimated";
import { SharedTransition } from 'react-native-reanimated';
import { TouchableOpacity } from "react-native";

const colors = ["#EDB285", "#BED09D", "#ECD7B1", "#E6A7A8", "#EAD875", "#DCECF5", "#65d0be"]
export default function CocktailsList({ id }) {

    const [cocktails, setCocktails] = useState(getCocktails());
    const [cocktailsHighlighted, setCocktailsHighlighted] = useState(0);
    const [store, setStore] = useState();

    // Obtener todos los ingredientes que tiene el usuario para saber cuál puede hacer
    useFocusEffect(
        useCallback(() => {
            fetchStore();
        }, [])
    );

    // Eliminar todos los cocteles que no contengan el ingrediente con el id == id.
    useEffect(() => {
        if (id && store) {
            const result = cocktails.filter(cocktail => cocktail.ingredients.some(ingredient => ingredient.id === parseInt(id)));
            result.length > 0 && sortCocktails(result);
        } else if (store) {
            sortCocktails(cocktails);
        }
    }, [store])


    function sortCocktails(cocktails) {
        if (store) {

            // Ordena los cócteles por coincidencia
            const cocktailsSorted = [...cocktails].sort((cocktail1, cocktail2) => {
                const coincidence1 = coincidence(cocktail1.ingredients);
                const coincidence2 = coincidence(cocktail2.ingredients);
                return coincidence2 - coincidence1;
            });

            // Agregamos una nueva propiedad a los cócteles
            cocktailsSorted.forEach(cocktail => {
                cocktail.highlight = coincidence(cocktail.ingredients);
            });

            const cocktailsHighlighted = cocktailsSorted.filter(obj => obj.highlight === true);
            setCocktailsHighlighted(cocktailsHighlighted.length);
            setCocktails(cocktailsSorted);
        }
    }

    function coincidence(ingredients) {
        const coincidencePoints = Math.ceil(0.75 * ingredients.length);
        const storeParsed = JSON.parse(store);

        const coincidences = ingredients.filter(ingredient =>
            storeParsed.includes(ingredient.id)
        );

        return coincidences.length >= coincidencePoints;
    }

    async function fetchStore() {
        let result = await getAsyncStorage();
        setStore(result);
    }

    function generateRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    const renderItem = ({ item, index }) => (
        <Animated.View entering={SlideInDown.duration(850).delay(index * 50)}>
            <Link asChild key={item.id} href={{ pathname: "/cocktail-detail", params: { id: item.id, name: item.name, img: item.img } }}>
                <TouchableOpacity key={item.id + 2}>
                    <View style={item.highlight ? [styles.row, { backgroundColor: generateRandomColor() }] : [styles.row, styles.noHighlighted]}>
                        <View style={styles.content}>

                            <View>
                                <Text style={ui.h4}>{item.name}</Text>
                                <Text style={[ui.muted, { width: 245, color: "black" }]} numberOfLines={1}>
                                    {item.ingredients.map((ingr, index) => (
                                        <React.Fragment key={index}>
                                            {ingr.name}{index < item.ingredients.length - 1 ? ', ' : ''}
                                        </React.Fragment>
                                    ))}
                                </Text>
                            </View>

                            <Image
                                style={styles.image}
                                source={{ uri: item.img }}
                                placeholder={'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['}
                                transition={1000}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Link >
            {
                !id && (index + 1) === cocktailsHighlighted &&
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