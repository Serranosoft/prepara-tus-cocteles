import { FlatList, StyleSheet, TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack } from "expo-router";
import { getIngredients } from "../src/utils/ingredients";
import { getAsyncStorage, setAsyncStorage, } from "../src/utils/storage";
import { ui } from "../src/utils/styles";
import { StatusBar } from "react-native";
import ManageStoreItem from "../src/components/manage-store-item";
import filter from "lodash.filter";

export default function ManageStore() {

    // Array con los ingredientes actualizados
    const [ingredients, setIngredients] = useState(getIngredients());
    const fullIngredients = useRef(getIngredients());

    const storage = useRef();
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");

    function handleSearch(query) {
        setSearchQuery(query);
        const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
        const filteredData = filter(fullIngredients.current, (ingr) => {
            return contains(ingr, formattedQuery);
        });
        setIngredients([...filteredData]);

    }

    function contains({name}, query) {
        if (name.includes(query)) {
            return true;
        } else {
            return false;
        }
    }

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
        const newData = [...fullIngredients.current];
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

    const renderItem = ({ item, index }) => <ManageStoreItem item={item} index={index} handleIngredient={handleIngredient} />

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Gestiona tus ingredientes", headerShown: true }} />
            <TextInput
                placeholder="Busca por un nombre"
                clearButtonMode="always"
                style={styles.searchBox}
                autoCapitalize="none"
                autoCorrect={false}
                value={searchQuery}
                onChangeText={(text) => handleSearch(text)}
            />
            {!loading &&
                <View style={ui.list}>
                    <FlatList data={ingredients} renderItem={renderItem} keyExtractor={(item) => item.id} /* removeClippedSubviews={true} */ />
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
        paddingHorizontal: 16,
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

    searchBox: {
        width: 250,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: "center",
    }

})