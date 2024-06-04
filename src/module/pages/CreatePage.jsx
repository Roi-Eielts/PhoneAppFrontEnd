import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { TextInput, View, Pressable, Text, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

// camera: 
import { Camera } from 'expo-camera';


const CreateProduct = () => {
    const [ready, msg, send] = useContext(AppContext)
    const [name, setName] = useState('');
    const [barCode, setBarcode] = useState('');
    const [contents, setcontents] = useState('');
    const [quantity, setQuantity] = useState('');
    const [typeOfProduct, setTypeOfProduct] = useState('');
    const [user, setUser] = useState(null);
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [permission, setPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [showCamera, setShowCamera] = useState(false);



    const requestPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setPermission(status === 'granted');
    };

    
    useEffect(() => {
        if(!ready)
            return;
        getUser();
    }, [ready])
    useEffect(() => {
        if(user)
            getCompanyProducts();
    }, [user])

    const getUser = async () => {
        setUser(JSON.parse(await SecureStore.getItemAsync('USER')));
    }

    const getCompanyProducts = () => {
        if (!ready)
            return;
        send(JSON.stringify({
            type: "GET_ALL_COMPANY_PRODUCTS",
            user: {
                id: user?.id
            }
        }));
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setBarcode(data);
        setShowCamera(false)
    };

    const createTheProduct = () => {
        if (name.length == 0 || contents.length == 0 || typeOfProduct == undefined)
            return;
        if(quantity <= -2147483647 || quantity >= 2147483647) {
            Alert.alert('Opgelet!', "het Quantiteit nummer is te groot.\nHet limiet is vanaf -2147483647 tot 2147483647")
            return;
        }
        if (!ready)
            return;
        for (let product in products) {
            if (product.name === name) {
                alert("product bestaat al");
                return;
            }
        }
        send(
            JSON.stringify({
                type: "CREATE_PRODUCT",
                user: {
                    id: user?.id
                },
                product: {
                    name: name,
                    quantity: quantity,
                    contents: contents,
                    type: typeOfProduct
                }
            })
        )
    }

    useEffect(() => {
        const response = JSON.parse(msg)
        if (!ready && !response)
            return;
        if (response?.type === "CREATE_PRODUCT") {
            alert("product aangemaakt");
            setName(null);
            setBarcode(null);
            setcontents(null);
            setQuantity(null);
            setTypeOfProduct(null);
            goToOverView();
        }
        if (response?.type === "GET_ALL_COMPANY_PRODUCTS") {
            if (response?.products) {
                setProducts(response?.products)
            } else {
                setProducts([])
            }
        }
    }, [msg])

    const goToOverView = () => {
        navigation.navigate("Overview")
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => goToOverView()} style={styles.back}>
                    <AntDesign name="leftcircle" size={24} color="black" />
                </Pressable>
                <Text style={styles.banner}>Product aanmaken</Text>
            </View>
            <TextInput
                placeholder='Product naam'
                placeholderTextColor='grey'
                onChangeText={(text) => { setName(text) }}
                value={name}
                style={styles.inputField}
            />
            <TextInput
                placeholder='Product aantal'
                placeholderTextColor='grey'
                keyboardType='numeric'
                onChangeText={(text) => { setQuantity(text) }}
                value={quantity}
                style={styles.inputField}
            />
                {barCode != '' ? (
                    <TextInput
                        placeholder='Product barcode'
                        placeholderTextColor='grey'
                        value={barCode}
                        style={styles.inputField}
                        readOnly={true}
                    />
                ): (<></>)}
            <TextInput
                placeholder='Product inhoud'
                placeholderTextColor='grey'
                onChangeText={(text) => { setcontents(text) }}
                value={contents}
                style={styles.inputField}
            />
            <Picker
                selectedValue={typeOfProduct}
                onValueChange={type => setTypeOfProduct(type)}
                style={styles.inputField}>
                <Picker.Item label="select one"/>
                <Picker.Item label="Slobber" value="SLOB" />
                <Picker.Item label="Olie" value="OIL" />
                <Picker.Item label="Voedsel" value="FOOD" />
            </Picker>
            <Pressable onPress={() => createTheProduct()} style={styles.createButton}>
                <Text style={styles.createButtonText}>aanmaken</Text>
            </Pressable>
            <Pressable onPress={() => {setShowCamera(!showCamera) + requestPermission()}} style={ showCamera ? styles.camButton_close: styles.camButton_open}>
                <Text style={styles.createButtonText}>{showCamera ? "Close cam" : "Open cam"}</Text>
            </Pressable>
            {showCamera == true ? (
                <View style={{display: barCode !=  '' ? 'none' : 'block'}}>
                    <Camera style={{width: '100%', height: '100%'}} facing={'back'} 
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    ></Camera>
                </View>
            ) : (<></>)}
            
        </View>

    );
}
const styles = StyleSheet.create({
    container: {
        marginTop: 60
    },
    banner: {
        fontSize: 30,
        marginStart: 'auto',
        marginEnd: 'auto'
    },
    inputField: {
        marginTop: 10,
        marginStart: 'auto',
        marginEnd: 'auto',
        fontSize: 25,
        color: 'black',
        borderColor: '#d3d3d3',
        borderWidth: 2,
        width: 300,
        borderRadius: 5,
        paddingStart: 10
    },
    createButtonText: {
        fontSize: 20,
        color: 'white'
    },
    createButton: {
        backgroundColor: '#198754',
        paddingLeft: 20,
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 10,
        marginBottom: 10,
        borderRadius: 5,
        marginEnd: 'auto',
        marginStart: 'auto'
    },
    back: {
        marginStart: 10
    },
    header: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    camButton_open: {
        backgroundColor: 'grey',
        paddingLeft: 20,
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 10,
        marginBottom: 10,
        borderRadius: 5,
        marginEnd: 'auto',
        marginStart: 'auto'
    },
    camButton_close: {
        backgroundColor: 'red',
        paddingLeft: 20,
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 10,
        marginBottom: 10,
        borderRadius: 5,
        marginEnd: 'auto',
        marginStart: 'auto'
    },

})

export default CreateProduct;