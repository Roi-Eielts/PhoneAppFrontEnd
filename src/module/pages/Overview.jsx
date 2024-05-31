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
            setLoading(false);
        }
        if(response?.type === "CREATE_PRODUCT") {
            getProducts();
        }
        if(response?.type === "SAVE_QUANTITY") {
            getProducts();
        }
        if(response?.type === "DELETE_PRODUCT") {
            getProducts();
        }
    }, [msg]);

    const navigateToCreatePage = () => {
        navigation.navigate("Create")
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
                {loading ? (<Text>Loading... </Text>) : products.length >= 1 ? ( <ShowProducts products={ products }/> ): (<EmptyProductOverview/>)}
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
    },
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    table: {
        width: '100%',
        margin: 15
    },
    table_Head: {
        paddingStart: '2%',
        flexDirection: 'row',
        backgroundColor: '#bebebe'
    },
    table_head_caption: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    table_body: {
        paddingStart: '2%',
        flexDirection: 'row',
    }
})
export default OverviewPage;