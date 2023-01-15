import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ProductsContainer } from './Screens/Products/ProductContainer';
import { Header } from './Shared/Header';

export default function App() {
  return (
    <View>
      <Header />
      <ProductsContainer />
    </View>
  );
}


