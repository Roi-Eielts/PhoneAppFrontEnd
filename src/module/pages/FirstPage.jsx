import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppContext } from '../AppContext';


const FirstPage = () => {
    const [ready, msg, send] = useContext(AppContext)
    const [user, setUser] = useState([]);

    useEffect(() => {
        if (!ready) return;
        send(JSON.stringify({ type: "first" }));
    }, [ready, send]);

    useEffect(() => {
        const response = JSON.parse(msg);
        if (response?.type === "first") {
            setUser(response.user);
        }
    }, [msg]);

    return (
        <View style={styles.container}>
           <Text>user: {user.username}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FirstPage;