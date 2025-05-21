import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import { AppConst } from '../../constants/AppConst';
import { colors } from '../../styles/color';
import { screenWidth } from '../../styles/ResponsiveLayout';



const BannerModal = ({ onClose }) => {

    return (
        <Modal
            visible
            transparent
            onRequestClose={() => onClose()}
            animationType="slide"
        >
            <TouchableOpacity activeOpacity={1} onPress={() => onClose()} style={styles.cont}>
                <AntDesign name='close' color={colors.white} size={25} onPress={() => onClose()} style={styles.closeIcon} />
                <Image
                    source={require("../../assets/images/mobile_ad.jpg")}
                    style={styles.banner}
                />
            </TouchableOpacity>
        </Modal>
    )
}


const styles = StyleSheet.create({
    cont: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
        // paddingHorizontal: 100,
        paddingVertical: 100
    },
    banner: {
        flex: 1,
        width: screenWidth - 20,
        resizeMode: "contain"
    },
    closeIcon: {
        position: "absolute",
        right: 15,
        top: AppConst.paddingTop + 20,
        zIndex: 1,
        padding: 5
    }
})

export default BannerModal