import * as types from '../common/actionTypes';
import {getSiteds} from "../util/sited";
import React, {
    AsyncStorage
}from 'react-native';

export function openModal(dispatch) {
    return () => {
        dispatch({
            type: types.OPEN_SETTING_MODAL
        });
    }
}

export function closeModal(dispatch) {
    return () => {
        dispatch({
            type: types.CLOSE_SETTING_MODAL
        });
    }
}

export function changeSitedSource(dispatch) {
    return (sited) => {
        AsyncStorage.setItem('selectSitedSource', sited).then(()=>{
            dispatch({
                type: types.CHANGE_SITED_SOURCE,
                payload: {sited}
            });
        });
    };
}

export function loadSearchList(dispatch) {
    return () => {
        let shareData = getSiteds();
        dispatch({
            type: types.LOAD_SEARCH_LIST,
            data: shareData
        });
    }
}
