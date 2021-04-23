import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailScreen from './Detail';
const Stack = createStackNavigator();

function HomeScreen ({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app! test!....</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details',{
          itemId: 86,
          otherParam: 'anything you want here',
        })}
      />
      <StatusBar style="auto" />
    </View>
  )
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
