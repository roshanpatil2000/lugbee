import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import AppReducer from './reducers/AppReducer';
import UserReducer from './reducers/UserReducer';


const rootReducer = combineReducers({
    app: AppReducer,
    user: UserReducer
});



const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;