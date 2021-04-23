import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    padding: 10
  }
});

export default function Screen ({route, navigation}) {
  const { itemId, otherParam } = route.params || {};
  return (
    <View style={styles.container}>
      <Text>详情页</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <View style={styles.btn}>
      <Button
        title="Go to Details"
        onPress={() => navigation.push('Details', { itemId: Math.floor(Math.random() * 100),})}
      />
      </View>
      <View style={styles.btn}>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      </View>
      <View style={styles.btn}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.btn}>
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
      </View>
      <StatusBar style="auto" />
    </View>
  )
}
