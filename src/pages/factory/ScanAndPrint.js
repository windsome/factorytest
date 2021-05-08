import React from 'react';
import { connect, useStore } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Image,
  NativeModules,
} from 'react-native';
import {
  withTheme,
  useTheme,
  Button,
  ButtonGroup,
  Text,
  Tab,
  Input,
  ListItem,
} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { meSelect } from '../../selectors/auth';
import ModalQrcode from '../../components/widgets/ModalQrcode';
import RefView from '../../components/widgets/RefView';
import ViewShot, { captureScreen, captureRef } from 'react-native-view-shot';
import QRCode from 'react-native-qrcode-svg';
import {BluetoothManager,BluetoothEscposPrinter,BluetoothTscPrinter} from 'react-native-bluetooth-escpos-printer';
import { Immersive } from 'react-native-immersive'

let mods = Object.keys(NativeModules)
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

let uri1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
let uri2 = 'https://reactnative.dev/img/tiny_logo.png';

function Step1(props) {
  // 显示产品名称/ID, 测试通过数量, 测试失败数量
  return (
    <View style={{ width: '100%' }}>
      <Text>第一步: 检查产品信息</Text>
      <Text>产品名称: 小蚁检测传感器</Text>
      <Text>产品ID: 1f121231231231231</Text>
      <Text>今天测试数量: 成功10台, 失败2台</Text>
      <Text style={{ color: 'blue' }}>查看已测试历史记录</Text>
    </View>
  );
}

function Step2({ value, onChangeText, onOpenScan }) {
  const { theme } = useTheme();
  // 扫描二维码
  return (
    <View style={{ width: '100%' }}>
      <Text>第二步: 扫码新品二维码获取IMEI</Text>
      <Input
        placeholder="点击右边按钮扫码"
        style={{ width: '100%' }}
        containerStyle={{ paddingHorizontal: 0 }}
        value={value}
        onChangeText={onChangeText}
        rightIcon={
          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={onOpenScan}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={{ paddingLeft: 10, fontSize: 15, color: '#212121' }}>
              扫描芯片二维码
            </Text>
          </TouchableOpacity>
        }
        rightIconContainerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
      />
    </View>
  );
}

function Step3(props) {
  // 显示产品名称/ID, 测试通过数量, 测试失败数量
  function handlePrint() {}
  return (
    <View style={{ width: '100%' }}>
      <Text>第三步: 打印标签</Text>
      <Button
        title="打印标签"
        buttonStyle={{
          backgroundColor: 'rgba(78, 116, 289, 1)',
          borderRadius: 3,
        }}
        containerStyle={{
          width: 280,
          alignSelf: 'center',
          // marginHorizontal: 50,
          // marginVertical: 10,
        }}
        onPress={handlePrint}
      />
    </View>
  );
}

