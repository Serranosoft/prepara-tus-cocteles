import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Stack } from "expo-router";
import getIngredients from "../src/utils/ingredients";
import { getAsyncStorage, setAsyncStorage, } from "../src/utils/storage";
import { Image } from "expo-image";
import { ui } from "../src/utils/styles";
import getCocktails, { getCocktailsQtyByIngredient } from "../src/utils/cocktails";
import { StatusBar } from "react-native";

export default function ManageStore() {

    // Array con los ingredientes actualizados
    const [ingredients, setIngredients] = useState(getIngredients());
    const cocktails = useRef(getCocktails())

    const storage = useRef();
    const [loading, setLoading] = useState(true);

    // Al comenzar, obtiene el storage y mezcla el storage con los ingredientes, esto tan solo se hace una vez.
    useEffect(() => {
        shuffleStorage();
    }, []);

    async function shuffleStorage() {
        const result = await getAsyncStorage();
        const parsedResult = JSON.parse(result);
        storage.current = parsedResult;

        if (storage.current) {
            const newData = [...ingredients];
            parsedResult.map((ingredient) => {
                setIngredients(() => {
                    let index = newData.findIndex(item => item.id === ingredient);
                    newData[index].selected = true;
                    return newData;
                })
            })
        }
        setLoading(false);
    }

    function handleIngredient(index) {
        const newData = [...ingredients];
        newData[index].selected = !newData[index].selected;
        setIngredients(newData);

        const id = newData[index].id;
        updateStorage(id);
    }

    function updateStorage(id) {
        if (!storage.current) {
            storage.current = [];
            storage.current.push(id);
        } else {
            if (storage.current.includes(id)) {
                storage.current.splice(storage.current.indexOf(id), 1);
            } else {
                storage.current.push(id);
            }
        }
        setAsyncStorage(JSON.stringify(storage.current));
    }



    function renderQty(id) {
        let incremental = 0;
        for (let i = 0; i < cocktails.current.length; i++) {
            for (let j = 0; j < cocktails.current[i].ingredients.length; j++) {
                if (cocktails.current[i].ingredients[j].id === id) {
                    incremental++;
                }
            }
        }

        return incremental;
    }

    const renderItem = useCallback(({ item, index }) => (
        <View key={item.id} style={styles.row} >
            <Link asChild href={{ pathname: "/ingredient-detail", params: { id: item.id, name: item.name, img: item.img } }}>
                <TouchableOpacity>
                    <View style={[styles.row, { borderBottomWidth: 0, paddingVertical: 0, paddingHorizontal: 0}]}>
                        
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
                                getCocktailsQtyByIngredient(item.id) > 0 && <Text style={ui.muted}>Se usa en {getCocktailsQtyByIngredient(item.id)} cócteles</Text>
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.checkbox} onPress={() => handleIngredient(index)}>
                {item.selected &&
                    <Image style={[styles.checkboxImg, { display: item.selected ? "flex" : "none" }]} source={require("../assets/tick.png")} />
                }
            </TouchableOpacity>
        </View>
    ), [])

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Gestiona tus ingredientes", headerShown: true }} />
            {!loading &&
                <View style={ui.list}>
                    <FlatList data={ingredients} extraData={ingredients} renderItem={renderItem} keyExtractor={(item) => item.id} />
                </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#fff",
        paddingTop: StatusBar.currentHeight,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 12,
        gap: 16,
        borderBottomWidth: 1,
        borderColor: "#e8e8e8",

    },

    item: {
        flexDirection: "row",
        gap: 14,
    },

    info: {
        gap: 4,
        justifyContent: "center",
    },

    checkbox: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 100,
    },

    image: {
        width: 55,
        height: 55,
        borderRadius: 100,
    },

    checkboxImg: {
        width: "100%",
        height: "100%"
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