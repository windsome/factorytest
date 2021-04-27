import React from 'react';
import { connect } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import {
  withTheme,
  useTheme,
  Button,
  Text,
  ListItem,
} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { meSelect } from '../selectors/auth';

const list1 = [
  {
    title: '设置产品',
    icon: 'av-timer',
    page: 'Details',
  },
  {
    title: '设置密码',
    icon: 'flight-takeoff',
    page: 'Details',
  },
  {
    title: '清除缓存',
    icon: 'fingerprint',
    page: 'Details',
  },
  {
    title: '退出登录',
    icon: 'lightbulb-outline',
    page: 'Details',
  },
];

function Page(props) {
  const { theme } = useTheme();
  let { navigation, me } = props;
  let username = me.nickname || '无名';
  function handleChangePage(item) {
    navigation.push(item.page);
  }
  const renderRow = ({ item }) => {
    return (
      <ListItem onPress={() => handleChangePage(item)} bottomDivider>
        <MaterialIcons name={item.icon} size={20} />
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };

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
          <MaterialIcons name="person" size={64} color={theme.colors.primary} />
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
          name="chevron-right"
          size={20}
          color={theme.colors.secondary}
        />
      </View>
      <View
        style={{ backgroundColor: 'grey', height: 1, width: '100%' }}
      ></View>
      <View style={{ width: '100%' }}>
        <FlatList
          data={list1}
          keyExtractor={(a, index) => index.toString()}
          renderItem={renderRow}
        />
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
    height: 80,
    width: '100%',
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
