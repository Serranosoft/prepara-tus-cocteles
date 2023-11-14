import { useCallback, useContext, useEffect, useState, } from 'react';
import { Pressable, Text, View } from 'react-native';
import { DataContext } from '../../src/DataContext';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { getAsyncStorage } from '../../src/utils/storage';
import { Image } from 'expo-image';
import { ui } from "../../src/utils/styles";
import { FlatList } from 'react-native';
import getIngredients from '../../src/utils/ingredients';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Root() {

    const [ingredients, setIngredients] = useState(getIngredients());
    const [storeIds, setStoreIds] = useState();
    const [store, setStore] = useState([]);

    // Obtener todos los ingredientes que tiene el usuario
    useEffect(() => {
        fetchStore();
    }, [])

    useEffect(() => {
        if (storeIds && storeIds.length > 0) {
            getStoreItemsNames();
        }
    }, [storeIds])

    async function fetchStore() {
        const result = await getAsyncStorage();
        setStoreIds(result);
    }

    function getStoreItemsNames() {
        const names = ingredients.filter(ingredient => JSON.parse(storeIds).includes(ingredient.id));
        setStore(names);
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
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={[ui.h2, { marginBottom: 32 }]}>Administrar nevera</Text>

            {store.length > 0 &&
                <View style={styles.list}>
                    <FlatList
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingVertical: 8 }}
                        data={store}
                        numColumns={1}
                        initialNumToRender={10}
                        renderItem={renderItem}
                    />
                </View>

            }

            <Link asChild href="/manage-store">
                <Pressable style={ui.button}>
                    <MaterialCommunityIcons name="basket-plus-outline" size={30} color="black" />
                </Pressable>
            </Link>
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

    image: {
        width: 50,
        height: 50,
    }

})