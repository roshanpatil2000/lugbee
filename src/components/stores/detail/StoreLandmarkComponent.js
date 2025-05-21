import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../../../styles/color'
import { commonTextStyle, fonts, largeMediumStyle } from '../../../styles/CommonStyling'
import StoreNearbyLocations from './StoreNearbyLocations'


const StoreLandmarkComponent = ({ landmarks }) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    return (
        <View style={styles.cont}>
            <Text style={styles.hdTxt}>Landmarks</Text>
            <View style={styles.row}>
                {landmarks.map((landmark, index) => {
                    if (index < 5) {
                        return (
                            <View key={String(index)} style={styles.item}>
                                <Text style={styles.txt} numberOfLines={1}>{landmark.location}</Text>
                            </View>
                        )
                    }
                })}
            </View>
            <TouchableOpacity style={styles.moreView} onPress={() => setModalVisible(true)}>
                <Text style={[styles.txt, { fontFamily: fonts.medium }]}>Find out nearby attractions</Text>
                <AntDesign name='arrowright' size={20} color={colors.black} />
            </TouchableOpacity>

            {modalVisible &&
                <StoreNearbyLocations
                    locations={landmarks}
                    close={() => setModalVisible(false)}
                />
            }
        </View>
    )
}


const styles = StyleSheet.create({
    cont: {
        paddingHorizontal: 20,
        marginTop: 20
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    item: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        maxWidth: 200,
        backgroundColor: "#EEEFF0",
        borderWidth: 1,
        borderColor: colors.secondary,
        marginRight: 10,
        marginBottom: 10
    },
    txt: {
        ...commonTextStyle,
        color: colors.black,
    },
    hdTxt: {
        ...largeMediumStyle,
        fontSize: 16,
        marginBottom: 15
    },
    moreView: {
        flexDirection: "row",
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#EEEFF0",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginVertical: 5
    }
})

export default StoreLandmarkComponent