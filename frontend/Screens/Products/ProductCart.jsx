import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

var { width } = Dimensions.get("window");

export const ProductCart = (props) => {
  const { name, price, image, countInStock } = props;
  return (
    <View style={[styles.container]}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: image
            ? image
            : "https://images.unsplash.com/photo-1444851197882-6783757d2f9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
        }}
      />
      <View style={styles.card} />
      <Text style={styles.title}>
        {name.length > 15 ? name.substring(0, 15 - 3) + "..." : name}
      </Text>
      <Text style={styles.price}>{price}$ </Text>
      {countInStock > 0 ? (
        <View style={{ marginBottom: 12 }}>
          <Button title={"Add"} color={"green"} />
        </View>
      ) : (
        <Text style={{ marginTop: 12 }}>currently Unavailable</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 20,
    height: width / 1.7,
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 10,
    alignItems: "center",
    elevation: 8,
    backgroundColor: "white",
  },
  image: {
    width: width / 2 - 20 - 20,
    height: width / 2 - 20 - 30,
    backgroundColor: "transparent",
    position: "absolute",
    top: -5,
    // top : 3
  },
  card: {
    marginBottom: 10,
    height: width / 2 - 20 - 90,
    backgroundColor: "transparent",
    width: width / 2 - 20 - 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "orange",
    marginTop: 5,
  },
});
