import React from 'react'
import { StyleSheet, Text, View, Modal, FlatList } from 'react-native'
import { colors } from '../../../styles/color'
import { commonTextStyle } from '../../../styles/CommonStyling'
import AlertHeader from '../../custom/AlertHeader'
import { AlertCloseIcon } from '../../custom/CustomFields'


const StoreNearbyLocations = ({ locations, close }) => {

    let arr = [
        {
            location: "abx"
        },
        {
            location: "abx"
        },
        {
            location: "abx"
        }
    ]

    return (
        <Modal
            visible
            animationType="slide"
            transparent={true}
            onRequestClose={() => close()}
        >
            <View style={styles.container}>
                <View style={styles.locationContainer}>
                    <AlertHeader
                        title="Nearby Attractions"
                    />
                    {/* <View style={{ flexGrow: 1 }}> */}
                    <FlatList
                        data={locations}
                        keyExtractor={(item, index) => String(index)}
                        contentContainerStyle={{ paddingVertical: 10 }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={[styles.locationItem, { borderTopWidth: index == 0 ? 0 : 0.5 }]}>
                                    <View style={{ flex: 1, marginRight: 10, }}>
                                        <Text style={styles.txt}>{item.location}</Text>
                                    </View>
                                    <Text style={styles.txt}>{item.distance?.text} / {item.duration?.text}</Text>
                                </View>
                            )
                        }}
                    />
                    {/* </View> */}
                    <View style={{}}>

                        <AlertCloseIcon
                            onPress={() => close()}
                        />
                    </View>
                </View>
            </View>

        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    locationContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingBottom: 20,
        marginHorizontal: 20,
        marginVertical: 60,
    },
    locationItem: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: colors.grey,
    },
    txt: {
        ...commonTextStyle,
        fontSize: 12
    }
})

export default StoreNearbyLocations