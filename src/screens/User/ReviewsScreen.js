import moment from 'moment';
import React, { useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import { Rating } from 'react-native-ratings';
import { useDispatch } from 'react-redux';
import { AppConst } from '../../constants/AppConst';
import { DrawerScreenOptions } from '../../route/StackNavigation';
import { setLoader } from '../../store/actions/AppAction';
import { getUserReviews } from '../../store/actions/UserAction';
import { colors } from '../../styles/color';
import { commonTextStyle, fonts, fontSize, largeMediumStyle, MediumTextStyle } from '../../styles/CommonStyling';


const ReviewsScreen = ({ navigation }) => {
    const [reviews, setReviews] = React.useState(null);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setLoader(true));
        getUserReviews().then(res => {
            dispatch(setLoader(false));
            AppConst.showConsoleLog("review res--", res);
            if (res?.status == "200") {
                setReviews(res.data);
            } else {
                setReviews([]);
            }
        })
    }, []);

    useEffect(() => {
        navigation.setOptions({
            ...DrawerScreenOptions({ navigation: navigation })
        })
    }, [navigation]);


    const Header = () => (
        <View style={styles.header}>
            <Text style={[MediumTextStyle, { fontSize: fontSize.largeMedium }]}>Reviews</Text>
        </View>
    )


    return (
        <View style={styles.container}>
            <FlatList
                data={reviews}
                keyExtractor={(item, index) => String(index)}
                ListHeaderComponent={() => reviews?.length > 0 ? <Header style={{ height: 10 }} /> : null}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return (
                        <View style={styles.itemContainer}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.storeName}>{item.store_name}</Text>
                            </View>
                            <View style={styles.item}>
                                <Image source={{ uri: item?.profile_image_path_list?.length > 0 ? item?.profile_image_path_list[0] : "" }} style={styles.img} />
                                <View style={{ flex: 1 }}>
                                    <View style={[styles.row, {}]}>
                                        {/* <Text style={styles.txtFld}>Rating </Text> */}
                                        <Rating
                                            startingValue={item.rating}
                                            readonly={true}
                                            imageSize={20}
                                        />
                                        <Text style={styles.valueTxt}> ({item.rating})</Text>
                                    </View>
                                    {
                                        item.review_text ?
                                            <View style={[styles.row, { alignItems: "flex-start" }]}>
                                                {/* <Text style={styles.txtFld}>Review </Text> */}
                                                <Text style={styles.valueTxt}>{item.review_text}</Text>
                                            </View>
                                            : null
                                    }
                                    <View style={[styles.row, { alignItems: "flex-start" }]}>
                                        {/* <Text style={styles.txtFld}>Date </Text> */}
                                        <Text style={styles.dateTxt}>{moment(new Date(item.review_ts * 1000)).format("DD MMMM YYYY")}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                }
                }
            />
            {reviews && reviews.length == 0 &&
                <Text style={styles.noReview}>No Reviews</Text>
            }

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    item: {
        flexDirection: "row",
        // marginTop: 10,
        padding: 10,
    },
    itemContainer: {
        backgroundColor: colors.white,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
    },
    img: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 10
    },
    storeName: {
        ...MediumTextStyle,
        fontFamily: fonts.semiBold,
        color: colors.primary,
    },
    itemHeader: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary,

    },
    txtFld: {
        ...commonTextStyle,
        fontFamily: fonts.medium,
        width: "30%"
    },
    row: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginVertical: 3
    },
    valueTxt: {
        ...commonTextStyle,
        color: colors.darkGrey,
        flex: 1
    },
    dateTxt: {
        ...commonTextStyle,
        fontSize: 13,
        color: colors.black
    },
    noReview: {
        ...largeMediumStyle,
        position: "absolute",
        top: "40%",
        alignSelf: "center",

    }
});

export default ReviewsScreen