function Step4(props) {
  // 创建设备
  const renderRow = ({ item }) => {
    return (
      <ListItem onPress={null} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{JSON.stringify(item)}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };
  function handlePrint() {}
  return (
    <View style={{ width: '100%' }}>
      <Text>第四步: 创建设备,等待并检查设备上报消息</Text>
      <Button
        title="创建设备"
        buttonStyle={{
          backgroundColor: 'rgba(78, 116, 289, 1)',
          borderRadius: 3,
        }}
        containerStyle={{
          width: 280,
          alignSelf: 'center',
          // marginHorizontal: 50,
          // marginVertical: 10,
        }}
        onPress={handlePrint}
      />
      <View style={{ width: '100%' }}>
        <FlatList
          data={[
            { a: 1, b: 2 },
            { c1: 1, c2: 2 },
          ]}
          keyExtractor={(a, index) => index.toString()}
          renderItem={renderRow}
        />
      </View>
    </View>
  );
}

function Page(props) {
  const { theme } = useTheme();
  let { navigation, me } = props;
  const refView = React.useRef(null);
  const [imgTag, setImgTag] = React.useState(null);

  const [scanDesc, setScanDesc] = React.useState({});

  React.useEffect(()=>{
    Immersive.on()
    Immersive.setImmersive(true)
    return () =>{
      Immersive.off()
      Immersive.setImmersive(false)
    }
  }, [])
  React.useEffect(()=>{
    async function init () {
      let isBtEnable = await BluetoothManager.isBluetoothEnabled();
      // alert(isBtEnable);
      if (!isBtEnable) {
        let r = await BluetoothManager.enableBluetooth();
        let paired = [];
        if(r && r.length>0){
            for(let i=0;i<r.length;i++){
                try{
                    paired.push(JSON.parse(r[i])); // NEED TO PARSE THE DEVICE INFORMATION
                }catch(e){
                    //ignore
                }
            }
        }
        console.log(JSON.stringify(paired))
      }

      let address = await BluetoothManager.getConnectedDeviceAddress();
      console.log('address', address);
      if (address != '00:11:22:33:44:55') {
        // 需要连接
        let s = await BluetoothManager.connect('00:11:22:33:44:55');
        console.log('connect', s);
      }
    }

    init()
  }, []);

  function handleCloseModalScan() {
    setScanDesc({ open: false });
  }
  function handleCommitScan(data) {
    console.log('scan result:', data);
    setScanDesc({ open: false });
  }
  function handleOpenModalScan() {
    console.log('scan open');
    setScanDesc({ open: true });
  }
  const onCapture = React.useCallback((uri) => {
    console.log('uri:', uri);
    setImgTag({ uri });
  }, []);
  const onPressCaptureModalContent = React.useCallback(() => {
    captureRef(refView).then(onCapture);
  }, [onCapture]);
  const onPressCaptureAndPrint = React.useCallback(() => {
    captureRef(refView, { result: 'base64' }).then((uri) => {
      console.log('uri', uri);
      return BluetoothEscposPrinter.printPic(uri, {width: 360})
    });
  }, [onCapture]);

  let source = (imgTag && { uri: imgTag.uri }) || { uri: uri2 };
  // console.log('imgTag', imgTag);
  console.log('source', source, { SCREEN_WIDTH, SCREEN_HEIGHT });
  console.log('NativeModules', mods);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ width: '100%', paddingVertical: 5 }}>
          <Step1 />
        </View>
        <View style={{ backgroundColor: 'grey', height: 1, width: '100%' }} />
        <View style={{ width: '100%', paddingVertical: 5 }}>
          <Step2 onOpenScan={handleOpenModalScan} />
        </View>
        {/* <View style={{ width: '100%', paddingVertical: 5 }}>
        <Step3 />
      </View> */}
        <View style={{ width: '100%', paddingVertical: 5 }}>
          <Step4 />
        </View>
        <View style={{ width: '100%', paddingVertical: 5 }}>
          <ViewShot onCapture={onCapture} captureMode="mount">
            <Text>第五步: 确认测试结果</Text>
          </ViewShot>
          <View
            ref={refView}
            collapsable={false}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: 10,
              backgroundColor: '#fff'
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <QRCode value="http://awesome.link.qr" />
              <Text>awesome.link</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <QRCode value="http://awesome.link.qr" />
              <Text>awesome.link</Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              paddingVertical: 5,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button
              title="成功: 打印标签"
              buttonStyle={{
                backgroundColor: theme.colors.success,
                borderRadius: 3,
              }}
              containerStyle={{
                width: 150,
                alignSelf: 'center',
                // marginHorizontal: 50,
                // marginVertical: 10,
              }}
              onPress={onPressCaptureAndPrint}
            />
            <Button
              title="失败: 打印错误E11"
              buttonStyle={{
                backgroundColor: theme.colors.error,
                borderRadius: 3,
              }}
              // disabled
              containerStyle={{
                width: 150,
                alignSelf: 'center',
                // marginHorizontal: 50,
                // marginVertical: 10,
              }}
            />
          </View>
          <View style={{ width: '100%', backgroundColor: '#eee' }}>
            <Image source={source} style={{ width: 360, height: 160 }} />
            <Image source={{ uri: uri1 }} resizeMode="stretch" />
          </View>
        </View>
        <StatusBar style="auto" />
        <ModalQrcode
          open={scanDesc.open}
          onClose={handleCloseModalScan}
          title="扫描二维码"
          data={scanDesc.data}
          onCommit={handleCommitScan}
        />
      </View>
    </ScrollView>
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
    // flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  header: {
    height: 64,
    width: '100%',
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
