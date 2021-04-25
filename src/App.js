import React, { useState, useReducer, useEffect } from 'react';
import { ThemeProvider } from 'react-native-elements';
import { useColorScheme } from 'react-native-appearance';
import {
  ThemeReducer,
  initialState,
  ThemeReducerContext,
} from './helpers/ThemeReducer';
import RootNavigator from './RootNavigator';
import AppLoading from './AppLoading';

function App () {
  const [ThemeState, dispatch] = useReducer(ThemeReducer, initialState);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (colorScheme === 'dark') {
      dispatch({ type: 'set-theme', payload: 'dark' });
    }
  }, [colorScheme]);

  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return (
      <AppLoading
        onFinish={() => {
          setIsReady(true);
        }}
        onError={console.warn}
      />
    );
  }

  return (
    <ThemeReducerContext.Provider value={{ ThemeState, dispatch }}>
      <ThemeProvider useDark={ThemeState.themeMode === 'dark' ? true : false}>
        <RootNavigator />
      </ThemeProvider>
    </ThemeReducerContext.Provider>
  );
};

export default App;
// export default withAuth(App);