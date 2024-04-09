import { useContext, useEffect, useState } from 'react';
import { Image, TextInput, StyleSheet, Text, View, Pressable } from 'react-native';
import { AppContext } from '../AppContext';


const LoginPage = () => {
    const [ready, msg, send] = useContext(AppContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')

    const login = () => {
        if (!ready)
            return;
        send(
            JSON.stringify({
                type: "Login",
                user: {
                    username: username,
                    password: password
                }
            })
        )
    }

    return (
        <View>
            <View style={styles.imageDiv}>
                <Image source={require('../../../assets/loginLogo.png')} style={styles.image} />
                <Text style={styles.login}>Login</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.textStyle}>Username:</Text>
                <TextInput
                    style={styles.inputStyling}
                    placeholder='Username'
                    onChangeText={(text) => { setUsername(text) }}
                    value={username}
                />
                <Text style={styles.textStyle}>Wachtwoord:</Text>
                <TextInput
                    style={styles.inputStyling}
                    secureTextEntry={true}
                    placeholder='Password'
                    onChangeText={(text) => { setPassword(text) }}
                    value={password}
                />
                <Pressable onPress={login
                } style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>login</Text>
                </Pressable>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    textStyle: {
        marginTop: 20,
        fontSize: 25,
        fontWeight: 'bold'
    },
    inputStyling: {
        fontSize: 25,
        color: 'grey',
        borderColor: '#d3d3d3',
        borderWidth: 2,
        width: 300,
        borderRadius: 5,
        paddingStart: 10
    },
    image: {
        height: 300,
        width: 800,
    },
    imageDiv: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        fontSize: 45,
        color: 'orange',
        marginBottom: 20,
    },
    loginButton: {
        marginBottom: 20,
        marginTop: 30,
        borderColor: '#feab12',
        backgroundColor: '#A9A9A9',
        width: 200,
        height: 40,
        borderRadius: 5,
    },
    loginButtonText: {
        padding: 0,
        margin: 0,
        textAlign: 'center',
        fontSize: 25,
        marginHorizontal: 'auto',
        marginVertical: 'auto',
    },
});

export default LoginPage;