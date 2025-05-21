import { SearchDetailType, setUserDetailType } from "../types";


const initialState = {
    searchDetail: null,
    userDetail: null,
}


const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case SearchDetailType:
            return { ...state, searchDetail: action.payload };
        case setUserDetailType:
            return { ...state, userDetail: action.payload };
        default:
            return state;
    }
}


export default UserReducer;