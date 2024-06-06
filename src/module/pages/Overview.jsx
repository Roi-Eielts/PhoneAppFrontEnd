import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { AppContext } from '../AppContext';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import EmptyProductOverview from '../components/EmptyProductsOverview';
import ShowProducts from '../components/ShowProducts';
import { AntDesign } from '@expo/vector-icons';
import { Camera } from 'expo-camera';

const OverviewPage = () => {
    const [ready, msg, send] = useContext(AppContext);
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true)
    const [showCamera, setShowCamera] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [barCode, setBarcode] = useState('');
    const [permission, setPermission] = useState(null);

    const requestPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setPermission(status === 'granted');
    };

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

    const navigateToSignleProduct = (id) => {
        navigation.navigate("SignleProduct", {productId: id})
    }

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
        if(response?.type === "SAVE_PRODUCT") {
            getProducts();
        }
        if(response?.type === "FINDBYBARCODE") {
            if(response?.foundProduct != null) {
                navigateToSignleProduct(response?.foundProduct.id)
            } else {
                Alert.alert("OOPS!", "Het product met het barcode '" + barCode + "' is niet gevonden")
                setScanned(false);
            }
        }
    }, [msg]);

    const navigateToCreatePage = () => {
        navigation.navigate("Create")
    }

    const handleBarCodeScanned = ({ type, data }) => {
        if (!ready)
            return;
        send(JSON.stringify({
            type: "FINDBYBARCODE",
            barcode: barCode
        }));
        setBarcode(data);
        setShowCamera(false)
    };

    return (
        <View style={Styles.main_div}>
            <View>
                <Pressable onPress={() => {setShowCamera(!showCamera) + requestPermission()}} style={ showCamera ? Styles.camButton_close: Styles.camButton_open}>
                    <AntDesign name={showCamera ? "minussquare" : "camera" } size={24} color="black" />
                </Pressable>
                <Text style={Styles.banner}>Overzicht</Text>
                <Pressable style={ Styles.createProductButton } onPress={() => navigateToCreatePage()} onLongPress={ key => alert("deze knop lijd je naar het 'product toevoegen' pagina.")}>
                    <AntDesign name="pluscircle" size={24} color="black" />
                </Pressable>
            </View>
            <ScrollView>
                {loading ? (<Text>Loading... </Text>) : products.length >= 1 ? ( <ShowProducts products={ products }/> ): (<EmptyProductOverview/>)}
            </ScrollView>
            {showCamera == true ? (
                    <Camera style={{width: '100%', height: '100%'}} facing={'back'} 
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    ></Camera>
                    ) : (<></>)}
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
    },
    createButtonText: {
        fontSize: 20,
        color: 'white'
    },
    camButton_open: {
        alignSelf: 'flex-start',
        backgroundColor: 'grey',
        paddingLeft: 20,
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    camButton_close: {
        alignSelf: 'flex-start',
        backgroundColor: 'red',
        paddingLeft: 20,
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
})
export default OverviewPage;