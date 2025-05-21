import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnUI,
} from 'react-native-reanimated';
import { largeMediumStyle, MediumTextStyle } from '../../styles/CommonStyling';
import { colors } from '../../styles/color';
import { DoubleArrowSvg } from '../../assets/svg/basic/basiciconSvg';
import { screenHeight } from '../../styles/ResponsiveLayout';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');


// type BottomSheetProps = {
//     children?: React.ReactNode;
// };

// export type BottomSheetRefProps = {
//     scrollTo: (destination: number) => void;
//     isActive: () => boolean;
// };

const BottomSheet = React.forwardRef(
    // const BottomSheet =
    (props, ref) => {
        const translateY = useSharedValue(0);
        const active = useSharedValue(false);
        const [atTop, setAtTop] = useState(false);
        const heightDivide = {
            small: props.banner ? 3.8 : 2.2,
            normal: props.banner ? 2.8 : 2,
            big: props.banner ? 2.4 : 1.8,
        }
        const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 0;
        const MIN_TRANSLATE_Y = SCREEN_HEIGHT < 700 ? -SCREEN_HEIGHT / heightDivide.small : SCREEN_HEIGHT > 810 ? -SCREEN_HEIGHT / heightDivide.big : -SCREEN_HEIGHT / heightDivide.normal;

        const scrollTo = useCallback((destination) => {
            'worklet';
            active.value = destination !== 0;

            translateY.value = withSpring(destination, { damping: 50 });
        }, []);

        const isActive = useCallback(() => {
            return active.value;
        }, []);

        useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
            scrollTo,
            isActive,
        ]);

        useEffect(() => {
            runOnUI(() => {
                'worklet';
                scrollTo(MIN_TRANSLATE_Y);
            })();
        }, []);

        const context = useSharedValue({ y: 0 });
        const gesture = Gesture.Pan()
            .onStart(() => {
                context.value = { y: translateY.value };
            })
            .onUpdate((event) => {
                translateY.value = event.translationY + context.value.y;
                translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
            })
            .onEnd(() => {
                if (translateY.value > -SCREEN_HEIGHT / 2) {
                    // setAtTop(false)
                    scrollTo(MIN_TRANSLATE_Y);
                } else if (translateY.value < -SCREEN_HEIGHT / 1.8) {
                    // setAtTop(true)
                    scrollTo(MAX_TRANSLATE_Y);
                }
            });

        const rBottomSheetStyle = useAnimatedStyle(() => {
            const borderRadius = interpolate(
                translateY.value,
                [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
                [55, 5],
                Extrapolate.CLAMP
            );

            return {
                borderRadius,
                transform: [{ translateY: translateY.value }],
            };
        });




        // console.log("At Top: ", atTop)

        return (
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
                    <TouchableOpacity activeOpacity={1} style={styles.header}
                        onPress={() => {
                            setAtTop(!atTop)
                            scrollTo(atTop ? MIN_TRANSLATE_Y : MAX_TRANSLATE_Y)
                        }}
                    >
                        {/* <View style={{ alignSelf: "center", paddingBottom: 10 }}>
                            <DoubleArrowSvg
                                scaleY={translateY.value > -SCREEN_HEIGHT / 1 ? 1 : -1}
                                />
                            </View> */}
                        <View style={styles.line} />
                        <Text numberOfLines={2} style={styles.headTxt}>{props.headerText}</Text>
                    </TouchableOpacity>
                    {props.children}
                </Animated.View>
            </GestureDetector>
        );
    }
);

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: '100%',
        backgroundColor: colors.white,
        position: 'absolute',
        top: SCREEN_HEIGHT,
        borderRadius: 30,
    },
    line: {
        width: 75,
        height: 3,
        backgroundColor: 'grey',
        alignSelf: 'center',
        marginBottom: 15,
        borderRadius: 2,
    },
    header: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        alignItems: "center"
    },
    headTxt: {
        ...largeMediumStyle,
        textAlign: "center",
        color: colors.primary,
        maxWidth: '70%',
        // backgroundColor: "red"
    }
});

export default BottomSheet;