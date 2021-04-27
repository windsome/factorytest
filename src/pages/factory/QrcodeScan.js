import React from 'react';
// import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { Button, ButtonGroup, withTheme, Text } from 'react-native-elements';

function Page() {
  const rnCamera = useRef(null);
  let [moveAnim, setMoveAnim] = React.useState(0);
  React.useEffect(() => {
    function startAnimation() {
      setMoveAnim(0);
      Animated.timing(moveAnim, {
        toValue: -200,
        duration: 1500,
        easing: Easing.linear,
      }).start(startAnimation);
    }
  }, []);

  function barcodeReceived(e) {
    console.log(e.data);
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={rnCamera}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        onBarCodeRead={barcodeReceived}
      >
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
          <Animated.View
            style={[styles.border, { transform: [{ translateY: moveAnim }] }]}
          />
          <Text style={styles.rectangleText}>
            将二维码放入框内，即可自动扫描
          </Text>
        </View>
      </RNCamera>
    </View>
  );
}

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 200,
    width: 200,
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  rectangleText: {
    flex: 0,
    color: '#fff',
    marginTop: 10,
  },
  border: {
    flex: 0,
    width: 200,
    height: 2,
    backgroundColor: '#00FF00',
  },
});
