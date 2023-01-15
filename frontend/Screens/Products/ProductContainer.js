import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet, 
  Text,
  ActivityIndicator,
  FlatList,
} from "react-native";

import data from "../../assets/data/products.json";
import { ProductList } from "./ProductList";
export const ProductsContainer = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(data);

    return () => {
      setProducts([]);
    };
  }, []);
  return (
    <View style={{ marginTop: 5 , marginBottom : 200 }}>
      <FlatList
        numColumns={2}
        data={products}
        renderItem={({ item }) => <ProductList key={item.id} item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
