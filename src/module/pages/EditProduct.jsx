import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { TextInput, View, Pressable, Text, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';


const EditProduct = ({ route }) => {
    const [ready, msg, send] = useContext(AppContext);
    const navigation = useNavigation();
    const { productId } = route.params;
    const [product, setProduct] = useState(null);

    //fields of product
    const [productName, setproductName] = useState("");
    const [productQuantity, setproductQuantity] = useState("");
    const [productBarcode, setproductBarcode] = useState("");
    const [productContent, setproductContent] = useState("");
    const [typeOfProduct, setTypeOfProduct] = useState(null);

    constructor

    useEffect(() => {
        if (!ready)
            return;
        send(JSON.stringify({
            type: "LOAD_PRODUCT_TO_EDIT",
            product: {
                id: productId
            }
        }));
    }, [ready])

    useEffect(() => {
        const response = JSON.parse(msg);
        if (response?.type === "LOAD_PRODUCT_TO_EDIT") {
            if (response?.product) {
                setProduct(response?.product)
                setproductName(response?.product.name)
                setproductQuantity(response?.product.quantity.toString())
                setproductBarcode(response?.product.barcode?.toString())
                setproductContent(response?.product.contents)
                setTypeOfProduct(response?.product.type)
            }
        }
        if (response?.type === "LOAD_PRODUCT_TO_EDIT") {
            Alert.alert("product aangepast: " + productName, "het product is aangemaakt en kan nu niet meer terug gezet woorden naar de oude data");
        }

    }, [msg]);

    const goViewProduct = () => { 
        navigation.navigate("SignleProduct", {productId: product.id})
    }

    const save = () => {
        if (productName.length == 0 || productContent.length == 0 || typeOfProduct == undefined)
            return;
        var quantityField = parseInt(productQuantity)
        if(quantityField == NaN || quantityField <= -2147483647 || quantityField >= 2147483647) {
            Alert.alert('Opgelet!', "het Quantiteit nummer is te groot.\nHet limiet is vanaf -2147483647 tot 2147483647")
            return;
        }
        if (!ready)
            return;
        send(JSON.stringify({
            type: "SAVE_PRODUCT",
            product: {
                id: product.id,
                name: productName,
                quantity: quantityField,
                contents: productContent,
                barcode: productBarcode,
                type: typeOfProduct
            },
        }));
    }

    const reset = () => {

    }

    return (
        <View style={ styles.main_div}>
            <View>
                <View style={[styles.row, styles.width_100]}>
                    <Pressable onPress={() => goViewProduct()} style={ styles.back}>
                        <AntDesign name="leftcircle" size={24} color="black" />
                    </Pressable>
                </View>
                <Text style={ styles.banner }>Product aanpassen</Text>
            </View>
            <View>
                <TextInput
                    placeholder='Product naam'
                    placeholderTextColor='grey'
                    onChangeText={(text) => { setproductName(text) }}
                    value={ productName }
                    style={styles.inputField}
                />
                <TextInput
                    placeholder='Product Quantiteit'
                    placeholderTextColor='grey'
                    keyboardType='numeric'
                    onChangeText={(text) => { setproductQuantity(text) }}
                    value={ productQuantity }
                    style={styles.inputField}
                />
                <TextInput
                    placeholder='Product inhoud'
                    placeholderTextColor='grey'
                    onChangeText={(text) => { setproductContent(text) }}
                    value={ productContent }
                    style={styles.inputField}
                />   
                <TextInput
                    placeholder='Product barcode'
                    placeholderTextColor='grey'
                    onChangeText={(text) => { setproductBarcode(text) }}
                    value={ productBarcode }
                    style={[styles.inputField, {backgroundColor: '#dc3545', color: '#ffffff'}]}
                    readOnly={true}
                />    
                {typeOfProduct !== null && (
                    <Picker
                        selectedValue={typeOfProduct}
                        onValueChange={type => 
                            setTypeOfProduct(type)}
                        style={styles.inputField}>
                            <Picker.Item label="Slobber" value="SLOB" />
                            <Picker.Item label="Olie" value="OIL"/>
                            <Picker.Item label="Voedsel" value="FOOD" />
                    </Picker>       
                )}     
            </View>
            <View  style={[styles.save_reset_row, styles.reset_save]}>
                <Pressable onPress={() => reset()} style={ [styles.purple, styles.resetButton] }>
                    <Text style={ styles.buttonRow }>Reset</Text>
                </Pressable>
                <Pressable  style={ styles.saveButton } onPress={() => save()}>
                    <Text style={ styles.buttonRow }>Opslaan</Text>
                </Pressable>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    main_div: {
        marginTop: 60,
        width: '100%',
        paddingHorizontal: '5%'
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    rowAlign: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    width_100: {
        width: '100%'
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
        borderBottomWidth: 0.5,
        width: 300,
        borderRadius: 5,
        paddingStart: 10
    },
    save_reset_row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    reset_save: { 
        marginTop: 20
    },
    purple: {
        backgroundColor: "#68277E"
    },
    resetButton :{
        marginRight: 40,
        marginLeft: 'auto',
        borderRadius: 5,
        paddingLeft: 40,
        paddingTop: 15,
        paddingRight: 40,
        paddingBottom: 15,
    },
    saveButton :{
        alignContent: 'center',
        marginRight: 'auto',
        borderRadius: 5,
        paddingLeft: 40,
        paddingTop: 15,
        paddingRight: 40,
        paddingBottom: 15,
        backgroundColor: '#0881B5'
    },
    buttonRow: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff'
    },
})

export default EditProduct;