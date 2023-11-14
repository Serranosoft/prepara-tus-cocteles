import { FlatList, StyleSheet, Text, View } from "react-native";
import { ui } from "../src/utils/styles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "expo-router";
import getIngredients from "../src/utils/ingredients";
import { getAsyncStorage2, getAsyncStore, setAsyncStorage, setAsyncStore, } from "../src/utils/storage";
import { Image } from "expo-image";

export default function ManageStore() {

    // Array con los ingredientes actualizados
    const [ingredients, setIngredients] = useState(getIngredients());

    // Array con los ingredientes que debo agregar al AsyncStorage
    const [store, setStore] = useState([]);

    // Al comenzar, obtiene el storage y mezcla el storage con los ingredientes, esto tan solo se hace una vez.
    useEffect(() => {
        shuffleStorage();
    }, []);

    async function shuffleStorage() {
        const result = await getAsyncStorage2();
        const parsedResult = JSON.parse(result);
        parsedResult.forEach(ingredient => updateIngredient(ingredient, true));
    }

    // Cada vez que actualiza un item, actualizo el storage.
    useEffect(() => {
        setAsyncStorage(JSON.stringify(store));
    }, [store])

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
        if (store.includes(id)) {
            setStore((prevStore) => prevStore.filter(item => item.id !== id));
            updateIngredient(id, false);
        } else {
            setStore((prevStore) => [...prevStore, id]);
            updateIngredient(id, true);
        }

    }


    const renderItem = ({ item }) => (
        <View key={item.id} style={styles.row}>
            <View style={styles.item}>
                <Image
                    style={styles.image}
                    source={item.img}
                    placeholder={'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['}
                    transition={1000}
                />
                <Text style={ui.text}>{item.name}</Text>
            </View>
            <Checkbox
                style={styles.checkbox}
                value={item.selected}
                onValueChange={() => handleIngredient(item.id)}
                color={item.selected ? '#4630EB' : undefined}
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={[ui.h2, { marginBottom: 32 }]}>Administrar nevera</Text>

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