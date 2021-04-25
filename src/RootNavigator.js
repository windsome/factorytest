import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailScreen from './pages/Detail';
import HomeScreen from './pages/Home';
import SplashScreen from './pages/Splash';
import SignInScreen from './pages/SignIn';
import withAuth, {AuthContext} from './withAuth';
import ScanAndPrintScreen from './pages/ScanAndPrint';

const Stack = createStackNavigator();

function LogoTitle (props) {
  return (
    <Image
      style={{ width: 30, height: 30 }}
      source={require('./assets/images/sharks.png')}
    />
  );
}

function RootNavigator({authState}) {
  const authActions = React.useContext(AuthContext);

  console.log('authState:', authState, authActions);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {authState?.isLoading ? (
          // We haven't finished checking for the token yet
          <Stack.Screen name="Splash" component={SplashScreen} />
        ): (authState?.userToken == null) ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: authState.isSignout ? 'pop' : 'push',
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
export default withAuth(RootNavigator);