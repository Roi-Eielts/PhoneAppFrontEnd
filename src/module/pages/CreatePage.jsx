import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { TextInput, View, Pressable, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

const CreateProduct = () => {
    const [ready, msg, send] = useContext(AppContext)
    const [name, setName] = useState('');
    const [barCode, setBarcode] = useState('');
    const [ammount, setAmmoumt] = useState('');
    const [typeOfProduct, setTypeOfProduct] = useState('');
    const [user, setUser] = useState()

    useEffect(() => {
        getUser();
    })

    const getUser = async () => {
        setUser(JSON.parse(await SecureStore.getItemAsync('USER')));
    }
    const createTheProduct = () => {
        if (name.length == 0 || ammount.length == 0)
            return;
        if (!ready)
            return;
            send(
                JSON.stringify({
                    type: "CREATE_PRODUCT",
                    user: {
                        id: user?.id
                    },
                    product: {
                        name: name,
                        ammount: ammount,
                        type: typeOfProduct
                    }
                })
            )
    }

    return (
        <View>
            <TextInput
                placeholder='Product naam'
                onChangeText={(text) => { setName(text) }}
                value={name}
            />
            <TextInput
                placeholder='Product hoeveelheid'
                onChangeText={(text) => { setAmmoumt(text) }}
                value={ammount}
            />
            <Picker
                selectedValue={typeOfProduct}
                onValueChange={type => setTypeOfProduct(type)}>
                <Picker.Item label="Slobber" value="1" />
                <Picker.Item label="Olie" value="0" />
                <Picker.Item label="Voedsel" value="2" />
            </Picker>
            <Pressable onPress={() => createTheProduct()}>
                <Text>aanmaken</Text>
            </Pressable>
        </View>

    );
}

export default CreateProduct;