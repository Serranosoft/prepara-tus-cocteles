
import { Link, SplashScreen, Stack, Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native';
import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { ui } from '../../src/utils/styles';
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
                    name="redirect-to-manage-store"
                    options={{
                        tabBarIcon: () => (
                            <View style={{justifyContent: "center", alignItems: "center"}}>
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 30,
                                        height: 68,
                                        width: 68,
                                        borderRadius: 68,
                                        backgroundColor: "white",
                                        borderColor: "#337AB7",
                                        borderWidth: 3,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        zIndex: 1,
                                    }}>
                                    <Link href="manage-store">
                                        <View
                                            style={{
                                                height: 58,
                                                width: 58,
                                                borderRadius: 58,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: "rgba(51, 122, 183, 0.25)",
                                            }}>
                                            <MaterialCommunityIcons name="basket-plus-outline" size={30} color="black" />
                                        </View>
                                    </Link>
                                </View>
                                <Text style={[ui.h4, { paddingTop: 30, fontSize: 15 }]}>Ingredientes</Text>

                            </View>
                        ),
                        tabBarStyle: { height: 0 },
                        tabBarLabel: "",
                        tabBarLabelStyle: { display: "none" },
                        headerShown: false,
                        tabBarActiveTintColor: "#337AB7",
                        tabBarInactiveTintColor: "#b5b5b5"
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
        paddingTop: StatusBar.currentHeight + 48,
        backgroundColor: "#fff",
    },

})