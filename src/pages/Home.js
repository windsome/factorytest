import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const key='windsome';

export default function HomeScreen ({navigation}) {

  async function save () {
    await SecureStore.setItemAsync(key, JSON.stringify({time: new Date().getTime()}));
  }

  async function read () {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      alert('No values stored under that key.');
    }
  }


  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app! test!....</Text>
      <Button
        title="save store"
        onPress={save}
      />
      <Button
        title="read store"
        onPress={read}
      />
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
