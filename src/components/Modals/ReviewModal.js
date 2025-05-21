import React, { useState } from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard, Platform } from 'react-native'
import { Rating } from 'react-native-ratings';
import { colors } from '../../styles/color';
import { commonTextStyle, MediumTextStyle } from '../../styles/CommonStyling';
import { Button, InputField } from '../custom/CustomFields';


const ReviewModal = ({ close, onSubmit = () => { } }) => {
    const [rating, setRating] = useState(3);
    const [comment, setComment] = useState('');

    const onFinish = rate => {
        Keyboard.dismiss();
        setRating(rate);
    }

    // onSubmit

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => close()}
        >

            <View style={styles.container}>
                {/* <ScrollView style={{ flex: 1 }}> */}
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : null}>
                    <TouchableOpacity activeOpacity={1} onPress={() => close()} style={{ flex: 1, }}>

                    </TouchableOpacity>
                    <View style={styles.reviewContainer}>
                        <Text allowFontScaling={false} style={styles.txt}>Leave your review here!</Text>
                        <Rating
                            type='star'
                            ratingCount={5}
                            imageSize={35}
                            minValue={1}
                            startingValue={3}
                            style={{ alignSelf: 'center', marginVertical: 10, marginTop: 15 }}
                            onFinishRating={onFinish}
                        />

                        <InputField
                            isDescription={true}
                            value={comment}
                            onTextChange={txt => setComment(txt)}
                            placeholder="Write your review here"
                            style={{ height: 120, paddingVertical: 10 }}
                        />

                        <Button
                            title="Submit"
                            onPress={() => onSubmit(rating, comment)}
                        />

                    </View>
                </KeyboardAvoidingView>
                {/* </ScrollView> */}
            </View>

        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        // justifyContent: "flex-end"
    },
    reviewContainer: {
        padding: 20,
        backgroundColor: colors.white,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: "center",
        // flex: 1,
        // position: "absolute",
        // width: "100%",
        // bottom: 0
        // paddingVertical: 30
    },
    txt: {
        ...MediumTextStyle,
        color: colors.primary
    }
});

export default ReviewModal