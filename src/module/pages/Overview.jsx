import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppContext } from '../AppContext';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import EmptyProductOverview from '../components/EmptyProductsOverview';
import ShowProducts from '../components/ShowProducts';





const OverviewPage = () => {
    const [ready, msg, send] = useContext(AppContext);
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const EmptyProduct = EmptyProductOverview();
    const productsView = ShowProducts(products);

    useEffect(() => {
        getProducts();
    }, [ready])

    getProducts = async () => {
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
        const response = JSON.parse(msg);
        if (response?.type === "GET_PRODUCTS") {
            if (response?.products) {
                setProducts(response?.products)
            } else {
                setProducts([])
            }
        }
    }, [ready]);
    checkForProduct = () => {
        if(products != undefined && products.length <= 1) {
            return <ShowProducts products={products}></ShowProducts>
        } else {
            return <Text>Er zijn nog geen producten of er is iets fout gegaan</Text>
        }
    }

    return (
        <View style={Styles.main_div}>
            <View>
                <Text style={Styles.banner}>Overzicht</Text>
            </View>
            <View>
                { checkForProduct() }
            </View >
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