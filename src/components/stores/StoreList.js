import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../../styles/color'
import { commonTextStyle, MediumTextStyle } from '../../styles/CommonStyling'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { navigate } from '../../route/RootNavigation';
import { FlatList } from 'react-native-gesture-handler';
import { returnPrice } from '../../constants/AppConst';




const StoreList = ({ list }) => {

    return (
        <View style={{}}>
            <FlatList
                data={list}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigate("StoreDetail", { d: item, image: item.profile_image_path_list[0] })} style={styles.item}>
                        <Image source={item.profile_image_path_list[0] ? { uri: item.profile_image_path_list[0] } : require("../../assets/images/NoStoreImage.jpg")} style={styles.itemImage} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}> {item.name}</Text>
                            <View style={{ flexDirection: "row", marginTop: 8 }}>
                                <MaterialIcons name='location-pin' size={20} color="grey" />
                                <Text style={styles.itemTxt}>About {item.nearLocation.duration} / {item.nearLocation.distance} away from your chosen location</Text>
                            </View>
                            <Text style={[styles.itemName, { alignSelf: "flex-end" }]}>{returnPrice(item.rate)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    item: {
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        flexDirection: "row",
        alignItems: "center"
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
        top: -8
    },
    itemName: {
        ...MediumTextStyle,
        color: colors.primary
    },
    itemTxt: {
        ...commonTextStyle,
        color: colors.primary
    }
})

export default StoreList