import { AppConst } from "../constants/AppConst"

export const prodEnv = "production";
export const devEnv = "dev";
export const env = prodEnv;               // dev,  production

export const devCheckoutBaseUrl = "https://lb-do-checkout.tecorelabs.com"
export const prodCheckoutBaseUrl = "https://checkout.lugbee.com"

export const checkoutbaseUrl = env == devEnv ? devCheckoutBaseUrl : prodCheckoutBaseUrl;


let DevelopmentDnsUrl = {
    auth: "lb-do-auth.tecorelabs.com",
    account: "lb-do-account.tecorelabs.com",
    booking: "lb-do-booking.tecorelabs.com",
    payment: "lb-do-payment.tecorelabs.com",
    storeSearch: "lb-do-storesearch.tecorelabs.com",
    review: "lb-do-review.tecorelabs.com",
    setting: "lb-do-setting.tecorelabs.com",
    fileManager: "lb-do-filemanager.tecorelabs.com",
    pushNotification: "lb-do-pushnotification.tecorelabs.com"
}

let ProductionDnsUrl = {
    auth: "auth.lugbee.com",
    account: "account.lugbee.com",
    booking: "booking.lugbee.com",
    payment: "payment.lugbee.com",
    storeSearch: "storesearch.lugbee.com",
    review: "review.lugbee.com",
    setting: "setting.lugbee.com",
    fileManager: "filemanager.lugbee.com",
    pushNotification: "pushnotification.lugbee.com"
}

let DNSURI = env == "dev" ? DevelopmentDnsUrl : ProductionDnsUrl


export const baseUri = 'https://'

export const authV2BaseUri = baseUri + `${DNSURI.auth}/lats/v2`
export const authV4BaseUri = baseUri + `${DNSURI.auth}/lats/v4`

export const accountBaseUri = baseUri + DNSURI.account + "/lams"
export const accountV2BaseUri = baseUri + DNSURI.account + "/lams/v2"
export const accountV3BaseUri = baseUri + DNSURI.account + "/lams/v3"
export const accountV4BaseUri = baseUri + DNSURI.account + "/lams/v4"

export const bookingBaseUri = baseUri + DNSURI.booking + "/lbms/v2"
export const bookingV1BaseUri = baseUri + DNSURI.booking + "/lbms/v1"

export const paymentV1BaseUri = baseUri + DNSURI.payment + "/lpms/v1"

export const storeSearchBaseUri = baseUri + DNSURI.storeSearch + "/lsss"

export const reviewBaseUri = baseUri + DNSURI.review + "/lrms"

export const settingBaseUri = baseUri + DNSURI.setting + "/lsts"

export const filemanagerBaseUri = baseUri + DNSURI.fileManager + "/lfms"

export const pushNotificationBaseUri = baseUri + DNSURI.pushNotification


//User
export const getAuthTokenUri = authV4BaseUri + '/auth/token'  //v4
export const signupUri = accountV4BaseUri + '/user/signup'    //v4
export const loginUri = accountV4BaseUri + '/user/login'      //v4
export const logoutUri = authV4BaseUri + '/logout'              //v4
export const getUserProfileUri = accountV4BaseUri + '/user/profile'       //v4
export const sendOtpUri = accountV3BaseUri + '/sendOtp'       //v3
export const verifyOtpUri = accountV3BaseUri + '/verifyOtp'   //v3
export const updateUserProfileUri = accountV4BaseUri + '/user/profile'    //v4
export const getCreditsUri = paymentV1BaseUri + "/lugbee_credits/transaction"
export const rateBookingUri = reviewBaseUri + "/review"
export const userImnageUploadUri = filemanagerBaseUri + "/user/profileImage"
// export const userPaymentChekoutUri = bookingV1BaseUri + '/paymentcheckout'
export const userPaymentChekoutUri = checkoutbaseUrl + '/v1/api/payment-checkout'

export const refreshBookingUri = bookingV1BaseUri + '/booking/refresh/status'
export const getReviewUri = reviewBaseUri + "/review"
export const LoginTypeUri = accountV2BaseUri + "/getLoginType"
export const saveFcmTokenUri = pushNotificationBaseUri + "/v1/api/save-push-token"
export const removeFcmTokenUri = pushNotificationBaseUri + '/v1/api/remove-push-token'

//Store
export const storeSearchUri = storeSearchBaseUri + '/search'
// export const createCheckOutUri = bookingBaseUri + '/checkout';
export const createCheckOutUri = checkoutbaseUrl + '/v1/api/checkout';

// export const updateCheckoutUri = bookingBaseUri + '/updatecheckout';
export const updateCheckoutUri = checkoutbaseUrl + '/v1/api/checkout';

export const createBookingUri = bookingV1BaseUri + '/booking';
export const veriyTransactionUri = paymentV1BaseUri + '/transaction/verify';
export const getBookingsUri = bookingV1BaseUri + '/bookings';
export const cancelBookingUri = baseUri + DNSURI.booking + "/lbms/booking/cancel";
export const createTransactionUri = paymentV1BaseUri + "/transaction";

//Promotion
export const promotionBannersUrl = settingBaseUri + '/promotion?value=true'

//App
export const versionUri = settingBaseUri + "/appVersion";

//Web URL
export const insurancePolicyWebURL = "https://lugbee.com/lugbee_insurance";
export const termsConditionsWebURL = "https://lugbee.com/terms-services";
export const privacyPolicyWebURL = "https://lugbee.com/privacy";
export const FAQWebURL = "https://lugbee.com/faq/";


const timeout = 30000;
export const apiHeader = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export const AuthorizeApiHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `${JSON.parse(AppConst.accessToken)}`
}

export const FormDataApiHeader = {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
    // 'Authorization': `Bearer ${JSON.parse(AppConst.userToken)}`
}

export const FormDataAuthApiHeader = {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
    'Authorization': `${JSON.parse(AppConst.authToken)}`
}


export const GetRequest = async ({ url, header = { ...AuthorizeApiHeader, 'Authorization': `${JSON.parse(AppConst.authToken)}` } }) => {
    const config = {
        method: 'GET',
        headers: header,
    };
    AppConst.showConsoleLog('get config: ', config);
    AppConst.showConsoleLog('get Uri:  ', url);
    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), timeout);
        const res = await fetch(url, config);
        const result = await res.json();

        return result;
    } catch (error) {
        AppConst.showConsoleLog('error:', error);
    }
};


export const PostRequest = async ({
    url,
    body,
    header = { ...AuthorizeApiHeader, 'Authorization': `${JSON.parse(AppConst.authToken)}` },
    fileupload = false,
    method = "POST",
    loader = false
}) => {
    AppConst.showConsoleLog('url:', url);
    AppConst.showConsoleLog('body:', body);
    // return
    try {

        const controller = new AbortController();
        setTimeout(() => controller.abort(), timeout);
        const config = {
            method: method,
            headers: fileupload ? header : header,
            body: fileupload ? body : JSON.stringify(body),
            signal: controller.signal
        };
        AppConst.showConsoleLog('config:', config);
        // AppConst.showConsoleLog('is Access Token:', config.headers?.Authorization == AppConst.accessToken);
        // if (DeviceConstant.isNetworkConnected) {
        const response = await fetch(url, config);
        const result = await response.json();
        return result
        // }
        // else {
        //     ShowNetworkMessage();
        //     return undefined
        // }
    } catch (e) {
        AppConst.showConsoleLog('error:', e);
        // spinner && setSpinner(false)
        if (e.message == 'Aborted') {
            // alert('Service Time Out 5 sec');
            return false;
        }
    }
};