import React, { useEffect, useRef } from 'react'
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../../styles/color';
import { commonTextStyle, fonts, MediumTextStyle } from '../../styles/CommonStyling';

const BottomListSheet = ({ visible, close, options, onPress = () => { } }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, []);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 1]
  });

  // const translateX = animation.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: [500, 1]
  // })

  const closeModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => close());
  }


  const onOptionPress = (type) => {
    // closeModal()
    onPress(type)
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={() => closeModal()}
      transparent={true}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        onPress={() => closeModal()}
      >
        <Animated.View style={{
          position: 'absolute', bottom: 20, width: '100%',
          transform: [{ translateY }]
        }}
        >
          <View style={[styles.optnView, { marginBottom: 10, padding: 0 }]}>
            {options.map((item, index) => {
              if (item.text) {
                return (
                  <View key={String(index)} style={{ width: "100%" }}>
                    {item.text ?
                      <TouchableOpacity
                        // style={{ backgroundColor: "red" }}
                        style={[styles.optnList, index == 0 ? { borderTopWidth: 0 } : null,]}
                        onPress={() => onOptionPress(item)}
                      >
                        <Text allowFontScaling={false} style={[styles.optnTxt, { color: item.color ? item.color : colors.black }]}>{item.text}</Text>
                      </TouchableOpacity> : null}
                  </View>
                )
              }
            })}
          </View>
          <TouchableOpacity activeOpacity={1} style={styles.optnView} onPress={() => closeModal()}>
            <Text allowFontScaling={false} style={styles.optnTxt}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  )
}


const styles = StyleSheet.create({
  optnView: {
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10
  },
  optnTxt: {
    ...MediumTextStyle,
    fontSize: 15
  },
  optnList: {
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderColor: 'lightgrey',
    // width: '100%',
    alignItems: 'center',
    // marginHorizontal: 10
  }
})

export default BottomListSheet;