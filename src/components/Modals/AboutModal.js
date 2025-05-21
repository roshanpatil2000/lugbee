import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, Linking } from 'react-native'
import { FAQWebURL, privacyPolicyWebURL, termsConditionsWebURL } from '../../services/service'
import { commonTextStyle } from '../../styles/CommonStyling'
import AlertHeader from '../custom/AlertHeader'
import { AlertCloseIcon } from '../custom/CustomFields'



const AboutModal = ({ close }) => {

    const list = [
        {
            title: "FAQ",
            uri: FAQWebURL
        },
        {
            title: "Terms & Conditions",
            uri: termsConditionsWebURL
        },
        {
            title: "Privacy Policy",
            uri: privacyPolicyWebURL
        },
    ]

    const onPress = (uri) => {
        Linking.openURL(uri)
    }

    return (
        <Modal
            visible
            transparent
            onRequestClose={() => close()}
            animationType="slide"
        >
            <View style={styles.container}>
                <View style={styles.listContainer}>
                    <AlertHeader
                        title="About Lugbee"
                    />

                    <View style={styles.list}>
                        {list.map((item, index) => {
                            return (
                                <TouchableOpacity style={styles.listItem} key={index} onPress={() => onPress(item.uri)}>
                                    <Text style={styles.listItemTxt}>{item.title}</Text>
                                </TouchableOpacity>
                            )
                        })
                        }
                    </View>

                    <AlertCloseIcon
                        onPress={() => close()}
                    />
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
    listContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 10,
        paddingBottom: 10
    },
    list: {
        paddingHorizontal: 10,
        // paddingVertical: 20,

    },
    listItem: {
        padding: 15,
        borderTopWidth: 0.5,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listItemTxt: {
        ...commonTextStyle
    }
})

export default AboutModal