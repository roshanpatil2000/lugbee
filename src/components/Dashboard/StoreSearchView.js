import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../styles/color';
import { BagSvg, CalenderSvg, LocationPinSvg, LuggageSvg } from '../../assets/svg/basic/basiciconSvg';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { commonTextStyle, fonts, largeMediumStyle, LargeTextStyle, MediumTextStyle } from '../../styles/CommonStyling';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GooglePlaceSearchModal from '../Modals/GooglePlaceSearchModal';
import { Button } from '../custom/CustomFields';
import { getAddressByLatLng } from '../../constants/GeoLocation';
import { AppConst } from '../../constants/AppConst';
const boxHeight = 45;


const StoreSearchView = ({ getCoords, setShowCalender, date, bagsCounter, setBagsCounter, getStoreListFunc, address, setAddress }) => {
    const [selectAdrs, setSelectAdrs] = useState(false);


    const onSelectAddress = async (data) => {
        const addrs = await getAddressByLatLng({ lat: data.lat, lng: data.lng });
        AppConst.showConsoleLog('address--', addrs)
        let data1 = {
            ...data,
            city: addrs.address.city,
            state: addrs.address.state,
            country: addrs.address.country,
        }
        if (!data1.state && (data1.address.includes("Jammu") || data1.address.includes("jammu") || data1.address.includes("Katra") || data1.address.includes("katra"))) {
            data1 = { ...data1, state: "Jammu and Kashmir" }
            if (data1.address.includes("Jammu") || data1.address.includes("jammu")) {
                data1 = { ...data1, city: "Jammu" }
            } else {
                data1 = { ...data1, city: "Katra" }
            }
        }
        AppConst.showConsoleLog('data 1--', data1)
        setAddress(data1);
    }

    // console.log(address)
    return (
        <View>
            <View style={{ paddingHorizontal: 15, marginBottom: 10, marginTop: 10 }}>
                <View style={{ marginBottom: 10, paddingHorizontal: 15 }}>
                    <View style={{}}>
                        <Text style={styles.title}>Discover online storage options to</Text>
                        <Text style={styles.title}>
                            <Text>store your </Text>
                            <Text style={{ color: colors.secondary }}>Luggage</Text>
                        </Text>
                    </View>
                    <View style={styles.locationView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <LocationPinSvg />
                            <Text numberOfLines={1} onPress={() => setSelectAdrs(true)} style={{ flex: 1, ...styles.text, paddingVertical: 10, paddingHorizontal: 5 }}>{address?.formatted_address ? address.formatted_address : "Enter city or landmark"}</Text>
                            <MaterialIcon name="my-location" size={20} color={colors.white} onPress={() => getCoords()} style={styles.myLocation} />
                        </View>
                    </View>
                    <View style={{ marginVertical: 10, height: boxHeight, flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity style={styles.dateview} onPress={() => setShowCalender({ type: "from", key: "From" })}>
                            <CalenderSvg scale={0.8} />
                            <Text
                                style={[{ ...styles.text, }]}
                            >{date?.from ? date.from.formatted : "Check-in-time"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.dateview,]}
                            onPress={() => setShowCalender({ type: "to", key: "To" })}
                        >
                            <CalenderSvg scale={0.8} />
                            <Text
                                style={[{ ...styles.text, }]}
                            >{date?.to ? date.to.formatted : "Check-out-time"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.flexRow}>
                        <Text style={{ flex: 1, ...styles.text, }}>{"Number of luggage"}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <AntDesign name="minus" size={18} color={colors.secondary} onPress={() => bagsCounter == 1 ? null : setBagsCounter(bagsCounter - 1)} style={styles.plusIcon} />
                            <Text style={styles.text}>{bagsCounter}</Text>
                            <AntDesign name="plus" size={18} color={colors.secondary} onPress={() => setBagsCounter(bagsCounter + 1)} style={[styles.plusIcon, { marginRight: 5 }]} />
                        </View>
                    </View>
                </View>
                <Button
                    title='Go'
                    icon={<LuggageSvg scale={0.7} />}
                    textStyle={{ ...MediumTextStyle, color: colors.primary, }}
                    onPress={() => getStoreListFunc()}
                />
            </View>
            <Text style={{ ...commonTextStyle, color: colors.white, textAlign: "center" }}>Choose from +100 places in country.</Text>


            {selectAdrs &&
                <GooglePlaceSearchModal
                    onSelectAddress={adrs => onSelectAddress(adrs)}
                    close={() => setSelectAdrs(false)}
                />
            }
        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        ...largeMediumStyle,
        color: colors.white,
        fontSize: 16
        // textAlign: "center"
    },
    locationView: {
        height: boxHeight,
        borderRadius: 30,
        paddingHorizontal: 10,
        justifyContent: "center",
        borderWidth: 0.5,
        borderColor: colors.white,
        marginTop: 15
    },
    dateview: {
        flexDirection: 'row',
        width: "49%",
        alignItems: 'center',
        justifyContent: "space-evenly",
        borderWidth: 0.5,
        borderColor: colors.white,
        borderRadius: 30,
    },
    myLocation: {
        padding: 5,
        borderRadius: 20,
        marginLeft: 5
    },
    text: {
        ...commonTextStyle,
        color: colors.white
    },
    flexRow: {
        flexDirection: "row",
        paddingHorizontal: 15,
        justifyContent: "space-between",
        borderWidth: 0.5,
        borderColor: colors.white,
        height: boxHeight,
        borderRadius: 30,
        alignItems: "center"
    },
    goBtn: {
        width: "50%",
        backgroundColor: colors.secondary,
        borderBottomRightRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    plusIcon: {
        padding: 1,
        borderWidth: 0.5,
        borderColor: colors.secondary,
        borderRadius: 5,
        marginHorizontal: 10
    }
});

export default StoreSearchView