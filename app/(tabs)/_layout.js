
import { SplashScreen, Stack, Tabs } from 'expo-router';
import { DataContext } from "../../src/DataContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
SplashScreen.preventAutoHideAsync();

export default function Layout() {
    // Carga de fuentes.
    const [fontsLoaded] = useFonts({
        "Regular": require("../../assets/fonts/OpenRunde-Regular.otf"),
        "Medium": require("../../assets/fonts/OpenRunde-Medium.otf"),
        "Semibold": require("../../assets/fonts/OpenRunde-Semibold.otf"),
        "Bold": require("../../assets/fonts/OpenRunde-Bold.otf"),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded])
    if (!fontsLoaded) {
        return null;
    }
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Tabs style={{ paddingVertical: 16 }} backBehavior="history">
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarStyle: { height: 65 },
                        tabBarLabel: "Nevera",
                        tabBarLabelStyle: { marginBottom: 6, fontSize: 12, fontWeight: "bold" },
                        tabBarIcon:
                            ({ focused }) => <MaterialCommunityIcons name="fridge-outline" size={30} color={focused ? "black" : "#b5b5b5"} style={{ marginTop: 8 }} />,
                        headerShown: false,
                        tabBarActiveTintColor: "#337AB7",
                        tabBarInactiveTintColor: "#b5b5b5",
                    }}
                />
                <Tabs.Screen
                    name="cocktails"
                    options={{
                        tabBarStyle: { height: 65 },
                        tabBarLabel: "Cócteles",
                        tabBarLabelStyle: { marginBottom: 6, fontSize: 12, fontWeight: "bold" },
                        tabBarIcon:
                            ({ focused }) => <MaterialCommunityIcons name="glass-cocktail" size={30} color={focused ? "black" : "#b5b5b5"} style={{ marginTop: 8 }} />,
                        headerShown: false,
                        tabBarActiveTintColor: "#337AB7",
                        tabBarInactiveTintColor: "#b5b5b5"
                    }}
                />
            </Tabs>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        justifyContent: "center",
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#fff",
    },

})