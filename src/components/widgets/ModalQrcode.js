import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableHighlight,
  Animated,
  Easing,
  PermissionsAndroid,
} from 'react-native';
import { Card, ListItem, Button, Icon, Text } from 'react-native-elements';
import { RNCamera } from 'react-native-camera';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

// implemented without image with header
export default function Widget(props) {
  const { open, title, data, onClose, onCommit } = props;
  const rnCamera = React.useRef(null);
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
    async function init() {
      await requestCameraPermission();
      startAnimation();
    }
    if (open) {
      init();
    }
  }, [open]);

  function barcodeReceived(e) {
    console.log(e.data);
    onCommit(e.data);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open || false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <RNCamera
          ref={rnCamera}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
          onBarCodeRead={barcodeReceived}
        >
          <View style={styles.rectangleContainer}>
            <Text style={styles.modalText}>{title || '标题'}</Text>
            <View style={styles.rectangle} />
            <Animated.View
              style={[styles.border, { transform: [{ translateY: moveAnim }] }]}
            />
            <Text style={styles.rectangleText}>
              将二维码放入框内，即可自动扫描
            </Text>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </RNCamera>
      </View>
    </Modal>
  );
}

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
