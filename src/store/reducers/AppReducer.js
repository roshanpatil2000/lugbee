import { Change_App_Status, Set_AppVersion_Data, SET_IS_LOADING } from "../types"

const initialState = {
    app_status: 0,
    loading: false,
    isHome: true,
    AppVersionData: null,
    deviceToken: null
}


const AppReducer = (state = initialState, action) => {
    switch (action.type) {
        case Change_App_Status:
            return { ...state, app_status: action.payload };
        case SET_IS_LOADING:
            return { ...state, loading: action.payload };
        case Set_AppVersion_Data:
            return { ...state, AppVersionData: action.payload };
        case "set_is_home":
            return { ...state, isHome: action.payload };
        case "set_device_token":
            return { ...state, deviceToken: action.payload };
        default:
            return state;
    }
}


export default AppReducer;