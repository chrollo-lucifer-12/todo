import { Button, SafeAreaView, Text, TextInput, View } from "react-native";
import { useState } from "react";
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import {useRouter} from "expo-router";

const AuthScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const handleLogin = async () => {
        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        console.log(username, password);
        try {
            setIsLoading(true);
            const res = await axios.post('https://dummyjson.com/auth/login', {
                username,
                password,

            }, {
                headers : {
                    'Content-Type': 'application/json'
                },
                withCredentials : true
            })

            console.log(res);

            await AsyncStorage.setItem('accessToken', res.data.accessToken);
            await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
            router.replace("/home")
        } catch (e) {
            console.log(e)
            alert("Wrong username or password")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ padding: 20, width: '80%', flexDirection: 'column', justifyContent: 'center' }}>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    style={{
                        borderColor: "#1c1b1e",
                        borderWidth: 1,
                        color: "white",
                        borderRadius: 5,
                        marginBottom: 15,
                        paddingHorizontal: 10,
                        height: 40
                    }}
                    placeholder="Enter username"
                    placeholderTextColor="gray"
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    style={{
                        borderColor: "#1c1b1e",
                        borderWidth: 1,
                        color: "white",
                        borderRadius: 5,
                        marginBottom: 15,
                        paddingHorizontal: 10,
                        height: 40
                    }}
                    placeholder="Enter password"
                    secureTextEntry={true}
                    placeholderTextColor="gray"
                />
                <Button disabled={isLoading} title="Login" onPress={handleLogin} />
            </View>
        </SafeAreaView>
    );
}

export default AuthScreen;
