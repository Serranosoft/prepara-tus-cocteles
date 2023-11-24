import { useCallback, useEffect, useRef, useState, } from 'react';
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
import getCocktails from '../../src/utils/cocktails';
import { TouchableOpacity } from 'react-native';
import IngredientsList from '../../src/components/ingredients-list';

export default function Root() {

    const [storeIds, setStoreIds] = useState();
    const [store, setStore] = useState([]);
    const cocktails = useRef(getCocktails())
    const ingredients = useRef(getIngredients());

    // Obtener todos los ingredientes que tiene el usuario
    useFocusEffect(
        useCallback(() => {
            fetchStore();
        }, [])
    );

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
        const names = ingredients.current.filter(ingredient => JSON.parse(storeIds).includes(ingredient.id));
        setStore(names);
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

    const renderItem = ({ item }) => (
        <Link asChild key={item.id} style={styles.row} href={{ pathname: "/ingredient-detail", params: { id: item.id, name: item.name, img: item.img } }}>
            <TouchableOpacity>
                <Image
                    style={styles.image}
                    source={item.img}
                    placeholder={'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['}
                    transition={1000}
                />
                <View style={styles.info}>
                    <Text style={ui.text}>{item.name}</Text>
                    {
                        renderQty(item.id) > 0 && <Text style={ui.muted}>Prepara {renderQty(item.id)} cócteles con esto</Text>
                    }
                </View>
            </TouchableOpacity>
        </Link>
    )

    return (
        <View style={styles.container}>

            {store.length > 0 &&
                <>
                    <Text style={[ui.h2, { marginTop: 32 }]}>Mi Nevera</Text>
                    <View style={[ui.list, ui.wrapper]}>
                        {/* <FlatList
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ paddingVertical: 8 }}
                            data={store}
                            numColumns={1}
                            initialNumToRender={10}
                            renderItem={renderItem}
                        /> */}
                        <IngredientsList />
                    </View>
                </>

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
        gap: 16,
        backgroundColor: "#fff"
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginVertical: 14,
    },

    info: {
        gap: 4,
        justifyContent: "center",
    },

    image: {
        width: 55,
        height: 55,
        borderRadius: 100,
    }

})