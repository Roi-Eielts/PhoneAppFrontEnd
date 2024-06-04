import { useContext, useEffect, useState, React } from 'react';
import { StyleSheet, Text, ScrollView, View, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../AppContext';



const ShowProducts = ({ products }) => {
    const navigation = useNavigation();
    const [ready, msg, send] = useContext(AppContext);


    const deleteProduct = (id) => {
        if (!ready)
            return;
        send(JSON.stringify({
            type: "DELETE_PRODUCT",
            product: {
                id: id
            }
        }));
    }

    const navigateToSignleProduct = (id) => {
        navigation.navigate("SignleProduct", {productId: id})
    }
    return (
        <View style={Styles.container}>
            <View style={Styles.table}>
                <View style={Styles.table_Head}>
                    {/* 1 single row */}
                    <View style={{ width: '40%' }}>
                        <Text style={Styles.table_head_caption}>Product naam</Text>
                    </View>
                    <View style={{ width: '40%' }}>
                        <Text style={Styles.table_head_caption}>Quantiteit</Text>
                    </View>
                    <View style={{ width: '20%' }}>
                        <Text style={Styles.table_head_caption}>Acties</Text>
                    </View>
                </View>
                <ScrollView>
                    {products && products.map((product, index) => (
                        <View key={index} style={Styles.table_body}>
                            <View style={{ width: '40%'}}>
                                <Text style={Styles.table_data}>{product.name}</Text>
                            </View>
                            <View style={{ width: '40%'}}>
                                <Text style={Styles.table_data}>{product.quantity}</Text>
                            </View>
                            <View style={{ width: '20%', flexDirection: 'row', justifyContent: 'space-between', paddingStart: 5, paddingEnd: 10}}>
                                <Pressable onPress={() => navigateToSignleProduct(product.id)}>
                                    <AntDesign name="eye" size={24} color="#0d6efd" />
                                </Pressable>
                                <Pressable onPress={() => deleteProduct(product.id) }>
                                    <AntDesign name="delete" size={24} color="red" />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
const Styles = StyleSheet.create({
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
        fontSize: 20,
        fontWeight: 'bold'
    },
    table_body: {
        marginTop: 2,
        marginBottom: 2,
        paddingStart: '2%',
        flexDirection: 'row',
        borderBottomWidth: 0.5
    },
    table_data: {
        fontSize: 15
    }

});
export default ShowProducts;
