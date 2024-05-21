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
        if(!ready)
            return;
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

    const renderView = () => {
        if(loading) {
            return <Text>Loading...</Text>;
        } else if(products && products.length >= 1) {
            return <ShowProducts products={ products }/>;
        } else {
            return <EmptyProductOverview/>;
        }
    }

    return (
        <View style={Styles.main_div}>
            <View>
                <Text style={Styles.banner}>Overzicht</Text>
                <Pressable style={ Styles.createProductButton } onPress={() => navigateToCreatePage()} onLongPress={ key => alert("deze knop lijd je naar het 'product toevoegen' pagina.")}>
                    <AntDesign name="pluscircle" size={24} color="black" />
                </Pressable>
            </View>
            <ScrollView>
                {renderView()}
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
    },
    createProductButton: {
        alignSelf: 'flex-end',
        marginEnd: 10
    }
})
export default OverviewPage;