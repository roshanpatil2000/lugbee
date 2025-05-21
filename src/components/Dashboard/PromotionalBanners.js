import React from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { changeAppStatus } from '../../store/actions/UserAction'
import { screenWidth } from '../../styles/ResponsiveLayout'


const PromotionalBanners = ({ banners }) => {
    const dispatch = useDispatch();

    const bannerPress = () => {
        dispatch(changeAppStatus(2));
    }
    return (
        <View style={styles.cont}>
            <FlatList
                data={banners}
                keyExtractor={(a, b) => String(b)}
                horizontal={true}
                pagingEnabled
                contentContainerStyle={{ paddingHorizontal: 10 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity style={styles.banner} activeOpacity={0.9} onPress={() => bannerPress()}>
                            <Image source={{ uri: item.image_url }} style={{ flex: 1, resizeMode: "stretch" }} />
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    cont: {
        width: screenWidth - 60,
        alignSelf: "center",
        left: -5,
        // borderRadius: 10
    },
    banner: {
        height: 140,
        width: screenWidth - 65,
        alignSelf: "center",
        left: -5,
        // borderRadius: 10
    }
})

export default PromotionalBanners