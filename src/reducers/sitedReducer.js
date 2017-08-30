import * as types from './../common/actionTypes';
import update from 'immutability-helper';

const initState = {
    tabs:{
        selected: 'site',
        screenW : 200,
        showPluginNavBar: false,
        showPluginTabBar:true
    },
    plugin: {
        isLoading: true,
        data: []
    },
    add: {
        isLoading: true,
        isRefresh: false,
        data: []
    },
    hots: {
        isLoading: true,
        page: 1,
        data: [],
    },
    tags: {
        isLoading: true,
        data: []
    },
    tag: {
        isLoading: true,
        data: [],
        page: 1
    },
    updates: {
        isLoading: true,
        data: []
    },
    book: {
        isLoading: true,
        data: []
    },
    section: {
        showBar: true,
        isLoading: true,
        data: []
    }
};

export default  (state = initState , action) => {
    switch (action.type) {
        case types.TABS_SELECT:
            const tabName = action.payload.tabName;
            return update(state, {tabs:{selected:{$set:tabName}}});
        case types.UPDATE_SCREEN_WIDTH:
            const screenWidth = action.payload.screenWidth;
            return update(state, {tabs:{screenW:{$set:screenWidth}}});
        case types.UPDATE_NAVBAR_STATE:
            const showPluginNavBar = action.payload.showPluginNavBar;
            return update(state, {tabs:{showPluginNavBar:{$set:showPluginNavBar}}});
        case types.UPDATE_TABBAR_STATE:
            const showPluginTabBar = action.payload.showPluginTabBar;
            return update(state, {tabs:{showPluginTabBar:{$set:showPluginTabBar}}});
        case types.RESET_LOADING_STATE:
            const componentName = action.payload.componentName;
            if (state.hasOwnProperty(componentName)){
                state[componentName].isLoading = true;
            }
            return state;
        case types.LOAD_PLUGIN_LIST:
            return update(state, {plugin:{isLoading:{$set:false},data:{$set:action.data}}});
        case types.LOAD_SITED_LIST:
            return update(state, {add:{isLoading:{$set:false},data:{$set:action.data}}});
        case types.LOAD_HOTS_LIST:
            return update(state, {hots:{isLoading:{$set:false},data:{$set:action.data}}});
        case types.LOAD_TAGS_LIST:
            return update(state, {tags:{isLoading:{$set:false},data:{$set:action.data}}});
        case types.LOAD_TAG_LIST:
            return update(state, {tag:{isLoading:{$set:false},data:{$set:action.data},page:{$set:2}}});
        case types.LOAD_TAG_MORE:
            return update(state, {tag:{isLoading:{$set:false},data:{$push:action.data},page:{$apply:(v)=>v+1}}});
        case types.LOAD_UPDATES_LIST:
            return update(state, {updates:{isLoading:{$set:false},data:{$set:action.data}}});
        case types.LOAD_BOOK_LIST:
            return update(state, {book:{isLoading:{$set:false},data:{$set:action.data}}});
        case types.LOAD_SECTION_LIST:
            return update(state, {section:{isLoading:{$set:false},data:{$set:action.data}}});
        case types.HIDDEN_BAR:
            const flag = !action.payload.flag;
            const newState = update(state, {section:{showBar:{$set: flag}}});
            console.log(newState);
            return newState;
        default:
            return state;
    }
};