import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { TextInput, View, Pressable, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';


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

    // first run for getting user
    useEffect(() => {
        if(!ready)
            return;
        getUser();
    }, [ready])
    //if user is there
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
    const createTheProduct = () => {
        if (name.length == 0 || contents.length == 0 || typeOfProduct == 0 )
            return;
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
                <Picker.Item label="Slobber" value="1" />
                <Picker.Item label="Olie" value="0" />
                <Picker.Item label="Voedsel" value="2" />
            </Picker>
            <Pressable onPress={() => createTheProduct()} style={styles.createButton}>
                <Text style={styles.createButtonText}>aanmaken</Text>
            </Pressable>
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
        fontSize: 20
    },
    createButton: {
        marginEnd: 'auto',
        marginStart: 'auto'
    },
    back: {
        marginStart: 10
        // marginEnd: 'auto',
        // marginStart: 'auto'
    },
    header: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})

export default CreateProduct;