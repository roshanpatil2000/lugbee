import Permissions from 'react-native-permissions';
import { Platform, Alert, NativeModules, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const isAndroidDevice = (Platform.OS == 'android');
const cameraPermission = `Would Like to Access the Camera. Go to Settings, allow camera permission.`;
const microphonePermission = `Would Like to Access the Microphone. Go to Settings, allow microphone permission.`;
const galleryPermission = `Would Like to Access the Photo. 'Go to Settings, allow photo permission.`;
const storagePermission = `Would Like to Access the storage. Go to Settings, allow storage permission.`;
const locationAppPermissionMsg = `Go to Settings, Allow this app to access your location.`;
const locationEnablePermissionMsg = `Turn On Device Location to Access Current Location`;


export const cameraPermissionAlert = (callback) => {

    Permissions.request(!isAndroidDevice ? Permissions.PERMISSIONS.IOS.CAMERA : Permissions.PERMISSIONS.ANDROID.CAMERA).then(result => {
        console.log('CAMERAPermissionAlert:', result);
        if (result === 'granted') {
            //success
            callback(1);
        } else if (result === 'denied') {
            //denied
            callback(0);
        } else {
            AsyncStorage.getItem('CameraAsked')
                .then((value) => {
                    if (value) {
                        showPermissionSettingAlert('Permission', cameraPermission, callback);
                    } else {
                        AsyncStorage.setItem('CameraAsked', JSON.stringify(true))
                            .then(() => {
                                callback(2);
                            });
                    }
                });

        }
    });
}


export const microphonePermissionAlert = (callback) => {

    Permissions.request(!isAndroidDevice ? Permissions.PERMISSIONS.IOS.MICROPHONE : Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
        console.log('MICROPHONE:', result);
        if (result === 'granted') {
            //success
            callback(1);
        } else if (result === 'denied') {
            //denied
            callback(0);
        } else {
            AsyncStorage.getItem('MicrophoneAsked')
                .then((value) => {
                    if (value) {
                        showPermissionSettingAlert('Permission', microphonePermission, callback);
                    } else {
                        AsyncStorage.setItem('MicrophoneAsked', JSON.stringify(true))
                            .then(() => {
                                callback(2);
                            });
                    }
                });

        }
    });
}

export const galleryPermissionAlert = (callback) => {
    Permissions.request(!isAndroidDevice ? Permissions.PERMISSIONS.IOS.PHOTO_LIBRARY : Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
        console.log('READ_EXTERNAL_STORAGE:', result);
        if (result === 'granted') {
            //success
            callback(1);
        } else if (result === 'denied') {
            //denied
            callback(0);
        } else {

            AsyncStorage.getItem('GalleryAsked')
                .then((value) => {
                    console.log('Gallery Asked value:', value);
                    if (value) {
                        showPermissionSettingAlert('Permission', !isAndroidDevice ? galleryPermission : storagePermission, callback);
                    } else {
                        AsyncStorage.setItem('GalleryAsked', JSON.stringify(true))
                            .then(() => {
                                callback(2);
                            });
                    }
                });

        }
    });
}

export const storagePermissionAlert = (callback) => {
    if (!isAndroidDevice) {
        callback(1);
    } else {
        Permissions.request(Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
            console.log('READ_EXTERNAL_STORAGE:', result);
            if (result === 'granted') {
                //success
                callback(1);
            } else if (result === 'denied') {
                //denied
                callback(0);
            } else {
                showPermissionSettingAlert('Permission', storagePermission, callback);
            }
        });
    }

}


export const showPermissionAlert = (title, msg, callback) => {
    Alert.alert(
        title,
        msg,
        [
            { text: 'Cancel', onPress: () => callback(0), style: 'cancel' },
            {
                text: 'Settings', onPress: () => {
                    callback(2);
                    if (isAndroidDevice) {
                        NativeModules.OpenSettings.openNetworkSettings(data => {
                            console.log('call back data', data);
                        });
                    } else {
                        Linking.canOpenURL('app-settings:').then(supported => {
                            if (!supported) {
                                console.log('Can\'t handle settings url');
                            } else {
                                return Linking.openURL('app-settings:');
                            }
                        }).catch(err => console.error('An error occurred', err));
                    }
                }
            },
        ],
        { cancelable: false }
    )
}

const showPermissionSettingAlert = (title, msg, callback) => {
    Alert.alert(
        title,
        msg,
        [
            {
                text: 'Cancel', onPress: () => {
                    callback(2);

                }
            },
            {
                text: 'Settings', onPress: () => {
                    callback(2);
                    if (isAndroidDevice) {
                        NativeModules.OpenSettings.openNetworkSettings(data => {
                            console.log('call back data', data);
                        });
                    } else {
                        Linking.canOpenURL('app-settings:').then(supported => {
                            if (!supported) {
                                console.log('Can\'t handle settings url');
                            } else {
                                return Linking.openURL('app-settings:');
                            }
                        }).catch(err => console.error('An error occurred', err));
                    }
                }
            },
        ],
        { cancelable: false }
    )
}



export const getUniqueId = () => {
    // return Platform.OS == 'ios' ? DeviceInfo.getUniqueId() : DeviceInfo.getAndroidId();
    var now = new Date();

    var timestamp = now.getFullYear().toString(); // 2011
    timestamp += (now.getMonth < 9 ? '0' : '') + now.getMonth().toString(); // JS months are 0-based, so +1 and pad with 0's
    timestamp += ((now.getDate < 10) ? '0' : '') + now.getDate().toString(); // pad with a 0
    timestamp += now.getHours().toString();
    timestamp += now.getMinutes().toString();
    timestamp += now.getSeconds().toString();
    timestamp += now.getMilliseconds().toString();
    timestamp += Math.floor(Math.random()).toString();
    return timestamp;
}





export const getDiscount = (price, discount) => {
    let discounted_value =
        discount == null || price == null
            ? price
            : price < discount.min_order_value
                ? price
                : discount.discount_type == "flat"
                    ? price - discount.discount_value
                    : price *
                        (discount.discount_value / 100) <=
                        discount.max_discount_value
                        ? price -
                        price *
                        (discount.discount_value / 100)
                        : price - discount.max_discount_value;
    let applied =
        discount == null || price == null
            ? 0
            : price < discount.min_order_value
                ? 0
                : discount.discount_type == "flat"
                    ? discount.discount_value
                    : price *
                        (discount.discount_value / 100) <=
                        discount.max_discount_value
                        ? price *
                        (discount.discount_value / 100)
                        : discount.max_discount_value;
    discounted_value = discounted_value && discounted_value.toFixed(2);
    applied = applied && applied.toFixed(2)
    return { discounted_value, applied }
}



export const ConvertByteToMb = b => {
    let kb = b / 1000;
    let Mb = kb / 1000;
    return Mb
}
