import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CountryCode from '../../constants/CountryCode';
import { commonTextStyle, fontSize, LargeTextStyle, MediumTextStyle } from '../../styles/CommonStyling';
import { colors } from '../../styles/color';
import AntDesign from "react-native-vector-icons/AntDesign";



const CountryCodeModal = ({ close = () => { }, onSelect = () => { } }) => {
    const [country, setCountry] = React.useState("");
    const [countryList, setCountryList] = React.useState(CountryCode);

    const searchFunction = (text) => {
        console.log("text", text == " ");
        if (text == " ") {
            return;
        }
        setCountry(text);
        if (text) {
            const filter = CountryCode.filter((item) => {
                return item.name.toLowerCase().includes(text.toLowerCase()) || item.dial_code.toLowerCase().includes(text.toLowerCase());
            });
            setCountryList(filter);
        } else {
            setCountryList(CountryCode);
        }
    }

    return (
        <Modal
            visible
            transparent
            onRequestClose={() => close()}
            animationType="slide"
        >
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerTxt}>Select your Country code</Text>
                        <AntDesign name='close' size={20} color={colors.black} onPress={() => close()} style={{ position: "absolute", right: 0, padding: 18 }} />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            value={country}
                            placeholder="Search Country"
                            placeholderTextColor={"grey"}
                            onChangeText={(text) => searchFunction(text)}
                            style={styles.searchInput}
                        />
                    </View>
                    <View style={{ borderTopWidth: 0.5, borderColor: colors.grey, flex: 1 }}>
                        <FlatList
                            data={countryList}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingVertical: 0, }}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        // close();
                                        onSelect(item);
                                    }}
                                >
                                    <Text style={styles.item}>
                                        <Text style={styles.itemText}>{item.name}</Text>
                                        <Text style={styles.itemText}> ({item.dial_code})</Text>
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </View>

        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    innerContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        // paddingHor: 20,
        flex: 1,
    },
    itemText: {
        ...MediumTextStyle
    },
    item: {
        // flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },
    headerTxt: {
        ...LargeTextStyle,
        color: colors.black,
        fontSize: 18
    },
    inputView: {
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: colors.grey,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: colors.white
    },
    searchInput: {
        flex: 1,
        ...commonTextStyle,
        backgroundColor: colors.white,
    }
});

export default CountryCodeModal