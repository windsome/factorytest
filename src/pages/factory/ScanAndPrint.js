import React from 'react';
import { connect, useStore } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
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

function Step1(props) {
  // 显示产品名称/ID, 测试通过数量, 测试失败数量
  return (
    <View style={{ width: '100%' }}>
      <Text>产品名称</Text>
      <Text>产品ID</Text>
      <Text>成功设备数量: 10, 失败数量: 2</Text>
    </View>
  );
}

function Step2({ value, onChangeText, onOpenScan }) {
  const { theme } = useTheme();
  // 扫描二维码
  return (
    <View style={{ width: '100%' }}>
      <Text>扫码新品二维码获取IMEI</Text>
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
      <Text>打印标签</Text>
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
      <Text>创建设备</Text>
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

  const [scanDesc, setScanDesc] = React.useState({});
  function handleCloseModalScan() {
    setScanDesc({ open: false });
  }
  function handleCommitScan(data) {
    console.log('scan result:', data);
  }
  function handleOpenModalScan() {
    console.log('scan open');
    setScanDesc({ open: true });
  }

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', paddingVertical: 5 }}>
        <Step1 />
      </View>
      <View style={{ backgroundColor: 'grey', height: 1, width: '100%' }} />
      <View style={{ width: '100%', paddingVertical: 5 }}>
        <Step2 onOpenScan={handleOpenModalScan} />
      </View>
      <View style={{ width: '100%', paddingVertical: 5 }}>
        <Step3 />
      </View>
      <View style={{ width: '100%', paddingVertical: 5 }}>
        <Step4 />
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
          title="成功完成"
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
        />
        <Button
          title="测试失败"
          buttonStyle={{
            backgroundColor: theme.colors.error,
            borderRadius: 3,
          }}
          disabled
          containerStyle={{
            width: 150,
            alignSelf: 'center',
            // marginHorizontal: 50,
            // marginVertical: 10,
          }}
        />
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
