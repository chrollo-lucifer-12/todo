import {View, Text, SafeAreaView, Button} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {useState} from "react";
import {useNavigation} from "@react-navigation/core";

const HomeScreen = () => {

    const navigation = useNavigation();

    return (
        <SafeAreaProvider>
            <Button title={"Login"} onPress={() => {
                navigation.navigate("auth")
            }}/>
            <Text style={{ color: 'blue', marginTop: 20 }}>Hello World!</Text>
        </SafeAreaProvider>
    );
};

export default HomeScreen;
