import { Image, View } from "react-native";
import { Text } from "react-native";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { getCocktailsQtyByIngredient } from "../utils/cocktails";
import { StyleSheet } from "react-native";
import { ui } from "../utils/styles";
import Animated, { SlideInDown } from "react-native-reanimated";
import { memo, useContext } from "react";
import { DataContext } from "../DataContext";

function IngredientListItem({ item, index, showTick }) {

    const { setAdTrigger } = useContext(DataContext);


    return (
        <Animated.View key={item.id} entering={SlideInDown.duration(850).delay(index * 50)}>
            <Link asChild href={{ pathname: "/ingredient-detail", params: { id: item.id, name: item.name, img: item.img } }}>
                <TouchableOpacity onPress={() => setAdTrigger((adTrigger) => adTrigger + 1)}>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={ui.h4}>{item.name}</Text>
                            {
                                getCocktailsQtyByIngredient(item.id) > 0 ? <Text style={ui.muted}>Puedes preparar {getCocktailsQtyByIngredient(item.id)} cócteles con esto</Text> : <Text style={ui.muted}>No existen cócteles con este ingrediente</Text>
                            }

                        </View>
                        {item.selected && showTick && <Image source={require("../../assets/tick.png")} style={{ width: 30, height: 30, opacity: 0.55 }} /> }
                    </View>
                </TouchableOpacity>
            </Link>
        </Animated.View>
    )
}

export default IngredientListItem;
// export default memo(IngredientListItem);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#fff"
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

    column: {
        gap: 8,
        alignItems: "flex-start",
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