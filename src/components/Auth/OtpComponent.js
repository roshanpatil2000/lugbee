import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from '../../styles/color';
import { MediumTextStyle } from '../../styles/CommonStyling';
import { userSignup } from '../../store/actions/UserAction';

const OtpComponent = ({ setotp, otp, text, resendPress = () => null, detail, setDetail, setActivity, theme = "dark", isVerify = false }) => {
  const firstRef = useRef();
  const secondRef = useRef();
  const thirdRef = useRef();
  const fourRef = useRef();
  const fiveRef = useRef();
  const sixRef = useRef();
  const re = /^[0-9\b]+$/;
  useEffect(() => {
    firstRef.current.focus();
  }, []);

  const [counter, setCounter] = useState(45);
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const onResend = async () => {
    if (counter > 1) {
      return;
    }
    if (isVerify && counter <= 1) {
      resendPress();
      return;
    }
    // resendPress && resendPress() && counter > 0 && resendPress();
    // alert(resendPress && !detail && counter <= 1)
    if (counter > 0 || !detail) {
      return
    }
    // return;
    // let r = await resendPress()
    if (!isVerify) {
      setActivity(true);
      userSignup(detail, detail.isMobile).then(res => {
        setActivity(false);
        setCounter(45);
        if (res.status == 200) {
          setDetail({ ...detail, otp_session_id: res.data.otp_session_id, account_id: res.data.account_id });
          return res
          // navigate('otpScreen')
        }
      })
    }
  }

  // console.log(counter, detail);
  return (
    <View style={{ width: "100%" }}>
      <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-evenly" }}>
        {/* <View style={{ ...styles.otp, alignItems: "center", justifyContent: "center" }}> */}
        <TextInput
          placeholder="-"
          style={{ ...styles.otp, color: theme == "light" ? colors.black : colors.white }}
          maxLength={1}
          ref={firstRef}
          value={otp.first}
          onKeyPress={e => {
            if (e.nativeEvent.key == 'Backspace') {
              firstRef.current.focus();
            }
          }}
          keyboardType={'numeric'}
          onChangeText={text => {
            console.log(otp);
            if (re.test(text)) {
              setotp({ ...otp, first: text });
              text && secondRef.current.focus();
            } else {
              setotp({ ...otp, first: '' });
            }
          }}
        />
        {/* </View> */}
        <TextInput
          placeholder="-"
          style={{ ...styles.otp, color: theme == "light" ? colors.black : colors.white }}
          maxLength={1}
          textAlign={'center'}
          value={otp.second}
          onKeyPress={e => {
            if (e.nativeEvent.key == 'Backspace') {
              if (otp.second !== '') {
                secondRef.current.focus();
              } else if (e.nativeEvent.key == 'Backspace') {
                if (otp.second == '') {
                  firstRef.current.focus();
                }
              }
            }
          }}
          ref={secondRef}
          keyboardType={'number-pad'}
          onChangeText={text => {
            console.log(otp);
            if (re.test(text)) {
              setotp({ ...otp, second: text });
              text && thirdRef.current.focus();
            } else {
              setotp({ ...otp, second: '' });
            }
          }}
        />
        <TextInput
          placeholder="-"
          style={{ ...styles.otp, color: theme == "light" ? colors.black : colors.white }}
          value={otp.third}
          onKeyPress={e => {
            if (e.nativeEvent.key == 'Backspace') {
              if (otp.third !== '') {
                thirdRef.current.focus();
              } else if (e.nativeEvent.key == 'Backspace') {
                if (otp.third == '') {
                  secondRef.current.focus();
                }
              }
            }
          }}
          maxLength={1}
          ref={thirdRef}
          keyboardType={'number-pad'}
          onChangeText={text => {
            if (re.test(text)) {
              setotp({ ...otp, third: text });
              text && fourRef.current.focus();
            } else {
              setotp({ ...otp, third: '' });
            }
          }}
        />
        <TextInput
          placeholder="-"
          style={{ ...styles.otp, color: theme == "light" ? colors.black : colors.white }}
          value={otp.four}
          maxLength={1}
          ref={fourRef}
          onKeyPress={e => {
            if (e.nativeEvent.key == 'Backspace') {
              if (otp.four != '') {
                fourRef.current.focus();
              } else if (e.nativeEvent.key == 'Backspace') {
                if (otp.four == '') {
                  thirdRef.current.focus();
                }
              }
            }
          }}
          keyboardType={'number-pad'}
          onChangeText={text => {
            console.log(otp);
            if (re.test(text)) {
              setotp({ ...otp, four: text });
              fiveRef.current.focus();
            } else {
              setotp({ ...otp, four: '' });
            }
          }}
        />
        <TextInput
          placeholder="-"
          style={{ ...styles.otp, color: theme == "light" ? colors.black : colors.white }}
          value={otp.five}
          maxLength={1}
          ref={fiveRef}
          onKeyPress={e => {
            if (e.nativeEvent.key == 'Backspace') {
              if (otp.five != '') {
                fiveRef.current.focus();
              } else if (e.nativeEvent.key == 'Backspace') {
                if (otp.five == '') {
                  fourRef.current.focus();
                }
              }
            }
          }}
          keyboardType={'number-pad'}
          onChangeText={text => {
            console.log(otp);
            if (re.test(text)) {
              setotp({ ...otp, five: text });
              sixRef.current.focus();
            } else {
              setotp({ ...otp, five: '' });
            }
          }}
        />
        <TextInput
          placeholder="-"
          style={{ ...styles.otp, color: theme == "light" ? colors.black : colors.white }}
          value={otp.six}
          maxLength={1}
          ref={sixRef}
          onKeyPress={e => {
            if (e.nativeEvent.key == 'Backspace') {
              if (otp.six != '') {
                sixRef.current.focus();
              } else if (e.nativeEvent.key == 'Backspace') {
                if (otp.six == '') {
                  fiveRef.current.focus();
                }
              }
            }
          }}
          keyboardType={'number-pad'}
          onChangeText={text => {
            console.log(otp);
            if (re.test(text)) {
              setotp({ ...otp, six: text });
            } else {
              setotp({ ...otp, six: '' });
            }
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10,
          marginVertical: 20,
          marginHorizontal: 20
        }}>
        {counter == 0 ? (
          <Text style={[styles.optntxt, { color: theme == "light" ? colors.black : colors.white }]}> </Text>
        ) : (
          <Text style={[styles.optntxt, { color: theme == "light" ? colors.black : colors.white }]}>Timing:{counter}</Text>
        )}

        <TouchableOpacity
          disabled={counter > 1}
          onPress={() => onResend()}>
          <Text style={[styles.optntxt, { color: counter > 0 ? colors.grey : theme == "light" ? colors.black : colors.white }]}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  otp: {
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.yellow,
    // marginHorizontal: 10,
    borderRadius: 5,
    width: 40,
    height: 45,
    color: colors.white,
    // backgroundColor: "red",
  },
  optntxt: {
    ...MediumTextStyle,
    fontWeight: '600',
    color: colors.white,
  },
});

export default OtpComponent;
