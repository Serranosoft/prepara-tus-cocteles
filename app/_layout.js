
import { Tabs, usePathname, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import getMyIngredients from '../src/utils/storage';
import { DataContext } from "../src/DataContext";

export default function Layout() {

    /* const [store, setStore] = useState([]);

    useEffect(() => {
        getMyIngredients(setStore);
    }, []); */


    return (
        <DataContext.Provider value={{ store: "" }}>
            <Tabs>
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarLabel: "Nevera"
                    }}
                />
                <Tabs.Screen
                    name="my-cocktails"
                    options={{
                        tabBarLabel: "Mis Cócteles"
                    }}
                />
                <Tabs.Screen
                    name="all-cocktails"
                    options={{
                        tabBarLabel: "Todos los cócteles"
                    }}
                />
                <Tabs.Screen
                    name="manage-store"
                    options={{
                        tabBarLabel: "Administrar nevera"
                    }}
                />

                <Tabs.Screen name="home" options={{ href: null, headerShown: false }} />
            </Tabs>
        </DataContext.Provider>
    )
}
