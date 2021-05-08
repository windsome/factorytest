import React from 'react';
import { connect, useStore } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  withTheme,
  useTheme,
  Button,
  ButtonGroup,
  Text,
  Tab,
  Input,
} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { meSelect } from '../selectors/auth';
import CardDevice from '../components/widgets/CardDevice';
import ToastModule from '../_natives/ToastModule';

const menu = [
  { title: '厂测', icon: 'settings', color: 'pink', page: 'Factory' },
  { title: '安装', icon: 'pin-drop', color: 'purple', page: 'Factory' },
  { title: '巡检', icon: 'verified', color: 'orange', page: 'Factory' },
  { title: '数据', icon: 'storage', color: 'red', page: 'Factory' },
  // { title: '厂测', icon: 'settings', color:'pink', page: 'Factory'},
  // { title: '安装', icon: 'pin-drop', color:'purple', page: 'Factory'},
  // { title: '巡检', icon: 'verified', color:'orange', page: 'Factory'},
  // { title: '数据', icon: 'storage', color:'red', page: 'Factory'},
];
const data = [
  { image: 'https://ssl.ptlogin2.qq.com/testimg' },
  { image: 'https://ssl.ptlogin2.qq.com/testimg' },
  { image: 'https://ssl.ptlogin2.qq.com/testimg' },
  { image: 'https://ssl.ptlogin2.qq.com/testimg' },
  { image: 'https://ssl.ptlogin2.qq.com/testimg' },
  { image: 'https://ssl.ptlogin2.qq.com/testimg' },
];

function Page(props) {
  const { theme } = useTheme();
  let { navigation, me } = props;
  let [current, setCurrent] = React.useState(0);
  let username = me.nickname || '无名';
  function handleChangePage(index) {
    setCurrent(index);
    let item = menu[index];
    navigation.push(item.page);
  }
  const renderRow = ({ item }) => {
    return <CardDevice data={item} />;
  };

  function testToastModule(msg) {
    ToastModule.show('Awesome ' + msg, ToastModule.SHORT);
  }

  function testToastModuleCb() {
    ToastModule.showCb(
      'Awesome',
      ToastModule.LONG,
      testToastModule,
      testToastModule
    );
  }

  async function testToastModuleAsync() {
    let result = await ToastModule.showAsync('Awesome', ToastModule.SHORT);
    ToastModule.show(JSON.stringify(result), ToastModule.SHORT);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => navigation.push('Mine')}
            >
              <MaterialIcons
                name="person"
                size={40}
                color={theme.colors.primary}
              />
              <Text
                style={{
                  paddingLeft: 10,
                  fontSize: 24,
                  color: theme.colors.primary,
                }}
              >
                {username}
              </Text>
            </TouchableOpacity>
            <MaterialIcons
              name="qr-code-scanner"
              size={40}
              color={theme.colors.primary}
              onPress={testToastModuleCb}
            />
          </View>
          <View
            style={{ backgroundColor: 'grey', height: 1, width: '100%' }}
          ></View>
          <View style={{ width: '100%' }}>
            <Tab
              value={current}
              onChange={handleChangePage}
              indicatorStyle={{
                backgroundColor: 'white',
                height: 3,
              }}
              // variant="primary"
            >
              {menu.map((item, index) => {
                return (
                  <Tab.Item
                    title={item.title}
                    key={index}
                    icon={
                      <MaterialIcons
                        name={item.icon}
                        size={40}
                        color={item.color}
                      />
                    }
                  />
                );
              })}
            </Tab>
          </View>
          <View
            style={{ backgroundColor: 'grey', height: 1, width: '100%' }}
          ></View>
          <View style={{ width: '100%' }}>
            <FlatList
              data={data}
              keyExtractor={(a, index) => index.toString()}
              renderItem={renderRow}
            />
            {/* <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} />
        <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} />
        <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} />
        <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} />
        <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} />
        <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} />
        <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} />
        <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} /> */}
          </View>
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
