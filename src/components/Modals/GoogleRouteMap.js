import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, Modal, Platform } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PolyLine from '@mapbox/polyline';
import { Loader } from '../custom/CustomFields';
import { googleKey } from '../../constants/GeoLocation';
import { colors } from '../../styles/color';
import { largeMediumStyle } from '../../styles/CommonStyling';


const GoogleRouteMap = ({ close, coord, destination }) => {
    const [pointCoords, setPointCoords] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getRouteDirection(destination);
    }, []);

    const mapRef = useRef();

    const animateMap = async (coord) => {
        try {
            mapRef.current.fitToCoordinates(coord, {
                animated: true,
                edgePadding: {
                    top: 20,
                    bottom: 5,
                    left: 5,
                    right: 5,
                }
            })
        } catch (error) {
            console.log('animateMapError--', error);

        }
    }

    const getRouteDirection = async (dest) => {
        let authGoogleKey = "AIzaSyCSMz5Xt6ltO4LSxhYS1zvVwomoRces-Yk";
        try {
            console.log("================dest================", dest);
            setLoading(true);
            const routeUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${coord.latitude},${coord.longitude}&destination=${dest.lat},${dest.lng}&key=${googleKey}&mode=driving`;
            const response = await fetch(routeUrl);
            const res = await response.json();
            console.log(res);
            setLoading(false);
            if (res.status == "OK") {
                let ov = res.routes[0].overview_polyline.points
                const decoded = PolyLine.decode(ov);
                const decodedlatLong = decoded.map(point => {
                    return { latitude: point[0], longitude: point[1] }
                })
                // console.log('decodedlatlong---', decodedlatLong);
                if (decodedlatLong) {
                    setPointCoords(decodedlatLong);

                    setTimeout(() => {
                        animateMap(decodedlatLong);
                    }, 1000);

                }
            } else {
                setTimeout(() => {
                    // animateMap([coord.latitude, coord.longitude]);
                }, 1000);
            }
        } catch (error) {
            console.log('error---', error);
        }
    }

    // console.log(coord)

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            onRequestClose={() => close()}
        >
            <View style={styles.container}>
                <View style={[styles.header, { paddingTop: Platform.OS == "ios" ? 50 : 20 }]}>
                    <Text style={styles.headerText}>Store Address</Text>
                    <AntDesign name='close' size={25} color={colors.black} style={styles.closeIcon} onPress={() => close()} />
                </View>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: coord.latitude,
                        longitude: coord.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                // showsUserLocation={true}
                >
                    <Marker coordinate={coord}>
                        <MaterialIcons name="my-location" size={25} color={colors.primary} />
                    </Marker>

                    <Polyline
                        coordinates={pointCoords}
                        strokeColor={colors.blue} // fallback for when `strokeColors` is not supported by the map-provider
                        // strokeColors={}
                        strokeWidth={4}
                    />

                    {pointCoords.length > 1 && <Marker coordinate={pointCoords[pointCoords.length - 1]} />}

                </MapView>
                {loading && <Loader />}
            </View>


        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    map: {
        // flex: 1,
        ...StyleSheet.absoluteFillObject,
        // zIndex: 1
    },
    header: {
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: colors.grey,
        marginBottom: 20,
        position: "absolute",
        width: "100%",
        top: 0,
        backgroundColor: colors.white,
        zIndex: 1
    },
    headerText: {
        ...largeMediumStyle,
        fontSize: 16,
    },
    closeIcon: {
        position: 'absolute',
        right: 10,
        padding: 10,
        bottom: 5
    }
});

export default GoogleRouteMap