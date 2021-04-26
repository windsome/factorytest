import React from 'react';
import { connect, useStore } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
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

function Page(props) {
  const { theme } = useTheme();
  let { navigation, me } = props;
  let [current, setCurrent] = React.useState(0);
  let username = me.nickname || '无名';
  function handleChangePage(index) {
    setCurrent(index);
    navigation.push('Details', {
      itemId: Math.floor(Math.random() * 100),
    });
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <MaterialIcons name="person" size={40} color={theme.colors.primary} />
          <Text
            style={{
              paddingLeft: 10,
              fontSize: 24,
              color: theme.colors.primary,
            }}
          >
            {username}
          </Text>
        </View>
        <MaterialIcons
          name="qr-code-scanner"
          size={40}
          color={theme.colors.primary}
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
          <Tab.Item
            title="厂测"
            icon={<MaterialIcons name="settings" size={40} color="pink" />}
          />
          <Tab.Item
            title="安装"
            icon={<MaterialIcons name="pin-drop" size={40} color="purple" />}
          />
          <Tab.Item
            title="巡检"
            icon={<MaterialIcons name="verified" size={40} color="orange" />}
          />
          <Tab.Item
            title="数据"
            icon={<MaterialIcons name="storage" size={40} color="red" />}
          />
        </Tab>
      </View>
      <View
        style={{ backgroundColor: 'grey', height: 1, width: '100%' }}
      ></View>
      <View style={{ width: '100%' }}>
        <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} />
        <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} />
        <CardDevice data={{ image: 'https://ssl.ptlogin2.qq.com/testimg' }} />
      </View>
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
