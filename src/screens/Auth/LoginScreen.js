import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View, KeyboardAvoidingView, Platform, Linking
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import { colors } from '../../styles/color';
import {
  commonTextStyle,
  fonts,
  LargeTextStyle,
  MediumTextStyle,
  primaryColorBackground,
  statusBar,
} from '../../styles/CommonStyling';
import {
  AppName,
  Button,
  InputField,
  Loader,
  Checkbox
} from '../../components/custom/CustomFields';
import CountryCode from '../../constants/CountryCode';
import {
  getAddressByLatLng,
  getCurrentLatLng,
} from '../../constants/GeoLocation';
import SocialLoginOptions from '../../components/Auth/SocialLoginOptions';
import { navigate } from '../../route/RootNavigation';
import CountryCodeModal from '../../components/Modals/CountryCodeModal';
import { getAvailableLoginType, getUserAuthToken, userSignup } from '../../store/actions/UserAction';
import { layoutAnimation } from '../../constants/Animations/layoutAnimation';
import { SafeAreaCustomView } from '../../styles/SafeAreaCustomView';
import { AppConst, BaseValidation } from '../../constants/AppConst';
import { changeAppStatus } from '../../store/actions/UserAction';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../store/actions/AppAction';
import { ExecuteOnlyOnAndroid } from '../Dashboard/HomeScreen';
import { env, privacyPolicyWebURL, prodEnv, termsConditionsWebURL } from '../../services/service';

