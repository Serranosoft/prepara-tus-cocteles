import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { ui } from "../src/utils/styles";
import React from "react";
import IngredientsList from "../src/components/ingredients-list";

export default function CocktailDetail() {

    const params = useLocalSearchParams();
    const { id, name, steps } = params;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: name, headerShown: true }} />
            <View style={[ui.wrapper, { paddingBottom: 8 }]}>
                <View style={{ gap: 8, marginBottom: 16 }}>
                    <Text style={[ui.h2, { textAlign: "center", marginBottom: 12 }]}>{name}</Text>
                    <Text style={ui.h3}>Elaboración:</Text>
                    {
                        steps.split(/\d+\./).map((item, index) => {
                            return item.trim() !== '' && <Text style={{ marginLeft: 20 }} key={index}>{item.trim()}</Text>
                        })
                    }
                </View>
            </View>
            <View style={ui.list}>
                <Text style={[ui.h3, { paddingHorizontal: 16 }]}>Ingredientes:</Text>
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
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
})