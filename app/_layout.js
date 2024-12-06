import { Stack } from 'expo-router/stack';
import AdsHandler from '../src/utils/AdsHandler';
import { createRef, useEffect, useState } from 'react';
import { DataContext } from '../src/DataContext';

export default function Layout() {

    // Gestión de anuncios
    const [adTrigger, setAdTrigger] = useState(0);
    const adsHandlerRef = createRef();

    useEffect(() => {
        if (adTrigger > 5) {
            adsHandlerRef.current.showIntersitialAd();
            setAdTrigger(0);
        }
    }, [adTrigger])

    return (
        <>
            <AdsHandler ref={adsHandlerRef} adType={[0]} />
            <DataContext.Provider value={{ setAdTrigger: setAdTrigger }}>
                <Stack screenOptions={{ headerShown: false }} />
            </DataContext.Provider>
        </>
    );
}