const LoginScreen = ({ navigation, route }) => {
  const fromScreen = route.params?.fromScreen;
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [currentCoords, setCurrentCoords] = useState({});
  const [activity, setActivity] = useState(false);
  const [address, setAddress] = useState('');
  const [codeModal, setCodeModal] = useState(false);
  const [field, setField] = useState('');
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [loginType, setLoginType] = useState(null);
  const [promotionCheck, setPromotionCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    layoutAnimation();
    setTimeout(() => {
      getCoords();
    }, 1000);
  }, []);

  useEffect(() => {
    dispatch(setLoader(true))
    getAvailableLoginType().then(res => {
      console.log('getAvailableLoginType--', res);
      if (res?.status == 200) {
        let fb = res.data.Login_type.find(item => item.auth_type == 'fb');
        let google = res.data.Login_type.find(item => item.auth_type == 'google');
        let apple = res.data.Login_type.find(item => item.auth_type == 'apple');
        console.log('--', fb, google, apple);
        setLoginType({ fb, google, apple });
      }

      getUserAuthToken().then(r => {
        dispatch(setLoader(false))
        if (r) {
          setAuthToken(r.data.token);
        }
      });
    })
  }, []);

  const getCoords = () => {
    getCurrentLatLng(true, res => {
      console.log('res', res);
      if (res) {
        const coord = {
          latitude: res.lat,
          longitude: res.lng,
        };
        // setCurrentCoords(coord);
        setCurrentCoords({
          latitude: Number(res.lat).toFixed(7),
          longitude: Number(res.lng).toFixed(7),
        });

        getAddressByApi(res.lat, res.lng);
      }
    });
  };

  const getAddressByApi = async (lat, lng) => {
    console.log('lat', lat, 'lng', lng);
    // setActivity(true);
    const addrs = await getAddressByLatLng({ lat, lng });
    if (addrs) {
      console.log('addrs---', addrs);
      setAddress(addrs.formatted_address);
      CountryCode.map(item => {
        if (item.name === addrs.address.country) {
          setSelectedCode(item.dial_code);
        }
      });
    }
    // setActivity(false);
  };

  const check_text = text => {
    setField(text);

    if (field.trim().length > 2) {
      return;
    }
    if (
      text.startsWith(1) ||
      text.startsWith(2) ||
      text.startsWith(3) ||
      text.startsWith(4) ||
      text.startsWith(5) ||
      text.startsWith(6) ||
      text.startsWith(7) ||
      text.startsWith(8) ||
      text.startsWith(9) ||
      text.startsWith(0)
    ) {
      if (!selectedCode) {
        setSelectedCode('+91');
      }
      setIsMobile(true);
      layoutAnimation();
      // console.log(isMobile);
    } else {
      setIsMobile(false);
      layoutAnimation();
    }
  };
  // console.log("Login Type: ", loginType);

  const onLoginPress = () => {

    if (!field.trim()) {
      setError('Field is required');
      return;
    }
    if ((!isMobile && !BaseValidation.email.test(field.trim())) && env == prodEnv) {
      setError('Please enter valid email.');
      return;
    }
    if (isMobile && field.trim().length < 10) {
      setError('Please enter valid mobile number.');
      return;
    }

    if (error) {
      setError("");
    }
    let detail = {
      isMobile: isMobile,
      email: field.trim(),
      mobile: field.trim(),
      countryCode: selectedCode.replace('+', ''),
      promotion: promotionCheck ? 1 : 0
    }
    // return;
    setActivity(true);
    userSignup(detail, isMobile).then(res => {
      setActivity(false);
      if (res?.status == 200) {
        navigate('otpScreen', {
          details: { ...detail, otp_session_id: res.data.otp_session_id, account_id: res.data.account_id, authToken: authToken, fromScreen },
        });
        // navigate('otpScreen')
      }
    })
  }

  const onSkipPress = () => {
    dispatch(changeAppStatus(3));
  }

  const tcPress = () => {
    Linking.openURL(termsConditionsWebURL);
  }

  const privacyPress = () => {
    Linking.openURL(privacyPolicyWebURL);
  }
  // console.log('selected code', loginType);


  return (
    <View style={{ flex: 1 }}>
      <SafeAreaCustomView
        barStyle={statusBar.light}
        backgroundColor={colors.primary}>

        <ScrollView style={primaryColorBackground} keyboardShouldPersistTaps="handled">
          <View style={{ alignSelf: 'center', marginVertical: '25%' }}>
            <AppName />
          </View>

          <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : null} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ ...MediumTextStyle, color: colors.white, fontFamily: fonts.regular }}>Login with email or mobile</Text>

            <View
              style={{
                marginVertical: 15,
                marginHorizontal: 10,
                marginTop: 5
              }}>
              <InputField
                value={field}
                placeholder="Email Or Mobile Number"
                placeholderTextColor={colors.grey}
                // style={styles.LoginInput}
                maxLength={isMobile ? 12 : 50}
                onTextChange={text => {
                  check_text(text);
                }}
                onFocus={() => (error ? setError('') : null)}
                error={error}
                style={{ backgroundColor: colors.primary, borderRadius: 30 }}
                activeBorderColor={colors.secondary}
                textStyle={{ color: colors.white }}
                keyboardType='email-address'
                showIcon={() =>
                  isMobile ? (
                    <>
                      <TouchableOpacity
                        onPress={() => setCodeModal(true)}
                        style={{
                          justifyContent: 'center',
                          padding: 7,
                          paddingLeft: 0,
                          borderRightWidth: 0.5,
                          borderColor: colors.grey,
                        }}>
                        <Text style={styles.txt}>{selectedCode}</Text>
                      </TouchableOpacity>
                    </>
                  ) : null
                }
              />

              <View style={{ flexDirection: "row", padding: 10, paddingHorizontal: 25 }}>
                <Checkbox
                  value={promotionCheck}
                  onPress={() => setPromotionCheck(!promotionCheck)}
                />
                <Text style={[styles.infotxt, { marginLeft: 10 }]}>Get emails for latest travel updates, new exciting offers, discounts, promotion, and more!</Text>
              </View>
            </View>

            <View style={{ width: '85%', alignSelf: 'center' }}>
              <Button title="Login" onPress={() => onLoginPress()} />
            </View>

            {loginType && (loginType.fb?.login_type || loginType.google.login_type || loginType.apple.loginType) &&
              <View style={{ alignItems: 'center', marginTop: '10%' }}>
                <Text style={{ ...MediumTextStyle, color: colors.secondary }}>OR</Text>
                <Text style={{ ...MediumTextStyle, color: colors.white, marginTop: 5 }}>Login with</Text>
                <View style={{ width: '80%', padding: 10, alignSelf: 'center' }}>
                  <SocialLoginOptions
                    avalableType={loginType}
                  />
                </View>
              </View>
            }
          </KeyboardAvoidingView>
          {codeModal && (
            <CountryCodeModal
              close={() => setCodeModal(false)}
              onSelect={code => {
                setSelectedCode(code.dial_code);
                setCodeModal(false);
              }}
            />
          )}
        </ScrollView>
        <TouchableOpacity onPress={() => onSkipPress()} style={{ padding: 5, alignSelf: "flex-end", paddingHorizontal: 40 }}>
          <Text style={{ ...styles.boldTxt }}>SKIP</Text>
        </TouchableOpacity>
        <View style={{ margin: 20, marginTop: 10 }}>
          <Text style={[styles.infotxt,]}>
            <Text>By signing up you agree to Lugbee </Text>
            <Text onPress={() => tcPress()} style={styles.infoLinkText}>Terms and Conditions</Text>
            <Text>, and </Text>
            <Text onPress={() => privacyPress()} style={styles.infoLinkText}>Privacy Policy</Text>
          </Text>
        </View>
      </SafeAreaCustomView>

      {Platform.OS !== 'ios' ? (
        <ExecuteOnlyOnAndroid navigation={navigation} message={"tap back again to exit the App"} />
      ) : (
        <></>
      )}
      {activity && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  LoginInput: {
    flex: 1,
    ...commonTextStyle,
    paddingHorizontal: 10,
  },
  countryCode: {
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 10,
    shadowColor: colors.black,
  },
  txt: {
    ...commonTextStyle,
    color: colors.white,
  },
  boldTxt: {
    ...commonTextStyle,
    color: colors.secondary,
    fontFamily: fonts.bold,
    textAlign: "right",
  },
  infotxt: {
    fontSize: 12,
    fontFamily: fonts.light,
    color: colors.white,
    textAlign: "center",
    lineHeight: 16
  },
  infoLinkText: {
    fontFamily: fonts.medium,
    color: colors.secondary,
  }
});

export default LoginScreen;
