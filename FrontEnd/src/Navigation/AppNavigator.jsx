import { React, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen';
import SignUp from '../Screens/SignUp';
import SignIn from '../Screens/SignIn';
import AccountOption from '../Screens/AccountOption';
import ProfilePage from '../Screens/ProfilePage';
import Calendar from '../Screens/Calendar';
import EditRoutine from '../Screens/EditRoutine';
import RNBootSplash from 'react-native-bootsplash';

import api from '../api';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/home');

        if (response.data?.user) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('AccountOption');
        }
      } catch (error) {
        console.log('Auth check failed:', error.message);
        setInitialRoute('AccountOption');
      }
    };

    checkAuth();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer
      onReady={async () => await RNBootSplash.hide({ fade: true })}
    >
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="AccountOption"
          component={AccountOption}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfilePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Calendar"
          component={Calendar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditRoutine"
          component={EditRoutine}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
