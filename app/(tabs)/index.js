import { useEffect, useState, } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { getAsyncStorage } from '../../src/utils/storage';
import { ui } from "../../src/utils/styles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import IngredientsList from '../../src/components/ingredients-list';

export default function Root() {

    const [qty, setQty] = useState(0);

    useEffect(() => {
        getQty();
    }, [])
    
    async function getQty() {
        let fridge = await getAsyncStorage();
        if (fridge) {
            fridge = JSON.parse(fridge);
            setQty(fridge.length);
        } else {
            setQty(0)
        }
    }

    return (
        <View style={styles.container}>
            
            <Text style={[ui.h4, { paddingHorizontal: 16 }]}>Tienes {qty} ingredientes en tu nevera</Text>
            <View style={ui.list}>
                <IngredientsList />
            </View>

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
        backgroundColor: "#fff",
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
    }

})