import React, { memo } from "react";
import { Text } from "react-native";
import { View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ui } from "../utils/styles";
import Animated, { SlideInDown } from "react-native-reanimated";
import { TouchableOpacity } from "react-native";
import { getIngredientNameById } from "../utils/ingredients";


function CocktailsListItem({ item, index, doableQty, id }) {
    
    return (
        <Animated.View key={item.id} entering={SlideInDown.duration(850).delay(index * 50)}>
            <Link asChild key={item.id} href={{ pathname: "/cocktail-detail", params: { id: item.id, name: item.name, steps: item.steps } }}>
                <TouchableOpacity>
                    <View style={[styles.row, { borderBottomWidth: index + 1 === doableQty ? 0 : 1 }]}>
                        <View style={styles.imageWrapper}>
                        </View>
                        <View style={styles.column}>
                            <Text style={[ui.h4, { width: 270 }]} numberOfLines={2}>{item.name}</Text>
                            <Text style={[ui.muted, { width: 270 }]} numberOfLines={2}>
                                {item.ingredients.map((ingr, index) => (
                                    <React.Fragment key={index}>
                                        {getIngredientNameById(ingr)}{index < item.ingredients.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                ))}
                            </Text>
                            {
                                item.highlight ?
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                        <View style={{ width: 17, height: 17, backgroundColor: "#3DB36E", borderRadius: 100 }}></View>
                                        <Text><Text style={{ fontWeight: "bold" }}>{item.coincidenceQty}/{item.ingredients.length}</Text> ingredientes</Text>
                                    </View>
                                    :
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                        <View style={{ width: 17, height: 17, backgroundColor: "#EECA5D", borderRadius: 100 }}></View>
                                        <Text><Text style={{ fontWeight: "bold" }}>{item.coincidenceQty}/{item.ingredients.length}</Text> ingredientes</Text>
                                    </View>

                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </Link >
            {
                !id && (index + 1) === doableQty &&
                <View style={styles.alert}>
                    <Text style={[ui.text, { textAlign: "center", maxWidth: 320 }]}>Necesitas mas ingredientes para los cócteles indicados a continuación</Text>
                    <MaterialCommunityIcons name="emoticon-sad-outline" size={30} color="#000" />
                </View>
            }
        </Animated.View>
    )
}
export default CocktailsListItem;
// export default memo(CocktailsListItem);

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 16,
        paddingHorizontal: 12,
        gap: 16,
        borderBottomWidth: 1,
        borderColor: "#e8e8e8",

    },

    column: {
        gap: 8,
        alignItems: "flex-start",

    },

    imageWrapper: {
        width: 70,
        height: 70,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f1f1"
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 100,
    },

    alert: {
        gap: 6,
        padding: 20,
        width: "100%",
        backgroundColor: "#cccccc",
        backgroundColor: "#337AB7",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 8,
        borderWidth: 3,
        borderColor: "#337AB7",
        backgroundColor: "rgba(51, 122, 183, 0.25)",
        alignSelf: "center",
    }

})