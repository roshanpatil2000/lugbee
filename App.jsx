import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, NativeModules, StatusBar, LogBox, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Settings } from 'react-native-fbsdk-next';
import Navigator from './src/route/index';
import Toast from 'react-native-toast-message';
import { SafeAreaCustomView } from './src/styles/SafeAreaCustomView';
import { colors } from './src/styles/color';
import { statusBar } from './src/styles/CommonStyling';
import { AppConst } from './src/constants/AppConst';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from './src/components/custom/CustomFields';
import { ExecuteOnlyOnAndroid } from './src/screens/Dashboard/HomeScreen';
import { getAppVersion } from './src/store/actions/AppAction';
import { Set_AppVersion_Data } from './src/store/types';
import AppUpdateModal from './src/components/Modals/AppUpdateModal';
import { firebase } from '@react-native-firebase/analytics';
import { callNotification, createNotificationChannel, getFcmToken, NotificationListener } from './src/constants/Notification';

const App = () => {
  const loading = useSelector(state => state.app.loading);
  const AppStatus = useSelector(state => state.app.app_status);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     androidClientId: '572723525144-uhc7i371sc0ikudr4cve7aucs0a65bv9.apps.googleusercontent.com',
  //     offlineAccess: true,
  //     webClientId: '572723525144-l0fl5hiclt95gn8tghnh0mlf8iaac1lt.apps.googleusercontent.com',
  //     iosClientId: "572723525144-01lh3i24bii9cbtaq88p17ml6ac17sg1.apps.googleusercontent.com",
  //     // iosClientId: "1008850210985-qrvrldprssf7vkiu89ctll6qkj4o0i18.apps.googleusercontent.com"
  //   });
  //   Settings.setAppID('3712704228793609');

  //   const reactNativeFirebaseConfig = {
  //     apiKey: "AIzaSyDFeyNosQUaGmD4oIlE9g2mKFYLMn_U6pk",
  //     authDomain: '',
  //     databaseURL: "https://lugbee-services-default-rtdb.firebaseio.com",
  //     projectId: "lugbee-services",
  //     storageBucket: "lugbee-services.appspot.com",
  //     messagingSenderId: "572723525144",
  //     appId: "1:572723525144:ios:83837530eb5f0d0e52756d",
  //     clientId: "572723525144-01lh3i24bii9cbtaq88p17ml6ac17sg1.apps.googleusercontent.com"
  //   };


  //   // firebase.initializeApp(reactNativeFirebaseConfig)

  //   getFcmToken();
  //   callNotification();
  //   createNotificationChannel();
  //   NotificationListener();
  // }, []);

  useEffect(() => {
    if (AppStatus && (AppStatus == 2 || AppStatus == 3)) {
      getAppVersion().then(res => {
        // console.log("App useeffect res", res)
        if (res?.Status == 200 || res?.status == 200) {
          let data = res[Platform.OS]
          let version = data.major + "." + data.minor + "." + data.patch
          AppConst.showConsoleLog('App Build', AppConst.appBuild);
          console.log("version build: ", data.build)
          dispatch({ type: Set_AppVersion_Data, payload: { ...data, version } })
          if (AppConst.appBuild && AppConst.appBuild < data.build) {
            setUpdateAvailable({ ...data, version })
          }
        }
      })
    }
    getFcmToken();
  }, [AppStatus])

  return (
    <SafeAreaCustomView
      style={styles.container}
      barStyle={statusBar.light}
      backgroundColor={colors.primary}
    >
      <Navigator />
      <Toast />
      {loading && <Loader />}
      {updateAvailable &&
        <AppUpdateModal
          close={() => setUpdateAvailable(null)}
          updateData={updateAvailable}
        />
      }
    </SafeAreaCustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
});

export default App;
