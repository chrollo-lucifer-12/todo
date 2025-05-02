import {
    Text,
    Button,
    SafeAreaView,
    View,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Modal,
    TextInput, TouchableOpacity, Pressable
} from 'react-native';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {PresenceTransition} from "@gluestack-ui/transitions";

const HomeScreen = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [todo, setTodo] = useState("")
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (accessToken) {
                    try {
                        const res = await axios.get('https://dummyjson.com/auth/me', {
                            headers: {
                                "Authorization": `Bearer ${accessToken}`
                            },
                            withCredentials: true
                        });
                        setUsername(res.data.username);
                        const todosResponse = await axios.get(`https://dummyjson.com/todos/user/${res.data.id}`)
                        setTodos(todosResponse.data.todos);
                        setIsLoggedIn(true);
                    } catch (error) {
                        console.log(error);
                        setIsLoggedIn(false);
                    }
                } else {
                    setIsLoggedIn(false);
                }
            } catch (e) {
                console.log("Auth check error:", e);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = () => {
        router.replace("/auth")
    }

    const handleAddTodo = () => {
        setModalVisible(true);
    }

    const handleSaveTodo = async () => {

        if (!todo) return;
        try {
            console.log(todo);
            const accessToken = await AsyncStorage.getItem('accessToken');

            if (accessToken) {
                try {
                    const res = await axios.get('https://dummyjson.com/auth/me', {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        },
                        withCredentials: true
                    });
                    const saveTodoRes = await axios.post("https://dummyjson.com/todos/add", {
                        todo,
                        completed : false,
                        userId : res.data.id
                    })
                    setTodos(prev => [saveTodoRes.data, ...prev])
                    setModalVisible(false);
                } catch (error) {
                    console.log(error);
                }
            } else {
                setIsLoggedIn(false);
                setUsername("");
                setTodos([]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    if (loading) {
        return (
            <SafeAreaView style={{flex : 1, justifyContent : "center", alignItems : "center"}}>
                <ActivityIndicator size="large" color="#007AFF" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex : 1}}>
            <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)} animationType={"slide"}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'black', padding: 20, borderRadius: 10, width: '80%' }}>
                        <Text style={{ fontSize: 18, marginBottom: 10, color : "white" }}>Enter new task</Text>
                        <TextInput
                            placeholder="New task"
                            value={todo}
                            onChangeText={setTodo}
                            style={{ borderColor: 'gray', borderWidth: 0.5, borderRadius : 10, padding: 10, color : "white" }}
                        />
                        <View style={{ flexDirection: 'row', marginTop : 10, justifyContent: 'space-between' }}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <Button title="Add" onPress={handleSaveTodo} />
                        </View>
                    </View>
                </View>
            </Modal>

            <View>
                <Text style={{color: "white", marginTop: 60, padding: 10, fontSize: 40}}>
                    {
                        !isLoggedIn ? "Please Login to Continue" : `Hello ${username}`
                    }
                </Text>
                <Text style={{color : "grey", padding : 10}}>
                    Good Morning!
                </Text>
            </View>

            {
                isLoggedIn ? (
                    <ScrollView style={{marginTop : 80}}>
                        <Text style={{textAlign : "center", color : "white", fontSize : 30}}>
                            Your tasks
                        </Text>

                        {
                            !todos.length && (<Text style={{color : "grey", marginTop : 20, padding : 6}}>You currently have no tasks!</Text>)
                        }

                        {todos.length > 0 && (
                            <View style={{ marginTop: 20,flex : 1, flexDirection : "column",  }}>
                                {todos.map((todo, index) => (
                                    <View key={index} style={{ borderRadius : 20, borderWidth : 0.5, borderColor : "grey", flex : 1, flexDirection : "row", padding : 20}}>
                                        <TouchableOpacity>

                                        </TouchableOpacity>
                                        <Text style={{color : "white"}}>{todo.todo}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                    </ScrollView>
                ) : (
                    <Pressable style={{backgroundColor : "#2f2f2f", padding : 10, borderRadius : 20, }} onPress={handleLogin}>
                        <Text style={{color : "white", textAlign : "center"}}> Login</Text>
                    </Pressable>
                )
            }


            <View style={{ padding: 20, position: "absolute", bottom: 20, left: 0, right: 0 }}>
                <Pressable
                    disabled={!isLoggedIn}
                    style={{backgroundColor : "#2f2f2f", padding : 10, borderRadius : 20, }}
                    onPress={handleAddTodo}
                >
                    <Text style={{color : "white", textAlign : "center"}}> Add Task</Text>
                    </Pressable>
            </View>


        </SafeAreaView>
    );
};

export default HomeScreen;