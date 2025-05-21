import React, { useContext } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { check, PERMISSIONS, RESULTS, request, openSettings } from 'react-native-permissions';
import { apiHeader, GetRequest } from '../services/service';
import Polyline from '@mapbox/polyline';




export const already_enabled = "already-enabled";
export const enabled = "enabled";
const denied = "denied";
const granted = "granted";
export const googleKey = "AIzaSyBJXgFzyAEn02NMURljQ5xNdsPehFL9mXA" //"AIzaSyDI_UHQMWr9Q4JrS1F3lgNKIXrtoN1vs3o"
// export const googleKey = "AIzaSyC_DBU4lixe0onEg8DvCsO2rWr2OOUTIUM"


function enableLocation(callback,) {

    if (Platform.OS == 'android') {
        try {
            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(async (res) => {
                if (res == granted) {
                    try {
                        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 1000, fastInterval: 1000 })
                            .then(data => {
                                callback(data);
                            }).catch(err => {
                                // console.log(err.message)
                                callback(err.message);
                            });

                    } catch (err) {
                        console.warn(err)
                        callback(err);
                    }
                }
                else if (res == denied) {
                    Alert.alert(
                        "",
                        'if you denied permission you can not use location service',
                        [
                            {
                                text: 'deny',

                                style: "cancel"
                            },
                            {
                                text: 'ask again', onPress: () => {
                                    enableLocation(() => { })
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                }
            });
        }
        catch (e) { callback(e) }
    }
}



export const getCurrentLatLng = async (isFromSplah = false, callBack) => {

    const status = await checkLocationPermission();
    console.log(status, 'status')
    if (status == -1) {
        // when user blocked permission
        if (!isFromSplah) {
            handleLocationBlockCase();
            callBack && callBack(false);
        }
        else {
            callBack && callBack(false);
        }
        return
    }

    if (status == true) {

        getPosition((coords) => {

            // console.log('crr', coords)
            if (coords) {
                callBack && callBack({ lat: coords.coords.latitude, lng: coords.coords.longitude });
                return
            }
            callBack && callBack(false);
            return
        });
    }

    else {
        requestForLocationPermission((status) => {
            if (status) {
                getPosition((coords) => {
                    if (coords) {
                        callBack && callBack({ lat: coords.coords.latitude, lng: coords.coords.longitude });
                        return
                    }
                    callBack && callBack(false);
                    return
                });
            }
            else {
                callBack && callBack(false);
            }
        });
    }
}

const requestForLocationPermission = async (callBack) => {
    if (Platform.OS == 'ios') {
        const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (status == RESULTS.GRANTED) {
            callBack && callBack(true);
        }
        else {
            callBack && callBack(false);
        }
    }
    else {
        const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (status == RESULTS.GRANTED) {
            callBack && callBack(true);
        }
        else {
            callBack && callBack(false);
        }
    }
}

const checkLocationPermission = async () => {
    if (Platform.OS == 'ios') {
        const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

        if (result == RESULTS.GRANTED) {
            return true
        }
        if (result == RESULTS.BLOCKED) {
            return -1;
        }
    }
    else {
        const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (result == RESULTS.GRANTED) {
            return true
        }
        if (result == RESULTS.BLOCKED) {
            return -1;
        }
    }
}

const getPosition = (callBack) => {
    if (Platform.OS == 'android') {
        try {

            enableLocation((respose) => {
                // alert(respose);
                if (respose == enabled || respose == already_enabled) {
                    Geolocation.getCurrentPosition(
                        // success callBack
                        (coords) => {
                            callBack && callBack(coords);
                        },
                        // error callBack
                        (error) => {
                            console.log(error);
                            callBack && callBack(false);
                        },
                        {
                            enableHighAccuracy: true,
                            maximumAge: 5000,
                        }
                    );
                }
                else {
                    callBack && callBack(false);
                    // getCurrentLatLng((pos) => {
                    //     callBack && callBack({ coords: { latitude: pos.lat, longitude: pos.lng } })
                    // })
                }
            });
        }
        catch (error) {
            console.log('pos err--', error)
        }
    }
    else {

        Geolocation.getCurrentPosition(
            // success callBack
            (coords) => {

                callBack && callBack(coords);
            },
            // error callBack
            () => {
                callBack && callBack(false);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
            }
        );
    }
}


const handleLocationBlockCase = () => {
    Alert.alert(
        "Permission Blocked",
        "open setting and provide permission for location",
        [
            {
                text: "Cancel",

                style: "cancel"
            },
            { text: "Open Settings", onPress: () => openSettings() }
        ],
        { cancelable: false }
    );
}


export const getAddressByLatLng = async ({
    lat = undefined,
    lng = undefined
}) => {

    if (!lat && !lng) {
        return false
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${googleKey}`;

    try {

        const response = await fetch(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

        let res = await response.json();
        // console.log(res);
        if (res && res.results && res.results.length > 0) {

            const obj = {};
            let address = {
                pin_code: '',
                country: '',
                state: '',
                city: '',
            }
            obj["formatted_address"] = res.results[0].formatted_address;

            res.results[0].address_components.map(item => {
                const TYPE = item.types[0];
                if (TYPE == 'postal_code') {
                    address.pin_code = item.long_name;
                }
                else if (TYPE == 'country') {
                    address.country = item.long_name;
                }
                else if (TYPE == 'administrative_area_level_1') {
                    address.state = item.long_name;
                }
                else if (TYPE == 'administrative_area_level_2') {
                    address.city = item.long_name;
                }
            });
            obj["address"] = address;
            return obj
        }
    } catch (error) {
        console.log('error', error)
    }
    return false
    //call api function

}



export const drowRoutePoliyLine = async ({
    mode = 'driving',
    start_lat = undefined,
    start_long = undefined,
    end_lat = undefined,
    end_long = undefined
}) => {
    const origin = `${start_lat},${start_long}`;
    const destination = `${end_lat},${end_long}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${googleKey}&mode=${mode}`;
    const result = await GetRequest({ url });
    if (result && result.routes && Array.isArray(result.routes) && result.routes.length > 0) {
        const point = Polyline.decode(result.routes[0].overview_polyline.points);
        const res = point.map((point) => {
            return {
                latitude: point[0],
                longitude: point[1]
            }
        })
        return res
        //return Polyline.decode(result.routes[0].overview_polyline.points);
    }
    //console.log('========', origin, '============', destination, '=======', result)
    return false
}



export const PlaceAutoAcomplete = async (text) => {
    try {

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${googleKey}`;
        const result = await GetRequest({ url, header: apiHeader });
        if (result && result.predictions && Array.isArray(result.predictions) && result.predictions.length > 0) {
            return result.predictions
        }
        return false
    } catch (error) {

    }
}


export const getLatLongByPlaceId = async (placeId) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googleKey}`;
        const result = await GetRequest({ url, header: apiHeader });
        if (result && result.result && result.result.geometry && result.result.geometry.location) {
            return result.result.geometry.location
        }
        return false
    } catch (error) {

    }
}