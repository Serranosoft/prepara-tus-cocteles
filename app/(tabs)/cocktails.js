import { View } from "react-native";
import { StyleSheet } from "react-native";
import { ui } from "../../src/utils/styles";
import React from "react";
import CocktailsList from "../../src/components/cocktails-list";
import { Stack } from "expo-router";

export default function Cocktails() {

    return (
        <View style={styles.container}>
            <View style={ui.list}>
                <CocktailsList />
            </View>
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
})