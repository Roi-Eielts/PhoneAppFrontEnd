import { useContext, useEffect, useState, React } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';

const ShowProducts = ({ products }) => {
    useEffect(() => {
        console.info(products)
    })

    return (
        <ScrollView>
            {products && products.map((product, index) => (
                <Text key={index}>{product.name}</Text>
            ))}
        </ScrollView>
    );
}

export default ShowProducts;
