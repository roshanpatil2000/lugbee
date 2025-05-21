import React, { useCallback } from 'react'
import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import { screenWidth } from 'react-native-calendars/src/expandableCalendar/commons'
import { colors } from '../../../styles/color'
import { largeMediumStyle, smallTextSize } from '../../../styles/CommonStyling'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const BorderImageOverlay = ({ images, detail, addressName }) => {
    const [activeIndex, setActiveIndex] = React.useState(0)

    const _viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    }

    const onChange = useCallback(({ viewableItems, changed }) => {
        setActiveIndex(viewableItems[0].index);
    }, []);

    return (
        <View>
            {images && images.length > 0 ? <>
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    // onViewableItemsChanged={onChange}
                    // viewabilityConfig={_viewabilityConfig}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                                <Image source={{ uri: item }} style={styles.storeImage} />
                                <View style={styles.overlay} />
                            </>
                        )
                    }}
                />
                <View style={styles.imageCount}>
                    {images.map((it, ind) => {
                        return (
                            <View key={String(ind)} style={[styles.imageCountItem, { backgroundColor: ind == activeIndex ? colors.white : colors.darkGrey }]}>
                            </View>
                        )
                    })}
                </View>
            </> :
                <>
                    <Image source={require("../../../assets/images/NoStoreImage.jpg")} style={styles.storeImage} />
                    <View style={styles.overlay} />
                </>
            }
            <View style={styles.borderView}>
                <View style={{ marginTop: 10 }}>
                    <Text style={[largeMediumStyle, {}]}>{detail.name}</Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <MaterialIcons name='location-pin' size={18} color="grey" />
                    <Text style={[smallTextSize, { flex: 1 }]}>About {detail.nearLocation.duration} / {detail.nearLocation.distance} away from {addressName}</Text>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    storeImage: {
        height: 280,
        width: screenWidth,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    borderView: {
        height: 100,
        width: screenWidth,
        borderTopLeftRadius: 55,
        borderTopRightRadius: 55,
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        justifyContent: "center",
        paddingHorizontal: 20
    },
    imageCount: {
        position: "absolute",
        bottom: 50,
        flexDirection: "row",
        alignSelf: "center",
        // left: "40%"
    },
    imageCountItem: {
        height: 5,
        width: 5,
        borderRadius: 10,
        backgroundColor: "grey",
        marginHorizontal: 3
    }
})

export default BorderImageOverlay