import { Platform } from 'react-native'
import { API_URI_SHARE_Separation } from '../store/actions/SocketAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/color';
import { buildNumber } from '../store/actions/AppAction';
import { env } from '../services/service';

export class AppConst {

  static isIosDevice() {
    if (Platform.OS === 'ios') {
      return true;
    }
    return false;
  }


  static appThis = null;
  static getAppThis() {
    return this.appThis;
  }
  static setAppThis(appThis) {
    this.appThis = appThis;
  }

  static appBuild = buildNumber;
  static setAppBuild(appBuild) {
    this.appBuild = appBuild;
  }

  static deviceToken = null;
  static getDeviceToken() {
    return this.deviceToken;
  }
  static setDeviceToken(deviceToken) {
    this.deviceToken = deviceToken;
  }

  static deviceId = null;
  static getDeviceId() {
    return this.deviceId;
  }
  static setDeviceId(deviceId) {
    this.deviceId = deviceId;
  }

  static clientId = null;
  static getClientId() {
    return this.clientId;
  }
  static setClientId(clientId) {
    this.clientId = clientId;
  }

  static accessToken = null;
  static setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  static authToken = null;
  static getAuthToken() {
    return this.authToken;
  }
  static setAuthToken(authToken) {
    this.authToken = authToken;
  }

  static accountId = null;
  static setAccountId(id) {
    this.accountId = id;
  }

  static paddingTop = Platform.OS === 'ios' ? 30 : 0;

  static statusHeight = {
    top: 0,
    bottom: 0,
    watchVideoHeight: 0,
  };
  static getStatusHeight() {
    return this.statusHeight;
  }
  static setStatusHeight(statusHeight) {
    this.statusHeight = statusHeight;
  }

  static replceAll(str, find, replace) {
    var re = new RegExp(find, 'g');
    return str.replace(re, replace);
  }
  static showConsoleLog(message, ...optionalParams) {
    console.log(message, ...optionalParams);
  }

  static jsonCopy = item => JSON.parse(JSON.stringify(item))
}

const razorpayLiveKey = 'rzp_live_DumllS2uq63eao';
const razorpayTestKey = 'rzp_test_ErlccR6IZTfR7W';
export const RazorpayConst = {
  key: env == "dev" ? razorpayTestKey : razorpayLiveKey,
  name: "Lugbee",
  secret: "yEKd0XN8ZjjXNrZzn72hPk73"
}

