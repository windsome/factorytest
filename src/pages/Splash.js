import React from 'react';
// import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { View } from 'react-native';
import { Button, ButtonGroup, withTheme, Text } from 'react-native-elements';

export default function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
      <Button
                title={'React Native Elements'}
                containerStyle={{
                  width: 200,
                  marginHorizontal: 50,
                  marginVertical: 10,
                }}
              />

    </View>
  );
}
