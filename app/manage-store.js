import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Stack } from "expo-router";
import getIngredients from "../src/utils/ingredients";
import { getAsyncStorage, setAsyncStorage, } from "../src/utils/storage";
import { Image } from "expo-image";
import { ui } from "../src/utils/styles";
import getCocktails from "../src/utils/cocktails";

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
        <View key={item.id} style={styles.row}>
            <Link asChild href={{ pathname: "/ingredient-detail", params: { id: item.id, name: item.name, img: item.img } }}>
                <TouchableOpacity>
                    <View style={styles.item}>
                        <Image style={styles.image} source={{ uri: item.img }} />
                        <View style={styles.info}>
                            <Text style={ui.text}>{item.name}</Text>
                            {
                                renderQty(item.id) > 0 && <Text style={ui.muted}>Se usa en {renderQty(item.id)} cócteles</Text>
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
                <View style={[ui.list, ui.wrapper, { marginTop: 32 }]}>
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
        backgroundColor: "#fff"
    },
    
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 14,
        marginVertical: 14,
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

})