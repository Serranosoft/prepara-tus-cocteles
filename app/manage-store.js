import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Stack } from "expo-router";
import getIngredients from "../src/utils/ingredients";
import { getAsyncStorage, setAsyncStorage, } from "../src/utils/storage";
// import { Image } from "expo-image";
import { ui } from "../src/utils/styles";

export default function ManageStore() {

    // Array con los ingredientes actualizados
    const [ingredients, setIngredients] = useState(getIngredients());
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
        console.log(new Date());
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


    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Gestiona tus ingredientes" }} />
            {!loading &&
                <View style={styles.list}>
                    <FlatList
                        data={ingredients}
                        extraData={ingredients}
                        renderItem={
                            ({ item, index }) => {
                                return (
                                    <View key={item.id} style={styles.row}>
                                        <View style={styles.item}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: item.img }}
                                            />
                                            <Text style={ui.text}>{item.name}</Text>
                                        </View>
                                        <Pressable style={{ borderWidth: 1, borderColor: "black", width: 30, height: 30, }} onPress={() => handleIngredient(index)}>
                                            {item.selected &&
                                                <Image style={{ display: item.selected ? "flex" : "none", width: "100%", height: "100%" }} source={require("../assets/tick.png")} />
                                            }
                                        </Pressable>
                                    </View>
                                )
                            }}
                    />

                </View>
            }

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 32,
        gap: 16
    },

    list: {
        flex: 1,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        marginVertical: 8,
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    checkbox: {
        width: 25,
        height: 25,
    },

    image: {
        width: 50,
        height: 50,
    }

})