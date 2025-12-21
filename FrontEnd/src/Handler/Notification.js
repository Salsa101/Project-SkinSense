import PushNotification, { Importance } from 'react-native-push-notification';

class Notification {
  configure = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  buatChannel = channel => {
    PushNotification.createChannel(
      {
        channelId: channel, // (required)
        channelName: 'My channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  kirimNotifikasiJadwal = (channel, judul, pesan, waktu, id) => {
    PushNotification.localNotificationSchedule({
      id: id,
      channelId: channel,
      title: judul,
      message: pesan,
      date: waktu,
      allowWhileIdle: true,
      repeatType: 'day',
      repeatTime: '1',
    });
  };

  kirimNotifikasiJadwal = (channel, judul, pesan, waktu) => {
    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      channelId: channel,
      title: judul,
      message: pesan, // (required)
      date: waktu, // in 60 secs\
      allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
      repeatType: 'day', // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
      repeatTime: '1',
    });
  };

  kirimNotifikasiExpiredHarian = (judul, pesan, waktu) => {
    PushNotification.localNotificationSchedule({
      channelId: 'expired-product',
      title: judul,
      message: pesan,
      date: waktu,
      allowWhileIdle: true,
      repeatType: 'day',
      repeatTime: '1',
    });
  };

  cancelAllNotifications = () => {
    // Cancel ALL scheduled notifications
    PushNotification.getScheduledLocalNotifications(list => {
      list.forEach(item => {
        if (item.id) {
          PushNotification.cancelLocalNotification(item.id);
        }
      });
    });
  };

  cekSemuaNotifikasi = () => {
    PushNotification.getScheduledLocalNotifications(list => {
      console.log('=== DAFTAR NOTIF TERJADWAL ===');

      list.forEach(n => {
        const waktu = n.date ? new Date(n.date) : null;

        console.log('ID:', n.id);
        console.log('Judul:', n.title);
        console.log('Pesan:', n.message);
        console.log('Repeat:', n.repeatInterval);
        console.log('Waktu:', waktu ? waktu.toString() : 'Tidak ada waktu');
        console.log('=====================================');
      });

      console.log(list);
    });
  };
}

export const notification = new Notification();
