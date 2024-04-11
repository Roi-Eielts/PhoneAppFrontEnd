import { useContext, useEffect, useState } from 'react';
import { Image, TextInput, StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { AppContext } from '../AppContext';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import EmptyProductOverview from '../components/EmptyProductsOverview';




const OverviewPage = () => {
    const [ready, msg, send] = useContext(AppContext);
    const navigation = useNavigation();
    var user;
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        getAsyncStorageItem();
        getProducts();
    })

    getProducts = () => {
        if (!ready)
            return;
        send(JSON.stringify({
            type: "GET_PRODUCTS",
            user: user
        }));
    }

    getAsyncStorageItem = async () => {
        var jsonString = await SecureStore.getItemAsync('USER');
        user = JSON.parse(jsonString);
    }

    useEffect(() => {
        const response = JSON.parse(msg);
        if(response?.type === "GET_PRODUCTS") {
            setProducts(response?.products)
        }
    });
    return (
        <View style={Styles.main_div}>
            <View>
                <Text style={Styles.banner}>Overzicht</Text>
            </View>
            <View>
                { products.length == 0 ? EmptyProductOverview : }
            </View>
        </View>
    );
};

const Styles = StyleSheet.create({
    main_div: {
        marginTop: 60
    },
    banner: {
        fontSize: 30,
        marginStart: 'auto',
        marginEnd: 'auto'
    }
})
export default OverviewPage;