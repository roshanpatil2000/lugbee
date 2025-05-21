import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../styles/color'
import { largeMediumStyle } from '../../styles/CommonStyling'


const AlertHeader = ({ title }) => {

    return (
        <View style={styles.header}>
            <Text style={styles.hdTxt}>{title}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        padding: 10,
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: colors.grey,
        backgroundColor: colors.secondary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 15
    },
    hdTxt: {
        ...largeMediumStyle,
        color: colors.primary
    },
})

export default AlertHeader