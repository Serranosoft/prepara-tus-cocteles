import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { ui } from "../src/utils/styles";
import React from "react";
import CocktailsList from "../src/components/cocktails-list";
import IngredientsList from "../src/components/ingredients-list";

export default function CocktailDetail() {

    const params = useLocalSearchParams();
    const { id, name, img, steps } = params;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: name, headerShown: true }} />
            <View style={[ui.wrapper, { paddingBottom: 16 }]}>
                <View style={{ gap: 16, marginBottom: 16 }}>
                    <Text style={[ui.h2, { textAlign: "center" }]}>{name}</Text>
                    <View style={styles.imageWrapper}>
                        <Image
                            style={styles.image}
                            source={{ uri: img }}
                            placeholder={'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['}
                            transition={1000}
                        />
                    </View>
                    <Text style={[ui.h3, { marginLeft: 16 }]}>Elaboración:</Text>
                    {
                        steps.split(",").map((item, index) => {
                            return <Text style={{ marginLeft: 40}} key={index}>{item}</Text>
                        })
                    }
                </View>
            </View>
            <View style={ui.list}>
                <IngredientsList id={id} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: "#fff"
    },

    imageWrapper: {
        width: 115,
        height: 115,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },

})