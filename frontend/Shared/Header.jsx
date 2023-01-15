import { Image,  StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Header = () => {
  return (
      <SafeAreaView style ={styles.header}>
        <Text style ={{fontSize : 24, fontWeight : 'bold'}}>Eshop</Text>
        <Image
          source={require("../assets/favicon.png")}
          resizeMode="contain"
          style={{ height: 30 }}
        />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: 'space-between' ,
    marginTop : 40 ,
    alignItems : 'center',
    paddingHorizontal : 20
    // padding : 20
  },
});
