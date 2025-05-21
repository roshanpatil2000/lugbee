import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { AppNameSvg } from '../../assets/svg/splash/SplashSvgs';
import { AppName } from '../custom/CustomFields';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../../styles/color';
import { DrawerActions } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { popToTop } from '../../route/RootNavigation';
import { setIsHome } from '../../store/actions/AppAction';

// ...


const HomeHeader = ({ navigation }) => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const isHome = useSelector(state => state.app.isHome)
    const dispatch = useDispatch();

    const appIconPress = () => {
        if (isHome) {
            return;
        }
        popToTop();
        dispatch(setIsHome(true));
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => appIconPress()}>
                <AppName scale={0.7} />
            </TouchableOpacity>
            <Feather
                name='menu'
                size={25}
                color={colors.white}
                style={{ padding: 10, paddingRight: 25 }}
                onPress={() => {
                    navigation.dispatch(DrawerActions.openDrawer())
                }}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        height: 55,
        width: "100%",
        // backgroundColor: "red",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 0,
        alignItems: "center"
    }
});

export default HomeHeader