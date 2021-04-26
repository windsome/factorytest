import React from 'react';
import { connect, useStore } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  ButtonGroup,
  withTheme,
  Text,
  Input,
} from 'react-native-elements';
import { meSelect } from '../selectors/auth';

function Page(props) {
  let { navigation } = props;
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app! test!....</Text>
      <Button
        title="Go to Details"
        onPress={() =>
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          })
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props),
  };
};
const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(Page);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
