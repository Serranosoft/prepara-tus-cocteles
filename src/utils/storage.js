import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getAsyncStorage2() {
    return await AsyncStorage.getItem("store");
}

export async function setAsyncStorage(value) {
    try {
        await AsyncStorage.setItem("store", value);
    } catch (e) {
        // saving error
    }
}