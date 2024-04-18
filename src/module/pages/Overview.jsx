import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { AppContext } from '../AppContext';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import EmptyProductOverview from '../components/EmptyProductsOverview';
import ShowProducts from '../components/ShowProducts';
import { AntDesign } from '@expo/vector-icons';





const OverviewPage = () => {
    const [ready, msg, send] = useContext(AppContext);
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true)

    const getProducts = async () => {
        var result = JSON.parse(await SecureStore.getItemAsync('USER'));
        if (!ready)
            return;
        send(JSON.stringify({
            type: "GET_PRODUCTS",
            user: {
                id: result?.id
            }
        }));
    }

    useEffect(() => {
        getProducts();
    }, [ready])

    useEffect(() => {
        const response = JSON.parse(msg);
        if (response?.type === "GET_PRODUCTS") {
            if (response?.products) {
                setProducts(response?.products)
            } else {
                setProducts([])
            }
            console.table(loading)
            setLoading(false);
        }
    }, [msg]);

    const navigateToCreatePage = () => {
        navigation.navigate("Create")
    }

    return (
        <View style={Styles.main_div}>
            <View>
                <Text style={Styles.banner}>Overzicht</Text>
                <Pressable onPress={() => navigateToCreatePage()}>
                    <AntDesign name="pluscircle" size={24} color="black" />
                </Pressable>
            </View>
            <ScrollView>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                        products && products.length >= 1 ? (<ShowProducts products={ products }/>) : (<Text>geen producten</Text>)
                )}
            </ScrollView>
        </View >
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