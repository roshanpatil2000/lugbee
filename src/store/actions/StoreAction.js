import { AppConst } from "../../constants/AppConst";
import { apiHeader, AuthorizeApiHeader, cancelBookingUri, createBookingUri, createCheckOutUri, getBookingsUri, GetRequest, PostRequest, rateBookingUri, storeSearchUri, updateCheckoutUri, veriyTransactionUri } from "../../services/service"
import Toast from 'react-native-toast-message';




export const searchStore = async (data) => {
    try {
        let uri = storeSearchUri + `?bags=${data.bags}&lat=${data.lat}&lng=${data.lng}&timezone=${data.timeZone}&fromPage=${data.page}&fromDate=${data.fromDate}&fromTime=${data.fromTime}&toDate=${data.toDate}&toTime=${data.toTime}`;
        AppConst.showConsoleLog('uri', uri)
        const res = await GetRequest({ url: uri, header: apiHeader });
        if (res.status == 200) {
            return res;
        }
        AppConst.showConsoleLog('res', res)
        Toast.show({
            type: "error",
            position: 'top',
            text1: res.message,

        })
        if (res.status == 204) {
        }
        return res;
    } catch {
        return false;
    }
}


export const createCheckOut = async (data, isUpdate) => {
    try {
        let body = {
            "location": {
                "name": data.addressName,
                "timezone": "Asia/Kolkata",
                "lat": data.lat,
                "lng": data.lng,
                "country_name": "India",
                "city": data.city
            },
            "dropOffTS": {
                "date": data.fromDate,
                "time": data.fromTime //+ ":00"
            },
            "pickUpTS": {
                "date": data.toDate,
                "time": data.toTime
            },
            "bagQty": data.bags,
            "accountId": AppConst.accountId,
            "userEmailId": data.email_id ? data.email_id : "",
            "userCountryCode": data.mobile_country_code ? data.mobile_country_code : "91",
            "userMobileNo": data.mobile_no ? data.mobile_no : "",
            "tokenType": "access",
            "useLbCredits": data.lugbeeCredit,
            "store_id": data.storeId,
        }
        AppConst.showConsoleLog('body', body, isUpdate)
        // return
        const res = await PostRequest({
            method: isUpdate ? "PUT" : "POST",
            url: isUpdate ? updateCheckoutUri : createCheckOutUri,
            header: !isUpdate ?
                { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) }
                :
                { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken), 'Content-type': 'application/json; charset=UTF-8' },
            body: body
        });
        AppConst.showConsoleLog('res', res)
        if (res.status == 200) {
            return res;
        }
        // Toast.show({
        //     type: "error",
        //     position: 'top',
        //     text1: res.message,

        // });
        return res;
    } catch (error) {
        AppConst.showConsoleLog('error', error)
        return false;
    }
}


export const createBooking = async (storeId, hostId, bookingId) => {
    try {
        AppConst.showConsoleLog('uri:--', bookingId, "---", createBookingUri + `?account_id=${AppConst.accountId}&store_id=${storeId}&host_id=${hostId}&token_type=access${bookingId ? `&booking_id=${bookingId}` : ''}`);
        // return;
        const res = await PostRequest({
            url: createBookingUri + `?account_id=${AppConst.accountId}&store_id=${storeId}&host_id=${hostId}&token_type=access${bookingId ? `&booking_id=${bookingId}` : ''}`,
            header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
            body: {}
        });
        AppConst.showConsoleLog('res', res)
        if (res.status == 200) {
            return res;
        }
        Toast.show({
            type: "error",
            position: 'top',
            text1: res.message,
        })

    } catch (error) {
        AppConst.showConsoleLog('error', error)
    }
}



export const verifyTransaction = async (orderId, paymentId, signature, type) => {
    try {
        // return;
        const res = await PostRequest({
            url: veriyTransactionUri + `?order_id=${orderId}&payment_id=${paymentId}&token_type=access&signature=${signature}&type=${type}&account_id=${AppConst.accountId}`,
            header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
            body: {}
        });
        AppConst.showConsoleLog('res', res)

        return res;

    } catch (error) {
        AppConst.showConsoleLog('error', error)
    }
}


export const getBookingsByStatus = async (status) => {
    try {
        const res = await GetRequest({
            url: `${getBookingsUri}?account_id=${AppConst.accountId}&status=${status}&token_type=access&store_details=1`,
            header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
        });
        AppConst.showConsoleLog('res', res)

        return res;
    } catch (error) {
        AppConst.showConsoleLog('error', error)
    }
}


export const cancelBooking = async (bookingId) => {
    try {
        const res = await PostRequest({
            url: `${cancelBookingUri}?booking_id=${bookingId}&token_type=access`,
            header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
            body: {},
            method: "PUT"
        });
        AppConst.showConsoleLog('res', res)
        if (res.status == 200) {
            Toast.show({
                type: "success",
                position: 'top',
                text1: res.message,
            })
        }
        return res;
    } catch (error) {
        AppConst.showConsoleLog('error', error)
    }
}



export const rateBooking = async (data) => {
    try {
        const res = await PostRequest({
            url: `${rateBookingUri}?user_id=${data.user_id}&store_id=${data.storeId}&host_id=${data.hostId}&rating=${data.rating}&review_text=${data.comment}&account_id=${AppConst.accountId}&token_type=access&booking_id=${data.bookingId}`,
            header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
            body: {},
        });
        AppConst.showConsoleLog('res', res)
        if (res.status == 200) {
            Toast.show({
                type: "success",
                position: 'top',
                text1: res.message,
            })
        }
        return res;
    } catch (error) {
        AppConst.showConsoleLog('error', error)
    }
}