/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import 'react-native-vision-camera';
import 'react-native-vision-camera-face-detector';

AppRegistry.registerComponent(appName, () => App);
