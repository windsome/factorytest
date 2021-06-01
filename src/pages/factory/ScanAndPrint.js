import React from 'react';
import { connect, useStore } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Dimensions,
  PixelRatio,
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
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import { Immersive } from 'react-native-immersive';

let mods = Object.keys(NativeModules);
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * 打印机相关规格参数
 * 打印图片过程: 
 *  -> printPic(base64encodeStr, options)
 *    -> 将base64转为图片二进制数据: Base64.decode(), BitmapFactory.decodeByteArray()
 *    -> 将图片压缩转换后得到栅格数据 PrintPicture.POS_PrintBMP()
 *    -> 发送打印数据
            sendDataByte(Command.ESC_Init);
            sendDataByte(Command.LF);
            sendDataByte(data);
            sendDataByte(PrinterCommand.POS_Set_PrtAndFeedPaper(30));
            sendDataByte(PrinterCommand.POS_Set_Cut(1));
            sendDataByte(PrinterCommand.POS_Set_PrtInit());
  在这个过程要注意, 图片会经过转换, 为了走纸准确, 图片宽度必须是8的倍数,若宽度超过最大值WIDTH_58,则最好能转成整数WIDTH_58.
  经过转换的图片高度,要是可预计的准确高度, 确保走纸准确.
  为此, 我们取图片时, 宽度取成WIDTH_58的倍数. 简化起见:
  图片宽度为 width = WIDTH_58 = 384
  图片高度为 height = (35+2)*8 - 30 = 266
 */
const WIDTH_58 = 384; // 打印纸实际使用宽度像素数, 8px/mm, 实际使用48mm,对应58mm规格
const WIDTH_80 = 576; // 打印纸实际使用宽度像素数, 8px/mm, 实际使用72mm,对应80mm规格
const PAPER_HEIGHT = 35; // 35mm
const PAPER_GAP = 2; // 2mm
const PAPER_WIDTH = 58; // 58mm, 打印纸规格宽度(打印机支持的宽度), 一般为58mm, 80mm

const IMAGE_WIDTH = WIDTH_58;
const IMAGE_HEIGHT = (35+2)*8-80;

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
  let textRef = React.useRef(null);
  React.useEffect(()=>{
    if (textRef.current)
      textRef.current.focus();
  },[])
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
            <Text ref={textRef} collapsable={false} style={{ paddingLeft: 10, fontSize: 15, color: '#212121' }}>
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

  React.useEffect(() => {
    Immersive.on();
    Immersive.setImmersive(true);
    return () => {
      Immersive.off();
      Immersive.setImmersive(false);
    };
  }, []);
  React.useEffect(() => {
    async function init() {
      let isBtEnable = await BluetoothManager.isBluetoothEnabled();
      // alert(isBtEnable);
      if (!isBtEnable) {
        let r = await BluetoothManager.enableBluetooth();
        let paired = [];
        if (r && r.length > 0) {
          for (let i = 0; i < r.length; i++) {
            try {
              paired.push(JSON.parse(r[i])); // NEED TO PARSE THE DEVICE INFORMATION
            } catch (e) {
              //ignore
            }
          }
        }
        console.log(JSON.stringify(paired));
      }

      let address = await BluetoothManager.getConnectedDeviceAddress();
      console.log('address', address);
      if (address != '00:11:22:33:44:55') {
        // 需要连接
        let s = await BluetoothManager.connect('00:11:22:33:44:55');
        console.log('connect', s);
      }
    }

    init();
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
  let ratio = PixelRatio.get();
  const onPressCaptureAndPrint = React.useCallback(() => {
    captureRef(refView, {
      result: 'base64',
      width: IMAGE_WIDTH / ratio,
      height: IMAGE_HEIGHT/ ratio,
    }).then((uri) => {
      console.log('uri', uri);
      return BluetoothEscposPrinter.printPic(uri, {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
      });
    });
  }, [onCapture]);
  let imgContainerWidth = SCREEN_WIDTH - 20;
  let imgContainerHeight = ((SCREEN_WIDTH -20) / IMAGE_WIDTH) * IMAGE_HEIGHT;

  let source = (imgTag && { uri: imgTag.uri }) || { uri: uri2 };
  // console.log('imgTag', imgTag);
  console.log('screen', { width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
  console.log('container', { width: imgContainerWidth, height: imgContainerHeight });
  console.log('image', { width: IMAGE_WIDTH, height: IMAGE_HEIGHT });
  console.log('image1', { width1: IMAGE_WIDTH / ratio, height1: IMAGE_HEIGHT/ ratio });

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
              borderColor:'#000',
              borderWidth:2,
              // justifyContent: 'space-around',
              justifyContent: "space-between",
              // padding: 10,
              backgroundColor: '#fff',
              width: imgContainerWidth,
              // height: imgContainerHeight,
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
