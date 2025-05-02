import { Text, Button, SafeAreaView } from 'react-native';
import {useRouter} from "expo-router";


const HomeScreen = () => {

    const router = useRouter()

    const handleLoginPress = () => {
        router.replace("/auth");
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button
                title={"Login"}
                onPress={handleLoginPress}
            />
            <Text style={{ color: 'blue', marginTop: 20 }}>Hello World!</Text>
        </SafeAreaView>
    );
};

export default HomeScreen;
