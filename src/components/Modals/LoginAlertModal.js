import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, Linking } from 'react-native'
import { useDispatch } from 'react-redux'
import { navigate } from '../../route/RootNavigation'
import { FAQWebURL, privacyPolicyWebURL, termsConditionsWebURL } from '../../services/service'
import { changeAppStatus } from '../../store/actions/UserAction'
import { colors } from '../../styles/color'
import { commonTextStyle } from '../../styles/CommonStyling'
import AlertHeader from '../custom/AlertHeader'
import { AlertCloseIcon, Button } from '../custom/CustomFields'



const LoginAlertModal = ({ close }) => {
    const dispatch = useDispatch();



    return (
        <Modal
            visible
            transparent
            onRequestClose={() => close()}
            animationType="slide"
        >
            <View style={styles.container}>
                <View style={styles.modalContainer}>
                    <AlertHeader
                        title="Please Login"
                    />

                    <View style={styles.list}>
                        <Text style={styles.txt}>Please login, to access all the app features</Text>
                    </View>

                    <View>
                        <Button
                            title='Login'
                            onPress={() => {
                                close();
                                // dispatch(changeAppStatus(2))
                                navigate("loginScreen", { fromScreen: "booking" })
                            }}
                        />
                        <Button
                            title="Cancel"
                            backgroundColor={colors.white}
                            style={{ borderWidth: 1, borderColor: colors.primary }}
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
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 10,
        paddingBottom: 10
    },
    list: {
        padding: 20,
        // alignItems: "center"
    },
    txt: {
        ...commonTextStyle
    }
})

export default LoginAlertModal;