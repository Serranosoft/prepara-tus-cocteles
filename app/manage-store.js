import { FlatList, StyleSheet, Text, View } from "react-native";
import { ui } from "../src/utils/styles";
import { useEffect, useRef, useState } from "react";
import Checkbox from 'expo-checkbox';
import { Stack } from "expo-router";
import getIngredients from "../src/utils/ingredients";
import { getAsyncStorage, getAsyncStore, setAsyncStorage, setAsyncStore, } from "../src/utils/storage";
// import { Image } from "expo-image";
import { Pressable } from "react-native";
import { Image } from "react-native";

export default function ManageStore() {

    // Array con los ingredientes actualizados
    const [ingredients, setIngredients] = useState(getIngredients());
    const storage = useRef();

    // Al comenzar, obtiene el storage y mezcla el storage con los ingredientes, esto tan solo se hace una vez.
    useEffect(() => {
        shuffleStorage();
    }, []);

    async function shuffleStorage() {
        const result = await getAsyncStorage();
        const parsedResult = JSON.parse(result);
        storage.current = parsedResult;
        parsedResult.forEach(ingredient => updateIngredient(ingredient, true));
    }

    // Función que cambia la propiedad selected de un ingrediente a true o false.
    function updateIngredient(id, selected) {
        setIngredients((prevArray) => {
            return prevArray.map((obj) => {
                if (obj.id === id) {
                    return { ...obj, selected: selected };
                }
                return obj;
            });
        });
    }

    // Función que actualice el storage y de uso de la funcion updateIngredients para actualizar el state
    function handleIngredient(id) {

        if (storage.current.includes(id)) {
            updateIngredient(id, false);
            storage.current.splice(storage.current.indexOf(id), 1);
        } else {
            updateIngredient(id, true);
            storage.current.push(id);
        }
        setAsyncStorage(JSON.stringify(storage.current));
    }

    function hola() {
        console.log("hola");
    }

    const renderItem = ({ item }) => (
        <View key={item.id} style={styles.row}>
            <View style={styles.item}>
                <Image
                    style={styles.image}
                    source={{ uri: item.img}}
                />
                <Text style={ui.text}>{item.name}</Text>
            </View>
            <Pressable style={{ borderWidth: 1, borderColor: "black", width: 30, height: 30, }} onPress={() => handleIngredient(item.id)}>
                {item.selected &&
                    <Image style={{ display: item.selected ? "flex" : "none", width: "100%", height: "100%"}} source={require("../assets/tick.png")} />
                }
            </Pressable>
        </View>
    )

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Gestiona tus ingredientes" }} />
            {ingredients && ingredients.length > 0 &&
                <View style={styles.list}>
                    <FlatList
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingVertical: 8 }}
                        data={ingredients}
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