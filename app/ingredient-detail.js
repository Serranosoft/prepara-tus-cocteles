import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { ui } from "../src/utils/styles";
import React from "react";
import CocktailsList from "../src/components/cocktails-list";
import { StatusBar } from "react-native";

export default function IngredientDetail() {

    const params = useLocalSearchParams();
    const { id, name, img } = params;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: name, headerShown: true }} />
            <View style={[ui.wrapper, { paddingBottom: 16 }]}>
                <View style={{ alignItems: "center", gap: 16, marginBottom: 32 }}>
                    <Text style={ui.h2}>{name}</Text>
                    <View style={styles.imageWrapper}>
                        <Image
                            style={styles.image}
                            source={{ uri: img }}
                            placeholder={'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['}
                            transition={1000}
                        />
                    </View>
                </View>
                <Text style={ui.text}>Cócteles que contienen {name}:</Text>
            </View>
            <View style={ui.list}>
                <CocktailsList id={id} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#fff"
    },

    list: {
        flex: 1,
        marginHorizontal: 24,
        marginTop: 32,
    },

    imageWrapper: {
        width: 135,
        height: 135,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    },

    image: {
        width: 120,
        height: 120,
        borderRadius: 100,
    },

})