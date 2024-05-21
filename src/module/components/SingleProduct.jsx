import { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { AppContext } from "../AppContext";

const SignleProduct = ({ route }) => {
    const [ready, msg, send] = useContext(AppContext);
    const { productId } = route.params;
    const [product, setProduct] = useState(); 

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
            } 
        }
    }, [msg]);
    return (
        <View>
            <Text></Text>
        </View>
    );
}

export default SignleProduct;
