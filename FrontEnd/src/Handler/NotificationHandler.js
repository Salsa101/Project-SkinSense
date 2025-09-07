import PushNotification from 'react-native-push-notification';

export const configureNotifications = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  // Android 8.0+ harus ada channel
  PushNotification.createChannel(
    {
      channelId: "routine-reminder", // unique id
      channelName: "Routine Reminder",
      channelDescription: "Notifikasi untuk pengingat rutin",
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );
};