export const BaseValidation = {
  alphaNumeric: /^[a-zA-Z0-9]*$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  validEmail: /^\w+([\.-] ?\w +)*@\w + ([\.-] ?\w +)* (\.\w{ 2, 3 }) +$ /,
  url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
  password: /^(?=.*\d)(?=.*[!@#$%^&*. ])(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
  atleastOneAlphaOneNumeric: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
  alphabatic: /^[a-zA-Z]*$/,
  namealphabatic: /^[a-zA-Z ]*$/,
  numeric: /^[0-9]*$/,
  price: /^(\d*\.)?\d+$/,
  existAlphabatic: /[a-zA-Z]/,
  existOneNumber: /\d/,
  specialCharacter: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
  lowerCharacter: /[a-z]/,
  uppercaseCharacter: /[A-Z]/
};




export const noImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAHlBMVEX09PTh4eH19fXg4ODk5OTw8PDs7Ozq6uru7u7n5+dZKxXMAAAELUlEQVR4nO2dWXKtMAwFwQMX9r/hB9RNMOARhCTyTv/kIxVQl4kHYZmuAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAsZ03o9eA6OfwyH360bXWz30kyd2HHvbq8LaibQdJ2V+C7Yf6RSdQsEZOxApGqWCsyJNK5qPVsEZCsHOS1tksBNFI2rsZTY8gaG0QxaCRjRj0ITS4/wvW0judguaKbjaID1f+xLEZG8/psZtV6OeKF3GbH2DHW9fbDN0WgTn/j0wvBtVYEjSM9MAwxZgKAMMW4ChDLyGxoQ/eGA0NMYPk3O9c9PH80nyGZo1A/e9l3WEiZM8DxmeZm3GH/Ib1jFNXZna0AzntTFZcigPj2E8f2M/HIoshqkEFYsih+Fu7b9XZOhvWNow4bdw85YVMBjmkqg0Kb4sHG2YaUKaFF+W5w3zefDnO5vnR/wwPxXh8YwOw1Oaz4Pbmzct8ryhLxhe+EdsivRxw/RgePW2821a/uZ5w8ILt/auZp7Ct8Qqb9g6/17XKA3BKnhK227yswirjvZtPc22yqwN912jxW6bQGW87xrx93mCuoBfNWs7JkKqIuaYeWcf04brn3ey1ITMsXrK7F9oWD1Ft+pUxPyeFXB8L1I5aJYsRnKbTcM9E5utyleQzUTVz2eSu8mKYb8km5jbLleI+xUZ4cJ+wHzgr8jqFzY85iNnfPe0vJn5uVff8mamuKMzGzrn27Xu9+3a4Bu2JddsWc3Erv4NaeWe3HTw6t9yV246Tkev3bB6V3UyfOWGDdvGU/HrNmzbFx8X0GzYvPE/asA14l+hubIhqqC4DS+UbsQc9Bpeq005S2g1vFx8c7LQani5uuikIWhohnR5wI3yqaOHnOG8ZLQpxVv1YYd1p5jhuiZOKN4sgNsrShl+F/0xxfsVfjtFoRE/yGqcfkdQwhgqyrRhmLY5tiJJjWbwvkfEcJeXOjyoNEWoVrYND4m3UJGqyla2DU+ZxUCRqoxY1DCWOv3pbsjqpCUNo4LfVqQrBBc0jAquioaylF/OMCG4KlKW8j9vmBjxk4LUSLUhm6CUIZ+gkCGjoIwhp6CIIaughCGvoIAhsyC/Ibcg+4jPLsjdhvyCzIYCgryGEoK8hoV93u83lDn+i9VQ4iGFIQwrDN2fN/z7bQhDGMIQhjCEYdnwvxrxPyKnljIadn6QgNOwMxKwGgoDwxZgKAMMW4ChDE/N2kiCoyA4eYTgPO/t/PPluyc6COrICc5kDybZ1jodhPP+u4LFg1qkofjXyR9jIgzFaaKl84Rkoen9FDci1Tmb0h5JqM6gNFo7m2R5zgVFbd8kW5nHZzJOx0MowNqhHHiL4+h2H7ARZvl4HvUHAtfD1yfpycyX6TPSfwCxE8o+JXhADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAs/ANyGFT0fw3sTAAAAABJRU5ErkJggg=='

export const docTypeImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9RsiK7WSMHn6rVq5pLvEgINRyVTNKJ7drsg&usqp=CAU"

export const PriceSign = "$";

export const getDiscountWithtype = (type, discount) => {
  return `${type == "flat" ? PriceSign : ''}${discount}${type == "percentage" ? '%' : ''}`
}

export const returnPrice = (price, currency, discount = false) => {
  let sign = "\u20B9";
  // console.log(price)
  if (price == "free" || price == "Free" || price == null) {
    return sign + " " + "0"
  }
  // else {
  //   if (discount) {
  //     return ' '
  //   }
  return sign + " " + price
  // }
  return ''
}


export const checkUserLogin = () => {
  // const token = await AsyncStorage.getItem('token')
  const token = AppConst.userToken;
  // console.log("checkUserLogin token", token);
  if (token) {
    return true
  } else {
    return false
  }
  return token
}


export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return colors.red;
    case 'completed':
      return colors.green;
    case 'confirmed':
      return colors.green;
    case 'cancelled':
      return colors.yellow;
    case 'expired':
      return colors.yellow;
    case 'refunded':
      return colors.yellow;
    default:
      return colors.primary;
  }
}