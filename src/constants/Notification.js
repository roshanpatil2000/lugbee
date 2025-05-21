import React from 'react';
import { Platform, InteractionManager } from 'react-native';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, { Importance } from 'react-native-push-notification';
import { AppConst } from './AppConst';
// import { navigate } from '../route/RootNavigation';
import store from '../store';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import deviceInfoModule from 'react-native-device-info';




export const Firebase = () => {
  // const
  if (requestUserPermission()) {
    getFcmToken();
  } else {
    AppConst.showConsoleLog('Not Authorised Status', enabled);
  }
};


export const checkAsyncFcmToken = async () => {
  const token = await AsyncStorage.getItem("fcmToken");
  if (token) {
    AppConst.setDeviceToken(token);
    return token
  }
  return null
}


export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  console.log('Authorization status:', authStatus);
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
};

export const getFcmToken = async () => {
  const asyncToken = await checkAsyncFcmToken();
  const deviceId = await deviceInfoModule.getUniqueId();
  AppConst.setDeviceId(deviceId);
  AppConst.showConsoleLog("device Id: ", deviceId);
  if (asyncToken) {
    AppConst.showConsoleLog('Async FCM token: ', asyncToken);
    AppConst.setDeviceToken(asyncToken);
    return;
  }
  const enabled = await requestUserPermission();
  if (enabled) {
    let fcmToken = await messaging().getToken();
    AppConst.setDeviceToken(fcmToken);
    AppConst.showConsoleLog('FCM token: ', fcmToken);
    // AppConst.deviceToken=fcmToken
    await AsyncStorage.setItem("fcmToken", fcmToken);
  }
};

export const NotificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );
    showNotification(
      remoteMessage?.notification?.body,
      remoteMessage.notification?.title,
      remoteMessage.data,
    );
    onNotificationPress(remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    console.log('Notification is on Foreground State', remoteMessage);
    showNotification(
      remoteMessage.notification?.title,
      remoteMessage?.notification?.body,
      remoteMessage.data,
    );

  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
      }
    });
};

export const showNotification = (title, message, user = {}) => {
  const channelId = 'default_notification_channel_id';
  console.log("---", title, message, user);
  if (Platform.OS == 'android') {
    PushNotification.localNotification({
      title: title,
      message: message,
      type: user?.type,
      userInfo: user,
      channelId: channelId,
    });
  } else {
    // PushNotification.localNotification({
    //   title: title,
    //   message: message,
    //   type: user?.type,
    //   userInfo: user,
    // });
    PushNotificationIOS.addNotificationRequest({
      title: title,
      body: message,
      isSilent: false,
      userInfo: user,
      id: new Date().getTime().toString()
    });
  }
};

export function createNotificationChannel() {
  if (Platform.OS == 'android') {
    PushNotification.createChannel(
      {
        channelId: 'default_notification_channel_id',
        channelName: 'default_notification_channel_id',
        channelDescription: 'A channel to categorise your notifications',
        // soundName: 'notification_sound.mp3',
        importance: 4,
        vibrate: true,

      },
      created => console.log(`createChannel returned '${created}'`),
    );
  } else {

  }
  return;
}

export const callNotification = () => {
  PushNotification.configure({
    onNotification: notification => {
      console.log('callNotification===>>', notification);
      if (Platform.OS == 'ios') {
        console.log('call notify if===>', notification);
        onNotificationPress(notification);
        // notification?.finish(PushNotificationIOS?.FetchResult?.NoData);
      } else {
        console.log('call notify else==>  ', notification);
        onNotificationPress(notification);
        return;
      }
    },
    popInitialNotification: true,
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  });
};

export const onRemoteNotification = notification => {
  if (Platform.OS == 'ios') {
    const isClicked = notification?.getData()?.userInteraction === 1;

    if (isClicked) {
      console.log('---------- onRemote Notification----------', notification);
      onNotificationPress(notification);
    } else {
      console.log('---------- onRemote Notification----------', notification);
      onNotificationPress(notification);
    }
  } else {
    console.log('---------- onRemote Notification----------', notification);
  }
};

export const onNotificationPress = notification => {
  console.log('onNotification Press', notification);

  InteractionManager.runAfterInteractions(() => {

  });
};