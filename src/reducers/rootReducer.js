import { combineReducers } from 'redux';
import sitedReducer from "./sitedReducer";
import settingReducer from "./settingReducer";
import searchReducer from "./searchReducer";
import favourReducer from "./favourReducer";

export default rootReducer = combineReducers({
    sitedReducer,settingReducer, searchReducer, favourReducer
})