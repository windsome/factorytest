import { StatusBar } from 'expo-status-bar';
import React from 'react';
// import { StyleSheet, Text, View, Button } from 'react-native';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Button, ButtonGroup, withTheme, Text } from 'react-native-elements';

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
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
      console.log('foucus', itemId);
      // Do something
    });

    return unsubscribe;
  }, [navigation]);
  let width = Dimensions.get('window').width;
  let height = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      <Text>详情页</Text>
      <Text>{`w:${width},h:${height}`}</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <View style={styles.btn}>
      <Button
        title="Go to Details"
        containerStyle={{
          width: 200,
          marginLeft: 50,
          marginRight: 250,
          marginTop: 10,
        }}
        onPress={() => navigation.push('Details', { itemId: Math.floor(Math.random() * 100),})}
      />
      </View>
      <Button
        title="ScanAndPrint"
        buttonStyle={{
          backgroundColor: 'rgba(78, 116, 289, 1)',
          borderRadius: 3,
        }}
        containerStyle={{
          width: 392.7,
          // marginHorizontal: 50,
          // marginVertical: 10,
        }}
        onPress={() => navigation.push('ScanAndPrint')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <View style={styles.btn}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.btn}>
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
      </View>
      <View style={styles.btn}>
      <Button
        title="Update the title"
        onPress={() => navigation.setOptions({ title: 'Updated!' })}
      />
      </View>
      <StatusBar style="auto" />
    </View>
  )
}
