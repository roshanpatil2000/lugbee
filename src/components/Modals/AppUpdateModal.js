import React from 'react'
import { StyleSheet, Text, View, Modal, Linking, Platform } from 'react-native'
import { colors } from '../../styles/color'
import { commonTextStyle } from '../../styles/CommonStyling'
import AlertHeader from '../custom/AlertHeader'
import { Button } from '../custom/CustomFields'


const AppUpdateModal = ({ close, updateData }) => {

    const playStoreUrl = updateData.app_url ? updateData.app_url : "https://play.google.com/store/apps/details?id=com.lugbee";
    const appStoreUrl = updateData.app_url ? updateData.app_url : 'https://apps.apple.com/us/app/lugbee/id1619745813'

    console.log("App Url: ", updateData.app_url);

    const onUpdatePress = () => {
        if (Platform.OS == "android") {
            Linking.openURL(playStoreUrl)
        } else {
            Linking.openURL(appStoreUrl).catch(err => console.log(err))
        }
    }

    return (
        <Modal
            visible
            transparent
            animationType="fade"
            onRequestClose={() => !updateData.force_update ? close() : null}
        >
            <View style={styles.container}>

                <View style={styles.modalContainer}>
                    <AlertHeader
                        title="Update Available"
                    />
                    <View style={styles.inerView}>
                        <Text style={styles.text}>A new version of Lugbee is available. Please update to version {updateData.version} ({updateData.build})</Text>
                        <View style={{ paddingTop: 20 }}>
                            <Button
                                title='Update'
                                onPress={() => { onUpdatePress() }}
                            />
                            {!updateData.force_update &&
                                <Button
                                    title='Next Time'
                                    onPress={() => close()}
                                    backgroundColor={colors.white}
                                    style={{ borderWidth: 1, borderColor: colors.primary }}
                                />
                            }
                        </View>
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
    modalContainer: {
        marginHorizontal: 20,
        borderRadius: 20,
        backgroundColor: colors.white,
        // borderBottomRightRadius: 20,
    },
    inerView: {
        padding: 20
    },
    text: {
        ...commonTextStyle,
        textAlign: "center"
    }
})

export default AppUpdateModal