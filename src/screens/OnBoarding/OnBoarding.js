import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import { Button, Loader } from '../../components/custom/CustomFields'
import { useDispatch } from 'react-redux';
import { changeAppStatus, getUserAuthToken } from '../../store/actions/UserAction';
import Screen1 from '../../components/OnBoarding/Screen1';
import Screen2 from '../../components/OnBoarding/Screen2';
import Screen3 from '../../components/OnBoarding/Screen3';
import { LargeTextStyle, MediumTextStyle, primaryColorBackground } from '../../styles/CommonStyling';
import { screenWidth } from '../../styles/ResponsiveLayout';
import { BuubleBackgroundSvg } from '../../assets/svg/splash/SplashSvgs';
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../../styles/color';
import AsyncStorage from '@react-native-async-storage/async-storage';


const OnBoarding = () => {
    const refContainer = useRef();
    const dispatch = useDispatch()
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [activity, setActivity] = React.useState(false);

    const screensArr = [
        {
            title: "Book Online",
            component: <Screen1 />
        },
        {
            title: "Drop Your Luggage",
            component: <Screen2 />
        },
        {
            title: "Enjoy the City Hassle-Free",
            component: <Screen3 />
        }
    ]

    const nextFunc = () => {
        if (currentIndex < screensArr.length - 1) {
            refContainer.current.scrollToIndex({ animated: true, index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1)
        }
    }

    const previousFunc = () => {
        refContainer.current.scrollToIndex({ animated: true, index: currentIndex - 1 });
        setCurrentIndex(currentIndex - 1)
    }

    const onDone = async () => {
        setActivity(true)
        await AsyncStorage.setItem('OnBoarding', 'true');
        // getUserAuthToken().then(() => {
        //     // setActivity(false)
        // })
        dispatch(changeAppStatus(2));
    }

    // console.log("current activeIndex: ", currentIndex);
    return (
        <View style={{ ...primaryColorBackground }}>
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={refContainer}
                    data={screensArr}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ width: screenWidth, overflow: "hidden" }}>
                                {item.component}
                                {/* {index === screensArr.length - 1 ? <Button title="Get Started" onPress={() => null} /> : null} */}
                                <View style={{ position: "absolute", bottom: 0, }}>
                                    <BuubleBackgroundSvg />
                                </View>
                            </View>
                        )
                    }}
                />
            </View>

            {currentIndex > 0 &&
                <AntDesign name="arrowleft" size={25} color="white" onPress={() => previousFunc()} style={{ position: "absolute", bottom: 10, padding: 25, }} />
            }
            {currentIndex == screensArr.length - 1 ?
                <View style={{ alignSelf: "flex-end", ...styles.started }}>
                    <Button title="Get Started" onPress={() => onDone()} />
                </View>
                // <TouchableOpacity style={styles.started} onPress={() => onDone()}>
                //     <Text style={[LargeTextStyle, { color: colors.secondary }]}>Get Started</Text>
                // </TouchableOpacity>
                :
                <Text onPress={() => nextFunc()} style={{ ...styles.nextIcon, ...LargeTextStyle, color: colors.white }}>Next</Text>
                // <Entypo name="chevron-right" size={45} color="white" style={styles.nextIcon} onPress={() => nextFunc()} />
            }
            {activity &&
                <Loader />
            }
        </View>
    )
}


const styles = StyleSheet.create({
    nextIcon: { position: "absolute", bottom: 10, padding: 25, left: screenWidth - 95, },
    started: { padding: 0, position: 'absolute', right: 10, bottom: 22, width: 140 },
})

export default OnBoarding