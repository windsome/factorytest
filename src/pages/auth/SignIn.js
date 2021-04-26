import React from 'react';
import { connect, useStore } from 'react-redux';
import { StyleSheet, Dimensions, View, ToastAndroid } from 'react-native';
import {
  Button,
  ButtonGroup,
  withTheme,
  Text,
  Input,
} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { loginByPassword } from '../../modules/auth';
import {
  meSelect,
  authFetchingSelect,
  authErrorSelect,
} from '../../selectors/auth';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const Toast = ({ visible, message }) => {
  if (visible) {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    return null;
  }
  return null;
};

function Page(props) {
  const store = useStore();
  const [toast, setToast] = React.useState({ visible: false, message: '' });
  React.useEffect(() => setToast({ visible: false, message: '' }), []);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function login() {
    setToast({ visible: true, message: '正在登录...' });
    let user = await props.loginByPassword({ phone: username, password });
    if (!user) {
      let error = authErrorSelect(store);
      let message = error && error.message;
      setToast({ visible: true, message: '登录失败!' + message });
    } else {
      setToast({ visible: true, message: '登录成功!' });
    }
  }

  let usernameEmpty = username.trim().length == 0;
  let passwordEmpty = password.trim().length == 0;
  let empty = usernameEmpty || passwordEmpty;
  let fetching = props.authFetching;
  let disableSubmit = empty || fetching;

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          paddingHorizontal: 47.5,
          display: 'flex',
        }}
      >
        <Text style={{ paddingTop: 21, fontSize: 24 }}>账号密码登录</Text>
        <Input
          placeholder="输入用户名"
          style={{ width: '100%' }}
          containerStyle={{ paddingHorizontal: 0, marginTop: 42 }}
          value={username}
          onChangeText={setUsername}
          rightIcon={
            !usernameEmpty ? (
              <MaterialIcons
                name="cancel"
                size={16}
                color="#ccc"
                onPress={() => setUsername('')}
              />
            ) : null
          }
          rightIconContainerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
        />
        <Input
          placeholder="输入密码"
          style={{ width: '100%' }}
          containerStyle={{ paddingHorizontal: 0, marginTop: 42 }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          rightIcon={
            !passwordEmpty ? (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons
                  name="cancel"
                  size={16}
                  color="#ccc"
                  onPress={() => setPassword('')}
                />
                <Text
                  style={{ paddingLeft: 10, fontSize: 15, color: '#212121' }}
                  onPress={() =>
                    setToast({ visible: true, message: '暂不支持此操作!' })
                  }
                >
                  找回密码
                </Text>
              </View>
            ) : null
          }
          rightIconContainerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
        />
        <Button
          title="登录"
          containerStyle={{
            width: 280,
            marginTop: 20,
            alignSelf: 'center',
          }}
          disabled={disableSubmit}
          onPress={login}
        />
        <Toast visible={toast.visible} message={toast.message} />
      </View>
      <View></View>
    </View>
  );
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props),
    authFetching: authFetchingSelect(state, props),
  };
};
const mapActionsToProps = {
  loginByPassword,
};

export default connect(mapStateToProps, mapActionsToProps)(Page);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    width: '100%',
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    // justifyContent: 'space-around',
  },
});
