import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WheelPicker from 'react-native-wheely';
import { colors, lightgrey } from '../../styles/color';
import { largeMediumStyle, MediumTextStyle } from '../../styles/CommonStyling';



const TimePickerComponent = ({ hours, minutes, setSelectedHour, setSelectedMin, minimumMin }) => {

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {/* {console.log("minArr", minArr)} */}
            <WheelPicker
                selectedIndex={0}
                options={hours}
                onChange={(index) => {
                    console.log(index);
                    setSelectedHour(hours[index])
                }}
                containerStyle={{ backgroundColor: "white", width: "30%" }}
                itemTextStyle={{ color: "black", fontSize: 20 }}
                selectedIndicatorStyle={{ backgroundColor: lightgrey }}
            />
            <Text style={styles.seprator}>:</Text>
            <WheelPicker
                selectedIndex={minutes.indexOf(minimumMin)}
                options={minutes}

                onChange={(index) => setSelectedMin(minutes[index])}
                containerStyle={{ backgroundColor: "white", width: "30%" }}
                itemTextStyle={{ color: "black", fontSize: 20 }}
                selectedIndicatorStyle={{ backgroundColor: lightgrey }}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    seprator: {
        ...largeMediumStyle,
        position: "absolute",
        top: "45%",
        left: "50%",
        color: colors.black
    }
});

export default TimePickerComponent