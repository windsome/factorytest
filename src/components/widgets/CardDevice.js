import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';

// implemented without image with header
export default function Widget({ data }) {
  return (
    <Card>
      <Card.Title>CARD WITH DIVIDER</Card.Title>
      <Card.Divider />
      <View>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={{ uri: data.image }}
        />
        <Text style={styles.name}>name</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
});
