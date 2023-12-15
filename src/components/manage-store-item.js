import React, { memo } from 'react';
import { getCocktailsQtyByIngredient } from '../utils/cocktails';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ui } from '../utils/styles';
import { Link } from 'expo-router';

function ManageStoreItem({ item, index, handleIngredient }) {


    return (
        <View key={item.id} style={styles.row} >
            <Link asChild href={{ pathname: "/ingredient-detail", params: { id: item.id, name: item.name, img: item.img } }}>
                <TouchableOpacity>
                    <View style={[styles.row, { borderBottomWidth: 0, paddingVertical: 0, paddingHorizontal: 0 }]}>
                        <View style={styles.column}>
                            <Text style={ui.h4}>{item.name}</Text>
                            {
                                getCocktailsQtyByIngredient(item.id) > 0 && <Text style={ui.muted}>Se usa en {getCocktailsQtyByIngredient(item.id)} cócteles</Text>
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.checkbox} onPress={() => handleIngredient(index)}>
                {item.selected &&
                    <Image style={[styles.checkboxImg, { display: item.selected ? "flex" : "none" }]} source={require("../../assets/tick.png")} />
                }
            </TouchableOpacity>
        </View>
    )

}
export default memo(ManageStoreItem);

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

})