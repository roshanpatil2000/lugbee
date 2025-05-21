import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { colors } from '../../../styles/color';
import { commonTextStyle, largeMediumStyle } from '../../../styles/CommonStyling';


const StoreServicesAvailable = ({ services }) => {

    const serviceArr = services.map(item => {
        let icon = null
        switch (item) {
            case "parking":
                icon = <MaterialCommunityIcons name='parking' size={22} color={colors.primary} />
                break;
            case "coffee":
                icon = <Feather name='coffee' size={22} color={colors.primary} />
                break;
            case "taxi":
                icon = <MaterialCommunityIcons name='taxi' size={22} color={colors.primary} />
                break;
            case "wifi":
                icon = <Feather name='wifi' size={22} color={colors.primary} />
                break;
            case "food":
                icon = <MaterialCommunityIcons name='food-outline' size={22} color={colors.primary} />
                break;
            case "charging":
                icon = <MaterialCommunityIcons name='battery-charging' size={22} color={colors.primary} />
                break;
            default:
                icon = <Feather name='coffee' size={22} color={colors.primary} />;
                break;
        }
        return {
            name: item,
            icon: icon
        }
    });

    const getServiceIcon = (service) => {
        switch (service) {
            case "parking":
                return <MaterialCommunityIcons name='parking' size={22} color={colors.primary} />
            case "coffee":
                return <Feather name='coffee' size={22} color={colors.primary} />
            case "taxi":
                return <MaterialCommunityIcons name='taxi' size={22} color={colors.primary} />
            case "wifi":
                return <Feather name='wifi' size={22} color={colors.primary} />
            case "food":
                return <MaterialCommunityIcons name='food-outline' size={22} color={colors.primary} />

            default:
                return <Feather name='coffee' size={22} color={colors.primary} />;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {serviceArr.map((item, index) => {
                    return (
                        <View key={String(index)} style={styles.item}>
                            {item.icon}
                            <Text style={styles.itemtxt}>{item.name}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginRight: 10,
        marginTop: 10
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    item: {
        marginTop: 10,
        marginRight: 10,
        height: 75,
        width: 75,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: colors.primary,
        justifyContent: "center",
        alignItems: "center"
    },
    itemtxt: {
        ...commonTextStyle,
        color: colors.primary,
        marginTop: 10
    }

});

export default StoreServicesAvailable