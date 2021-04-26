import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailScreen from './pages/Detail';
import HomeScreen from './pages/Home';
import SplashScreen from './pages/Splash';
import SignInScreen from './pages/auth/SignIn';
import ScanAndPrintScreen from './pages/ScanAndPrint';
import { authByLocalStore } from './modules/auth';
import { meSelect, authLoadingSelect } from './selectors/auth';

const Stack = createStackNavigator();

function LogoTitle (props) {
  return (
    <Image
      style={{ width: 30, height: 30 }}
      source={require('./assets/images/sharks.png')}
    />
  );
}

function RootNavigator(props) {
  let { authLoading, me } = props;
  React.useEffect(() => {
    props.authByLocalStore();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {authLoading ? (
          // We haven't finished checking for the token yet
          <Stack.Screen name="Splash" component={SplashScreen} />
        ): (me == null) ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: '登录',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: !me ? 'pop' : 'push',
              }}
            />
        ) : (
            // User is signed in
          <>
            <Stack.Screen name="Home" options={{title: 'My Home'}} component={HomeScreen} />
            <Stack.Screen name="ScanAndPrint" component={ScanAndPrintScreen} />
            <Stack.Screen name="Details" component={DetailScreen} options={({ route }) => ({ 
              title: 'Detail '+route.params?.itemId,
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                // alignSelf:'center'
              },
              headerTitle: props => <LogoTitle {...props}/>,
              headerRight: () => (
                <Button
                  onPress={() => alert('This is a button!')}
                  title="Info"
                  // color="#f4511e"
                />
              ),
            })} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// export default RootNavigator;
// export default withAuth(RootNavigator);

const mapStateToProps = (state, props) => {
  return {
    authLoading: authLoadingSelect(state, props),
    me: meSelect(state, props)
  };
};
const mapActionsToProps = {
  authByLocalStore
};

export default connect(mapStateToProps, mapActionsToProps)(RootNavigator);
