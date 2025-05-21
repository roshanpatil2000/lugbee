import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import AntDesign from "react-native-vector-icons/AntDesign";
import { fonts, LargeTextStyle, MediumTextStyle } from '../../styles/CommonStyling';
import { colors, lightgrey } from '../../styles/color';
import { Button } from '../custom/CustomFields';
import { get15MinutesFormat } from '../../constants/TimeConst';
import WheelPicker from 'react-native-wheely';
import TimePickerComponent from '../custom/TimePickerComponent';
import { AppConst } from '../../constants/AppConst';
import Toast from 'react-native-toast-message';



const CalenderModal = ({ close, onDaySelect, selectedDate, type, isTimePicker = false, minTime, minDate }) => {
    const [onMonthChange, setOnMonthChange] = useState(null);
    const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
    const [showTimePicker, setShowTimerPicker] = useState(false);
    const [selected, setSelected] = useState(selectedDate);
    const [minimumField, setMinimumField] = useState({ minTime, minDate });

    const maxValue = 23;
    const minValue = minTime ? minTime.hour : 0;

    const minMin = minTime ? minTime.min : 0;
    const maxMin = 59;
    const [minArr, setMinArr] = useState([]);
    const [arr, setArr] = useState([]);
    const [selectedHour, setSelectedHour] = useState(null)//(minValue == 0 ? '00' : minValue);
    const [selectedMin, setSelectedMin] = useState(minMin == 0 ? '00' : minMin);
    const scrollY = useRef(new Animated.Value(0)).current;
    const minScrollY = useRef(new Animated.Value(0)).current;
    const flatRef = useRef(null);
    const minRef = useRef(null);
    const hourIndexRef = useRef(0);
    const minIndexRef = useRef(0);
    const ITEM_SIZE = (140 / 3);

    let oneYr = moment().add(1, 'year').format('YYYY-MM-DD');


    useEffect(() => {
        if (selectedHour && selectedMin) {
            setShowTimerPicker(true);
        }
    }, [selectedHour])


    const Arrow = ({ direction }) => {
        return <AntDesign name={direction == 'right' ? 'right' : 'left'} size={20} color="black" style={{}} />
    }


    const arrangeCurrentDateTime = () => {
        const isFrom = type == 'From' ? true : false;
        let a = [];
        // let hr = isFrom? moment().format('HH'):moment(selectedHour, 'HH').add(15,"minutes").format('HH');
        let hrMin = isFrom ? moment().format('HH:mm') : moment(minTime.hour + ":" + minTime.min, 'HH:mm').add(40, "minutes").format('HH:mm');
        // let hrMin = moment().format('HH:mm');
        console.log("hrMin", hrMin);
        if (!hrMin)
            return;
        let currentFomat = get15MinutesFormat(Number(hrMin.split(":")[1]), Number(hrMin.split(":")[0]));
        let setHr = currentFomat.split(":")[0];
        let setMin = currentFomat.split(":")[1];
        setMinimumField({ ...minimumField, minTime: { hour: setHr, min: setMin } });

        for (let i = setHr; i <= maxValue; i++) {
            let st = String(i);
            if (i < 10) {
                st = "0" + st
            }
            a = [...a, String(st)];
        }
        console.log(a, setMin);
        setArr(a);
        setMinArr(["00", "15", "30", "45"]);
        setSelectedHour(setHr);
        setSelectedMin(setMin);

        // if (setMin == "00") {
        // } else if (setMin == "15") {
        //     setMinArr(["15", "30", "45"]);
        // } else if (setMin == "30") {
        //     setMinArr(["30", "45"]);
        // } else if (setMin == "45") {
        //     setMinArr(["45"]);
        // }
    }
    const dayPress = (date) => {
        setSelected(date);
        if (isTimePicker) {
            let fDate = moment().format("YYYY-MM-DD");
            if (date == fDate) {
                AppConst.showConsoleLog("Today");
                arrangeCurrentDateTime();
                // setMinArr(["00", "15", "30", "45"]);
            }
            else if (date == minDate) {
                AppConst.showConsoleLog("Date min", minimumField);
                arrangeCurrentDateTime();
                return;
                let hrMin = moment(minTime.hour + ":" + minTime.min, 'HH:mm').add(15, 'minutes').format('HH:mm');
                let hr = hrMin.split(":")[0];
                let min = hrMin.split(":")[1];
                setMinimumField({ ...minimumField, minTime: { hour: hr, min: min } });
                let a = [];
                for (let i = hr; i <= maxValue; i++) {
                    a = [...a, String(i)];
                }
                console.log(a);
                setArr(a);
                setMinArr(["00", "15", "30", "45"]);
                setSelectedHour(hr);
                setSelectedMin(min);
            }
            else {
                let a = [];
                for (let i = 0; i <= maxValue; i++) {
                    let st = String(i);
                    if (i < 10) {
                        st = "0" + st
                    }
                    a = [...a, st];
                }
                console.log('arr', a);
                setMinimumField({ ...minimumField, minTime: { hour: 0, min: 0 } });
                setArr(a);
                setMinArr(["00", "15", "30", "45"]);
                setSelectedHour("00");
                setSelectedMin("00");
            }
            // setShowTimerPicker(true);
            return;
        }
        onDaySelect({ date });
    }

    const timeReturn = () => {
        let currentFomat = minimumField.minTime.hour + ":" + minimumField.minTime.min;
        let hr = (String(selectedHour).length == 1) ? "0" + String(selectedHour) : selectedHour
        let d = {
            date: selected,
            time: hr + ":" + selectedMin
        }
        let sDate = moment(`${minDate}, ${currentFomat}`, "YYYY-MM-DD, HH:mm").toDate();
        let cDate = moment(`${d.date}, ${d?.time}`, "YYYY-MM-DD, HH:mm").toDate() //.format("YYYY-MM-DD, HH:mm");

        AppConst.showConsoleLog(cDate, sDate, moment(cDate).isBefore(moment(sDate)));
        // return;
        if ((d.time < currentFomat) && ((type !== 'From' && moment(cDate).isBefore(moment(sDate))) || (type == 'From' && currentDate == d.date))) {
            Toast.show({
                text1: "Please select valid time",
                type: "error",
                duration: 3000
            });
            // alert();
            return;
        }

        // if (d.date == minDate) {
        //     var a = moment(d.time, 'HH:mm');//now
        //     var b = moment(currentFomat, 'HH:mm');

        //     console.log(a.diff(b, 'minutes')) // 44700
        //     if (a.diff(b, 'minutes') < 60) {
        //         Toast.show({
        //             text1: "Minimum booking time is 1 hour",
        //             type: "error",
        //             duration: 3000
        //         });
        //         return;
        //     }
        //     // console.log(moment.duration(d.time.diff(currentFomat)).asMinutes());
        // return;
        // }
        if (type == "From") {
            setShowTimerPicker(false);
        }
        onDaySelect(d)
    }
    // console.log(type);



    console.log("minimum field", minimumField);
    console.log("current hour ", selectedHour);

    return (
        <Modal
            visible
            animationType="none"
            transparent={true}
            onRequestClose={() => close()}
        >
            <View style={styles.container}>

                {!showTimePicker ?
                    <View style={{}}>
                        {type ? <View style={styles.clndrheader}>
                            <Text style={styles.hdrTxt}>{type}</Text>
                            <AntDesign
                                name="close"
                                size={20}
                                color={colors.primary}
                                style={styles.closeIcon}
                                onPress={() => close()}
                            />
                        </View>
                            : null
                        }
                        <Calendar
                            current={currentDate}
                            minDate={minimumField?.minDate ? moment(minimumField?.minDate, "YYYY-MM-DD").format("YYYY-MM-DD") : currentDate}
                            maxDate={oneYr}
                            onDayPress={(day) => {
                                let d = day.dateString
                                let date = moment(d, "YYYY-MM-DD").format("YYYY-MM-DD")
                                console.log('selected day', date)
                                dayPress(date)
                            }}
                            onDayLongPress={(day) => { console.log('selected day', day) }}
                            monthFormat={'yyyy MM'}
                            onMonthChange={(month) => {
                                setOnMonthChange(month)
                            }}
                            renderArrow={(direction) => (<Arrow direction={direction} />)}
                            hideExtraDays={true}
                            firstDay={0}
                            hideDayNames={false}
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            markedDates={
                                { [selected ? selected : currentDate]: { selected: true, selectedColor: colors.primary } }}
                            disableAllTouchEventsForDisabledDays={true}
                            renderHeader={(date) => {
                                const mnth = onMonthChange ? moment(onMonthChange.timestamp).format('MMMM') : moment(date).format('MMMM');
                                return <View style={{}}>
                                    {/* <Text style={{ ...styles.mnth, color: colors.grey, bottom: 12 }}>From</Text> */}
                                    <Text allowFontScaling={false} style={styles.mnth}>{mnth}</Text>
                                </View>
                            }}
                            enableSwipeMonths={true}
                            style={styles.clndr}
                        />
                    </View>
                    :

                    <View style={styles.timePicker}>
                        <AntDesign name='close' size={25} color={colors.primary} onPress={() => close()} style={[styles.closeIcon, { padding: 10, zIndex: 1 }]} />
                        <Text style={{ ...LargeTextStyle, color: colors.primary, textAlign: "center" }}>{type} Date</Text>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 15, borderBottomWidth: 0.5 }}>
                            {/* {!moment(selected).isBefore(moment()) ?
                                <AntDesign name='arrowleft' color={"grey"} size={22} onPress={() => onDayLess()} />
                                : <View style={{ width: 22 }} />
                            } */}
                            <Text onPress={() => setShowTimerPicker(false)} style={{ ...MediumTextStyle }}>{selected}</Text>
                            {/* <AntDesign name='arrowright' color={"grey"} size={22} onPress={() => onDayAdd()} /> */}
                        </View>
                        <View style={{ justifyContent: "space-between", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderColor: colors.grey }}>
                            <Text style={{ ...LargeTextStyle, color: colors.primary, textAlign: "center", marginBottom: 10 }}>Time</Text>
                            <Text style={{ ...MediumTextStyle }}>{selectedHour}:{selectedMin}</Text>
                        </View>
                        <TimePickerComponent
                            hours={arr}
                            minutes={minArr}
                            minimumMin={minimumField.minTime.min}
                            setSelectedHour={setSelectedHour}
                            setSelectedMin={setSelectedMin}
                        />

                        <View style={{ paddingTop: 10 }}>
                            <Button
                                title='Done'
                                onPress={() => timeReturn()}
                            />
                        </View>
                    </View>
                    // <View style={styles.timePicker}>
                    //     <AntDesign name='close' size={25} color={colors.primary} onPress={() => close()} style={[styles.closeIcon, { padding: 10, zIndex: 1 }]} />
                    //     <Text style={{ ...LargeTextStyle, color: colors.primary, textAlign: "center" }}>{type} Date</Text>
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, borderBottomWidth: 0.5 }}>
                    //         {!moment(selected).isBefore(moment()) ?
                    //             <AntDesign name='arrowleft' color={"grey"} size={22} onPress={() => onDayLess()} />
                    //             : <View style={{ width: 22 }} />
                    //         }
                    //         <Text onPress={() => setShowTimerPicker(false)} style={{ ...MediumTextStyle }}>{selected}</Text>
                    //         <AntDesign name='arrowright' color={"grey"} size={22} onPress={() => onDayAdd()} />
                    //     </View>
                    //     <View style={{ justifyContent: "space-between", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderColor: colors.grey }}>
                    //         <Text style={{ ...LargeTextStyle, color: colors.primary, textAlign: "center", marginBottom: 10 }}>Time</Text>
                    //         <Text style={{ ...MediumTextStyle }}>{selectedHour}:{selectedMin}</Text>
                    //     </View>

                    //     <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 30, alignItems: 'center', borderBottomWidth: 1, borderColor: colors.grey }}>
                    //         <View style={[styles.timeSlct, { backgroundColor: 'white' },]}>

                    //             <Animated.FlatList
                    //                 ref={flatRef}
                    //                 data={arr}
                    //                 keyExtractor={item => String(item)}
                    //                 showsVerticalScrollIndicator={false}
                    //                 onScroll={Animated.event(
                    //                     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    //                     { useNativeDriver: true }
                    //                 )}
                    //                 contentContainerStyle={{ paddingVertical: (145 - ITEM_SIZE) / 2 }}
                    //                 onMomentumScrollEnd={(event) => {
                    //                     // console.log(Math.round(event.nativeEvent.contentOffset.y / (150 / 3)));
                    //                     flatRef.current.scrollToIndex({ viewPosition: .5, index: Math.round(event.nativeEvent.contentOffset.y / (140 / 3)) })
                    //                     hourIndexRef.current = Math.round(event.nativeEvent.contentOffset.y / (140 / 3));
                    //                     setSelectedHour(arr[hourIndexRef.current]);
                    //                     alert(minTime && Number(minTime.hour) == Number(arr[hourIndexRef.current]))
                    //                     if (minTime && Number(minTime.hour) < Number(arr[hourIndexRef.current])) {
                    //                         setMinArr(["00", "15", "30", "45"]);
                    //                         setSelectedMin("00");
                    //                     }
                    //                     if (minTime && Number(minTime.hour) == Number(arr[hourIndexRef.current]) && selected == currentDate) {
                    //                         console.log("helloo")
                    //                         arrangeCurrentDateTime();
                    //                         return;
                    //                     }
                    //                     if (minTime && Number(minTime.hour) == Number(arr[hourIndexRef.current])) {
                    //                         let hr = moment().format('HH');
                    //                         let min = moment().format('mm');
                    //                         let currentFomat = get15MinutesFormat(Number(min), hr);
                    //                         let setMin = currentFomat.split(":")[1];
                    //                         if (minValue == "00") {
                    //                             setMinArr(["15", "30", "45"]);
                    //                         } else if (minValue == "15") {
                    //                             setMinArr(["30", "45"]);
                    //                         } else if (minValue == "30") {
                    //                             setMinArr(["45"]);
                    //                         }
                    //                     }
                    //                 }}


                    //                 renderItem={({ item, index }) => {
                    //                     const inputRange = [
                    //                         (index - 1) * ITEM_SIZE,
                    //                         (index) * ITEM_SIZE,
                    //                         (index + 1) * ITEM_SIZE
                    //                     ];
                    //                     const opacity = scrollY.interpolate({
                    //                         inputRange,
                    //                         outputRange: [.5, 1, .5]
                    //                     });
                    //                     const scale = scrollY.interpolate({
                    //                         inputRange,
                    //                         outputRange: [.5, 1.2, .5]
                    //                     });


                    //                     return <Animated.View
                    //                         style={[
                    //                             { height: 140 / 3, alignItems: 'center', width: 55, justifyContent: 'center', backgroundColor: "white" },
                    //                             // item == hr ? { backgroundColor: DashboardDarkColor } : null,
                    //                             { opacity, transform: [{ scale }] },
                    //                         ]}
                    //                     // onPress={() => setHr(item)}
                    //                     >
                    //                         <Text
                    //                             style={[styles.tym,
                    //                             { fontSize: 18, textAlignVertical: 'center', width: '100%', textAlign: 'center' },

                    //                             ]}
                    //                         >{item}</Text>

                    //                     </Animated.View>
                    //                 }}
                    //             />

                    //         </View>

                    //         <View style={styles.separator} />

                    //         <View style={[styles.timeSlct, { backgroundColor: 'white' }]}>
                    //             <Animated.FlatList
                    //                 ref={minRef}
                    //                 data={minArr}
                    //                 keyExtractor={item => String(item)}
                    //                 showsVerticalScrollIndicator={false}
                    //                 onScroll={Animated.event(
                    //                     [{ nativeEvent: { contentOffset: { y: minScrollY } } }],
                    //                     { useNativeDriver: true }
                    //                 )}
                    //                 pagingEnabled
                    //                 contentContainerStyle={{ paddingVertical: (145 - ITEM_SIZE) / 2 }}
                    //                 onMomentumScrollEnd={(event) => {
                    //                     // console.log(Math.round(event.nativeEvent.contentOffset.y / (150 / 3)));
                    //                     minRef.current.scrollToIndex({ viewPosition: .5, index: Math.round(event.nativeEvent.contentOffset.y / (140 / 3)) })
                    //                     minIndexRef.current = Math.round(event.nativeEvent.contentOffset.y / (140 / 3));
                    //                     setSelectedMin(minArr[minIndexRef.current]);
                    //                 }}

                    //                 renderItem={({ item, index }) => {
                    //                     const inputRange = [
                    //                         (index - 1) * ITEM_SIZE - 0,
                    //                         (index) * ITEM_SIZE + 0,
                    //                         (index + 1) * ITEM_SIZE + 0
                    //                     ];
                    //                     const opacity = minScrollY.interpolate({
                    //                         inputRange,
                    //                         outputRange: [.5, 1, .5]
                    //                     });
                    //                     const scale = minScrollY.interpolate({
                    //                         inputRange,
                    //                         outputRange: [.5, 1.2, .5]
                    //                     });


                    //                     return <Animated.View
                    //                         style={[
                    //                             { height: 140 / 3, alignItems: 'center', width: 55, justifyContent: 'center', },
                    //                             { opacity, transform: [{ scale }], },
                    //                         ]}
                    //                     >
                    //                         <Text
                    //                             style={[styles.tym,
                    //                             { fontSize: 18, textAlignVertical: 'center', width: '100%', textAlign: 'center', },

                    //                             ]}
                    //                             onPress={() => {
                    //                                 // minRef.current.scrollToIndex({ animated: true, index:  })
                    //                             }}
                    //                         >{item}</Text>

                    //                     </Animated.View>
                    //                 }}
                    //             />

                    //         </View>

                    //     </View>
                    //     <View style={{ paddingTop: 10 }}>
                    //         <Button
                    //             title='Done'
                    //             onPress={() => timeReturn()}
                    //         />
                    //     </View>
                    // </View>
                }
            </View>
        </Modal >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    mnth: {
        ...MediumTextStyle,
        textAlign: "center",
    },
    clndrheader: {
        // top: -10,
        width: "80%",
        alignSelf: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.grey,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    clndr: {
        borderRadius: 5,
        overflow: "hidden",
        // position: "absolute",
        width: "80%",
        alignSelf: "center",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    closeIcon: {
        position: "absolute",
        right: 10,
        padding: 15,
    },
    hdrTxt: {
        ...MediumTextStyle,
        textAlign: "center",
        color: colors.grey
    },
    timeSlct: {
        height: 140,
        width: '45%',
        alignItems: 'center',
    },
    timeTxt: {
        fontSize: 14,
        fontFamily: fonts.light,
        color: "black",
        paddingBottom: 5
    },
    tym: {
        ...MediumTextStyle,
        color: colors.primary
    },
    separator: {
        height: 140,
        width: 1,
        backgroundColor: colors.grey,
    },
    timePicker: {
        padding: 10,
        backgroundColor: "white",
        width: "80%",
        alignSelf: "center",
        borderRadius: 10,
        position: "absolute",
        top: "25%"
    }
});

export default CalenderModal