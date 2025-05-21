import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { hideHeader } from '.';
import HomeScreen from '../screens/Dashboard/HomeScreen';
import { colors } from '../styles/color';
import HomeHeader from '../components/Dashboard/HomeHeader';
import { AppConst } from '../constants/AppConst';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { screenWidth } from '../styles/ResponsiveLayout';
import DrawerContainer from '../components/Drawer/DrawerContainer';
import StoreDetail from '../screens/StoreScreens/StoreDetail';
import BookingsScreen from '../screens/StoreScreens/BookingsScreen';
import { goBack, popToTop } from './RootNavigation';
import SettingScreen from '../screens/User/SettingScreen';
import UserCreditScreen from '../screens/User/UserCreditScreen';
import OrderDetailScreen from '../screens/StoreScreens/OrderDetailScreen';
import ReviewsScreen from '../screens/User/ReviewsScreen';
import { DrawerActions } from '@react-navigation/native';
import LoginScreen from '../screens/Auth/LoginScreen';
import OtpScreen from '../screens/Auth/OtpScreen';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return <Drawer.Navigator
    drawerType='front'
    overlayColor={"rgba(0,0,0,0.5)"}
    drawerStyle={{ width: screenWidth * 1 }}
    drawerContent={
      (option) =>
        <DrawerContainer {...option} />
    }
  >
    <Drawer.Screen
      name="home"
      component={HomeStackScreen}
      options={{ title: "Home" }}
    />
  </Drawer.Navigator>
}


const HomeStackScreen = () => (
  <Stack.Navigator
    screenOptions={{
      header: ({ navigation }) => (
        <View style={{ backgroundColor: colors.primary, paddingTop: Platform.OS == 'ios' ? AppConst.getStatusHeight().top : 8 }}>
          <HomeHeader navigation={navigation} />
        </View>
      )
    }}
  >
    <Stack.Screen name="homeStack" component={HomeScreen} options={{}} />
    <Stack.Screen name='myBookings' component={BookingsScreen} options={{ title: "My Bookings", }} />
    <Stack.Screen name='settings' component={SettingScreen} options={{ title: "Settings", }} />
    <Stack.Screen name='userCredits' component={UserCreditScreen} options={{ title: "Credits" }} />
    <Stack.Screen name='Reviews' component={ReviewsScreen} options={{}} />
  </Stack.Navigator>
)
const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        // headerTitleAlign: "left",
        headerLeft: () => <FontAwesome5 name='arrow-left' size={20} color={colors.white} onPress={() => goBack()} style={headerBackBtn} />,
      }}>
      <Stack.Screen
        name="home"
        // component={demo}
        component={DrawerNavigator}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          ...hideHeader
        }}
      />
      <Stack.Screen name='orderDetail' component={OrderDetailScreen} options={{ title: "Order Detail" }} />
      <Stack.Screen name='StoreDetail' component={StoreDetail} options={{ headerTransparent: true }} />
      <Stack.Screen name='loginScreen' component={LoginScreen} options={{ ...hideHeader }} />
      <Stack.Screen name='otpScreen' component={OtpScreen} options={{ ...hideHeader }} />
    </Stack.Navigator>
  );
};


export const DrawerScreenOptions = ({ navigation }) => {
  return {
    headerLeft: () => <AntDesign
      name='home'
      size={20}
      color={colors.white}
      onPress={() => {
        navigation?.dispatch(DrawerActions.closeDrawer())
        popToTop()
      }}
      style={headerBackBtn}
    />,
    headerRight: () => <AntDesign name='menu-fold' size={20} color={colors.white} onPress={() => navigation?.dispatch(DrawerActions.openDrawer())
    } style={{ padding: 10, zIndex: 1 }} />,
  }
}



const headerBackBtn = {
  paddingLeft: 15,
  zIndex: 1
};

export default StackNavigation;
