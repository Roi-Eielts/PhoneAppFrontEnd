import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { AppContext } from "../AppContext";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

const SignleProduct = ({ route }) => {
    const [ready, msg, send] = useContext(AppContext);
    const navigation = useNavigation();
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState('a');


    useEffect(() => {
        if (!ready)
            return;
        send(JSON.stringify({
            type: "LOAD_PRODUCT",
            product: {
                id: productId
            }
        }));
    }, [ready])

    useEffect(() => {
        const response = JSON.parse(msg);
        if (response?.type === "LOAD_PRODUCT") {
            if (response?.product) {
                setProduct(response?.product)
                setQuantity(response?.product.quantity.toString())
            }
        }
        if (response?.type === "SAVE_QUANTITY") {
            send(JSON.stringify({
                type: "LOAD_PRODUCT",
                product: {
                    id: productId
                    }
                })
            )
            alert("quantiteit is opgeslagen.")
        }
    }, [msg]);

    const goToOverView = () => {
        navigation.navigate("Overview")
    }

    const reset = () => {
        setQuantity(product.quantity.toString())
    }

    const removeOne = () => {
        var fieldQuantity = parseInt(quantity) - 1
        setQuantity(fieldQuantity.toString())
    }
    const addOne = () => {
        var fieldQuantity = parseInt(quantity) + 1
        setQuantity(fieldQuantity.toString())
    }

    const save = () => {
        if (!ready)
            return;
        send(JSON.stringify({
            type: "SAVE_QUANTITY",
            product: {
                id: product.id
            },
            quantity: quantity
        }));
    }

    return (
        <View style={Styles.main_div}>
            <View>
                <Pressable onPress={() => goToOverView()} style={ Styles.back}>
                    <AntDesign name="leftcircle" size={24} color="black" />
                </Pressable>
                <Text style={Styles.banner}>Product:  {product?.name}</Text>
            </View>
            <View style={Styles.second_inner_div}>
                <Text style={Styles.label}>Product naam: </Text>
                <Text style={Styles.fields}>{product?.name}</Text>
                <Text style={Styles.label}>Aantal: </Text>
                <TextInput 
                    keyboardType='numeric'
                    placeholder="Product aantal"
                    style={Styles.fields}
                    onChangeText={(text) => { setQuantity(text) }}
                    value={quantity}
                    />
                <Text style={Styles.label}>Inhoud: </Text>
                <Text style={Styles.fields}>{product?.contents}</Text>
                <Text style={Styles.label}>Barcode: </Text>
                <Text style={Styles.fields}>{product?.barcode}</Text>
                <Text style={Styles.label}>Soort product: </Text>
                <Text style={[Styles.fields, Styles.productType]}>{product?.type}</Text>
            </View>
            <View style={[Styles.row, Styles.addOrRemove]}>
                <Pressable onPress={() => removeOne()} style={ Styles.remove}>
                    <AntDesign name="minus" size={24} color="white" />
                </Pressable>
                <Pressable onPress={() => addOne()} style={ Styles.add}>
                    <AntDesign name="plus" size={24} color="white"/>
                </Pressable>
            </View>
            { product ? product.quantity != quantity ? (
            <View  style={[Styles.save_reset_row, Styles.reset_save]}>
                <Pressable onPress={() => reset()} style={ [Styles.purple, Styles.resetButton] }>
                    <Text style={ Styles.buttonRow }>Reset</Text>
                </Pressable>
                <Pressable  style={ Styles.saveButton } onPress={() => save()}>
                    <Text style={ Styles.buttonRow }>Opslaan</Text>
                </Pressable>
            </View>
            ): (<></>) : (<></>)}
        </View>
    );
}
const Styles = StyleSheet.create({
    reset_save: { 
        marginTop: 20
    },
    back: {
        marginStart: 10
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    save_reset_row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    addOrRemove: {
        marginTop: 250,
    },
    add: {
        borderRadius: 5,
        marginRight: 'auto',
        backgroundColor: "#198754",
        paddingLeft: 50,
        paddingTop: 20,
        paddingRight: 50,
        paddingBottom: 20,
    },
    remove: {
        borderRadius: 5,
        marginLeft: 'auto',
        marginRight: 40,
        backgroundColor: "#dc3545",
        paddingLeft: 50,
        paddingTop: 20,
        paddingRight: 50,
        paddingBottom: 20,
    },
    resetButton :{
        marginRight: 40,
        marginLeft: 'auto',
        borderRadius: 5,
        paddingLeft: 50,
        paddingTop: 20,
        paddingRight: 50,
        paddingBottom: 20,
    },
    saveButton :{
        marginRight: 'auto',
        borderRadius: 5,
        paddingLeft: 50,
        paddingTop: 20,
        paddingRight: 50,
        paddingBottom: 20,
        backgroundColor: '#0881B5'
    },
    main_div: {
        marginTop: 60,
        width: '100%',
        paddingHorizontal: '5%'
    },
    second_inner_div: {
        marginTop: 50
    },
    banner: {
        fontSize: 30,
        marginStart: 'auto',
        marginEnd: 'auto'
    },
    label: {
        fontSize: 25
    },
    fields: {
        marginBottom: 5,
        fontSize: 20,
        paddingLeft: '5%',
        borderBottomWidth: 0.5
    },
    productType: {
        textTransform: 'capitalize',
    },
    purple: {
        backgroundColor: "#68277E"
    },
    buttonRow: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff'
    },
});

export default SignleProduct;
