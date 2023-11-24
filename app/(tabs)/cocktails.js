import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { ui } from "../../src/utils/styles";
import React, { useState } from "react";
import CocktailsList from "../../src/components/cocktails-list";

export default function Cocktails() {

    return (
        <View style={styles.container}>
            <Text style={[ui.h4, { paddingHorizontal: 16 }]}>¿Qué coctel quieres hacer hoy?</Text>
            <View style={ui.list}>
                <CocktailsList />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        gap: 16
    },

    list: {
        flex: 1,
    },
})