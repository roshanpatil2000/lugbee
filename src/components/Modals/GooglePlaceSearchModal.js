import React, { useEffect } from 'react'
import { Modal, StyleSheet, Text, View, Platform, Keyboard, TextInput, TouchableOpacity } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getLatLongByPlaceId, googleKey, PlaceAutoAcomplete } from '../../constants/GeoLocation';
import { colors } from '../../styles/color';
import { AppConst } from '../../constants/AppConst';
import AntDesign from "react-native-vector-icons/AntDesign";
import { commonTextStyle, largeMediumStyle } from '../../styles/CommonStyling';


const GooglePlaceSearchModal = ({ onSelectAddress, close }) => {
    const textRef = React.useRef();
    const [searchText, setSearchText] = React.useState('');
    const [predictions, setPredictions] = React.useState([]);

    useEffect(() => {
        // console.log("GooglePlaceSearchModal useEffect", textRef.current.focus())
        setTimeout(() => {
            textRef.current.focus();
        }, 1000);
    }, [])

    function onAddressPress(data, details = null) {
        // AppConst.showConsoleLog(details?.address_components[address_components.length - 1].long_name)
        // return;
        let data1 = {}
        if (details == null) {
            data1 = {
                address: data.plus_code.compound_code,
                lat: data.geometry.location.lat,
                lng: data.geometry.location.lng,
                city: data.structured_formatting.main_text,
                state: data.structured_formatting.secondary_text,
                country: data.structured_formatting.secondary_text,
                formatted_address: data.plus_code.compound_code
            };
            AppConst.showConsoleLog('if--', data)
        } else {
            data1 = {
                address: data.description,
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
                city: details.address_components[1]?.long_name,
                state: details.address_components[2]?.long_name,
                country: details.address_components[3]?.long_name,
                formatted_address: data.description
            };
            AppConst.showConsoleLog('else--', details)
        }

        // return;
        onSelectAddress(data1)
        close()
    }


    const onChangeText = (text) => {
        setSearchText(text)
        PlaceAutoAcomplete(text).then(res => {
            // console.log('res', res)
            if (res && res.length > 0) {
                setPredictions(res);
            }
        })
    }

    const onItemPress = (item) => {
        console.log("item- ", item);
        getLatLongByPlaceId(item.place_id).then(res => {
            console.log('lat long res: ', res)
            if (res) {
                let data = {
                    address: item.description,
                    lat: res.lat,
                    lng: res.lng,
                    formatted_address: item.description
                };
                onSelectAddress(data)
                close()
            }
        })
    }

    return (
        <Modal
            visible
            transparent={false}
            animationType="slide"
            onRequestClose={() => close()}
        >
            <View style={[styles.container, { paddingTop: Platform.OS == "ios" ? 40 : 10 }]}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Select Address</Text>
                    <AntDesign name='close' size={25} color={colors.black} style={styles.closeIcon} onPress={() => close()} />
                </View>

                <TextInput
                    ref={textRef}
                    value={searchText}
                    placeholder="Search Address"
                    placeholderTextColor={colors.darkGrey}
                    style={[styles.textInput, styles.textInputContainer]}
                    onChangeText={(text) => onChangeText(text)}
                />

                {predictions && predictions.length > 0 && searchText.trim().length > 0 &&
                    <PredictionsView
                        predictions={predictions}
                        onPress={(item) => onItemPress(item)}
                    />
                }

            </View>
        </Modal>
    )


}


const PredictionsView = ({ predictions, onPress }) => {
    return (
        <View style={styles.predictionsContainer}>
            {predictions.map((item, index) => {
                return (
                    <TouchableOpacity onPress={() => onPress(item)} style={styles.predictionsItem} key={index}>
                        <Text style={styles.txt}>{item.description}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: 20
    },
    cancelButtonView: {
        position: 'absolute',
        zIndex: 1,
        height: 45,
        borderRadius: 5,
        width: 60,
        right: 5,
        backgroundColor: 'white',
        // ...shadows[1],
        // shadowColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    predictionsContainer: {
        marginHorizontal: 20,
    },
    txt: {
        ...commonTextStyle,
        color: colors.black,
    },
    predictionsItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",//colors.grey,
        paddingVertical: 14,
    },
    textInput: {
        backgroundColor: 'white',
        // ...shadows[1],
        // shadowColor: 'black',
        color: 'black',
        borderWidth: 1,
        borderColor: colors.grey,
        marginHorizontal: 20,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 50,
    },
    textInputContainer: {

        // flex: 1
    },
    header: {
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: colors.grey,
        marginBottom: 20
    },
    headerText: {
        ...largeMediumStyle,
        fontSize: 16,
    },
    closeIcon: {
        position: 'absolute',
        right: 10,
        padding: 10
    }
});

export default GooglePlaceSearchModal