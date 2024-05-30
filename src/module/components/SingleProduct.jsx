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

    return (
        <View style={Styles.main_div}>
            <View>
                <Pressable onPress={() => goToOverView()} style={ Styles.back}>
                    <AntDesign name="leftcircle" size={24} color="black" />
                </Pressable>
                <Text style={Styles.banner}>product:  {product?.name}</Text>
            </View>
            <View style={Styles.second_inner_div}>
                <Text style={Styles.label}>product naam: </Text>
                <Text style={Styles.fields}>{product?.name}</Text>
                <Text style={Styles.label}>aantal: </Text>
                <TextInput 
                    keyboardType='numeric'
                    placeholder="Product aantal"
                    style={Styles.fields}
                    onChangeText={(text) => { setQuantity(text) }}
                    value={quantity}
                    />
                <Text style={Styles.label}>inhoud: </Text>
                <Text style={Styles.fields}>{product?.contents}</Text>
                <Text style={Styles.label}>barcode: </Text>
                <Text style={Styles.fields}>{product?.barcode}</Text>
                <Text style={Styles.label}>soort product: </Text>
                <Text style={[Styles.fields, Styles.productType]}>{product?.type}</Text>
            </View>
            <View style={[Styles.row, Styles.addOrRemove]}>
                <Pressable onPress={() => removeOne()} style={ Styles.remove}>
                    <AntDesign name="minus" size={24} color="white" />
                </Pressable>
                <Pressable onPress={() => addOne()} style={ Styles.add}>
                    <AntDesign name="plus" size={24} color="white" />
                </Pressable>
            </View>
            { product ? product.quantity != quantity ? (
            <View>
                <Pressable onPress={() => reset()} style={ Styles.back}>
                    <Text>Reset</Text>
                </Pressable>
                {/* <Pressable onPress={() => goToOverView()} style={ Styles.back}>
                    <Text>Opslaan</Text>
                </Pressable> */}
            </View>
            ): (<></>) : (<></>)}
        </View>
    );
}
const Styles = StyleSheet.create({
    back: {
        marginStart: 10
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    addOrRemove: {
        marginTop: 20,
    },
    add: {
        marginRight: 'auto',
        backgroundColor: "#198754",
        paddingLeft: 40,
        paddingTop: 15,
        paddingRight: 40,
        paddingBottom: 15,
    },
    remove: {
        marginLeft: 'auto',
        marginRight: 40,
        backgroundColor: "#dc3545",
        paddingLeft: 40,
        paddingTop: 15,
        paddingRight: 40,
        paddingBottom: 15,
    },
    main_div: {
        marginTop: 60,
        width: '100%',
        paddingHorizontal: '5%'
    },
    second_inner_div: {
        marginTop: '2%'
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
    }
});

export default SignleProduct;
