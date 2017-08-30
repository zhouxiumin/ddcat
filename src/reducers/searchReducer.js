import * as types from './../common/actionTypes';
import update from 'immutability-helper';

const initState = {
    isLoading: false,
    keyword: '',
    data: []
};

export default  (state = initState , action) => {
    switch (action.type) {
        case types.OPEN_SETTING_MODAL:
            return update(state, {isLoading:{$set:true}});
        case types.CLOSE_SETTING_MODAL:
            return update(state, {isLoading:{$set:false}});
        case types.CHANGE_SITED_SOURCE:
            return update(state, {isLoading:{$set:action.payload.sited}});
        default:
            return state;
    }
};