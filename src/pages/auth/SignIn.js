import React from 'react';
import { connect, useStore } from 'react-redux';
import { StyleSheet, Dimensions, View, ToastAndroid } from 'react-native';
import { Button, ButtonGroup, withTheme, Text, Input } from 'react-native-elements';
import { loginByPassword } from '../../modules/auth';
import { meSelect, authFetchingSelect, authErrorSelect } from '../../selectors/auth';

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
  const [toast, setToast] = React.useState({visible: false, message: ''});
  React.useEffect(() => setToast({visible: false, message: ''}), []);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function login () {
    setToast({visible: true, message: '正在登录...'});
    let user = await props.loginByPassword({phone: username, password});
    if (!user) {
      let error = authErrorSelect(store);
      let message = error && error.message;
      setToast({visible: true, message: '登录失败!'+message});
    } else {
      setToast({visible: true, message: '登录成功!'});
    }
  }

  let empty = username.trim().length == 0 || password.trim().length == 0
  let fetching = props.authFetching;
  let disableSubmit = empty || fetching;

  return (
    <View style={styles.container}>
      <View style={{width:'100%', paddingHorizontal: 20, alignItems:'flex-start', display: 'flex'}}>
        <Text style={{paddingTop: 21, fontSize: 24}}>账号密码登录</Text>
        <Input
          placeholder="输入用户名"
          style={{width:'100%'}}
          value={username}
          onChangeText={setUsername}
        />
        <Input
          placeholder="输入密码"
          style={{width:'100%'}}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="登录" 
          containerStyle={{
            width: 280,
            marginHorizontal: 30,
            marginVertical: 10,
          }}
        disabled={disableSubmit} onPress={login} />
        <Toast visible={toast.visible} message={toast.message} />
      </View>
      <View></View>
    </View>
  );
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props),
    authFetching: authFetchingSelect(state, props)
  };
};
const mapActionsToProps = {
  loginByPassword
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