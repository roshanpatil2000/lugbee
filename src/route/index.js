import React, { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { goBack, navigationRef } from './RootNavigation';
import { connect } from 'react-redux';
import StackNavigation from "./StackNavigation"
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import OnBoarding from '../screens/OnBoarding/OnBoarding';
import OtpScreen from '../screens/Auth/OtpScreen';




const Stack = createStackNavigator();

export const hideHeader = {
    headerShown: false
}

const showHeader = {
    headerShown: true
}



const getScreens = (status, activeScreen, coursePurchase) => {
    switch (status) {
        case 0:
            return <Stack.Navigator>
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Navigator>
        case 1:
            return <Stack.Navigator>
                <Stack.Screen
                    name="onBoarding"
                    component={OnBoarding}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Navigator>
        case 2:
            return <Stack.Navigator screenOptions={{ ...hideHeader, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
                <Stack.Screen name='login' component={LoginScreen} />
                <Stack.Screen name='otpScreen' component={OtpScreen} />
            </Stack.Navigator>
        case 3:
            return <Stack.Navigator
                headerMode="float"
                screenOptions={{
                }}>
                <Stack.Screen name='Stack' component={StackNavigation} options={hideHeader} />
            </Stack.Navigator>
    }
}


const Navigator = ({ status, loader }) => {
    const [isNetworkActive, setIsNetworkActive] = useState(true);


    useEffect(() => {

    }, [isNetworkActive])


    return (
        <>
            <NavigationContainer ref={navigationRef}>
                {getScreens(status)}
            </NavigationContainer>
        </>
    );

}


/*For navigate 
RootNavigation.navigate('ChatScreen', { userName: 'Lucy' });

//For push and pop
import { StackActions } from '@react-navigation/native';

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}
*/

const mapStateToProps = (state) => {
    return {
        status: state.app.app_status,
        loader: state.app.loading,
    }
}

export default connect(mapStateToProps)(Navigator);