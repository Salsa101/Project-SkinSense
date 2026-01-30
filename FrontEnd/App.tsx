import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import AppNavigator from './src/Navigation/AppNavigator';
import { notification } from './src/Handler/Notification';
import { fetchAndScheduleNotifications } from './src/Handler/FetchNotification';

const App = () => {
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
    };

    notification.configure();
    notification.buatChannel('1');
    requestPermission();
    fetchAndScheduleNotifications();
  }, []);

  return <AppNavigator />;
};

export default App;
