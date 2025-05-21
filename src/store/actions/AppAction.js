import { SET_IS_LOADING } from "../types"
import { Platform } from 'react-native';
import { GetRequest, promotionBannersUrl, versionUri } from "../../services/service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppConst } from "../../constants/AppConst";

const androidBuildNumber = 1675944310 //1671687697 //1671426942   // 1665140881     //1662625148 
const iosBuildNumber = 1675944310  // 1671426942   // 1665140881   // 1662625148  
const androidVersion = "1.0.7"
const iosVersion = "1.0.7"

export const buildNumber = Platform.OS == "android" ? androidBuildNumber : iosBuildNumber;
export const versionNumber = Platform.OS == "android" ? androidVersion : iosVersion;



export const setLoader = (payload) => {
    return {
        type: SET_IS_LOADING,
        payload
    }
}


export const setIsHome = (payload) => {
    return {
        type: "set_is_home",
        payload
    }
}

export const setDeviceToken = (payload) => {
    return {
        type: "set_device_token",
        payload
    }
}



export const getAppVersion = async () => {
    try {
        const plaform = Platform.OS;
        const res = await GetRequest({
            url: versionUri + "?app_type=" + plaform,
        });
        if (res[plaform]) {
            let previousBuild = AsyncStorage.getItem("app_build");
            if (res[plaform].build > previousBuild || !previousBuild) {
                // await AsyncStorage.setItem("app_build", String(res[plaform].build));
            }
        }
        return res;
    } catch (error) {
        console.log(error)
    }

}



export const getPromotionalBanners = async () => {
    try {
        const res = await GetRequest({
            url: promotionBannersUrl
        });

        AppConst.showConsoleLog("promotion: ", res)
        return res;
    } catch (error) {

    }
}