import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { ProductCart } from "./ProductCart";

var { width } = Dimensions.get("window");

export const ProductList = ({ item }) => {
  return (
    <TouchableOpacity style={{ width: "50%"  }}>
      <View style={{ width: width / 2, backgroundColor: "#eee" }}>
      <ProductCart {...item} />
      </View>
    </TouchableOpacity>
  );
};
