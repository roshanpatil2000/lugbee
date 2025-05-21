/**
 * @format
 */

import {AppRegistry} from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import {name as appName} from './app.json';
import store from './src/store';
import 'react-native-gesture-handler';
import { showNotification } from './src/constants/Notification';
import messaging, { firebase } from '@react-native-firebase/messaging';

const newApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};


AppRegistry.registerComponent(appName, () => newApp);
