import { useFocusEffect, useRouter } from "expo-router";

export default function RedirectToManageStore() {

    const router = useRouter();
    useFocusEffect(() => {
        router.replace("/manage-store");
    });
}