import * as types from '../common/actionTypes';

import cio from 'cheerio';
import {urlDecoder} from "../util/dbSource";
import {getSiteds} from "../util/sited";
import {fetchOrFromCache} from "../util/httpCache";
import React, {
    AsyncStorage
}from 'react-native';

export function selectTab(tabName) {
    return {
        type: types.TABS_SELECT,
        payload: {tabName}
    }
}

export function updateScreenWidth(dispatch) {
    return (screenWidth) => {
        dispatch({
            type: types.LOAD_PLUGIN_LIST,
            payload: {screenWidth}
        });
    }
}
export function updateNavBarStatus(dispatch) {
    return (showPluginNavBar) => {
        dispatch({
            type: types.UPDATE_NAVBAR_STATE,
            payload: {showPluginNavBar}
        });
    }
}
export function updateTabBarStatus(dispatch) {
    return (showPluginTabBar) => {
        dispatch({
            type: types.UPDATE_TABBAR_STATE,
            payload: {showPluginTabBar}
        });
    }
}

export function hiddenBar(dispatch) {
    return (flag) => {
        dispatch({
            type: types.HIDDEN_BAR,
            payload: {flag}
        });
    }

}

export function resetLoadingState(componentName) {
    return {
        type: types.RESET_LOADING_STATE,
        payload: {componentName}
    }
}

export function loadPluginList(dispatch) {
    return () => {
        let shareData = getSiteds();
        dispatch({
            type: types.LOAD_PLUGIN_LIST,
            data: shareData
        });
    }
}

export function loadSitedList(dispatch) {
    return () => {
        let url = null;
        return AsyncStorage.getItem('selectSitedSource').then((data)=>{
            if (data) {
                url = data;
                return fetchOrFromCache(data, {headers:{'x-requested-with':'XMLHttpRequest'}}, 1);
            }else {
                url = 'http://sited.ka94.com/api/';
                return AsyncStorage.setItem('selectSitedSource','http://sited.ka94.com/api/')
                    .then(()=>{
                        return fetchOrFromCache('http://sited.ka94.com/api/', {}, 1);
                    })
            }
        }).then((html) => {
            const set = [];
            if (url === 'http://sited.ka94.com/api/'){
                // console.log(html);
                // let jo = require('../assets/json/sited.json');
                let jo = JSON.parse(html);
                let sort_dl = jo['sort_dl'];
                for(let i=0;i<sort_dl.length;i++){
                    let item = sort_dl[i];
                    item.url = "http://sited.ka94.com/plugin.sited.php?id=" + item.id + "&t=" + (Math.round(new Date().getTime() / 1000) + 180);
                    item.key = item.title;
                    set.push(item);
                }

            }else {
                let $ = cio.load(html);
                let list = $('#list li div a');

                for (let i = 0; i < list.length; i++) {
                    let ele = list.eq(i);
                    if (i % 2 === 1) {
                        continue;
                    }
                    let item = {};
                    let url = urlDecoder(ele.attr('href'));
                    let title = ele.text();
                    item['url'] = url;
                    item['title'] = title;
                    item['key'] = i;
                    set.push(item);
                }
            }
            return set;
        })
            .then((items) => {
                dispatch({
                    type: types.LOAD_SITED_LIST,
                    data: items
                });
            })
            .catch((error) => {
                console.log(error);
                dispatch({
                    type: types.LOAD_SITED_LIST,
                    data: []
                });
            })
    }
}

export function loadHotsList(dispatch ) {
    return (ddcat, page =1) => {
        let plugin = ddcat.getCurrentPlugin();
        let home = plugin.main.home;
        let hots = home.hots;
        if (hots.url.indexOf('@page') <0 && page >1) {
            console.log('page:' + page);
            console.log(hots.url);
            return;
        }
        let url = hots.url.replace('@page', page);
        ddcat.getNodeData(url, hots, plugin.encode)
            .then((dataList) => {
                let data = dataList.map((item, i) => {
                    item['key'] = item.name + i;
                    return item;
                });
                dispatch({
                    type: types.LOAD_HOTS_LIST,
                    data: data
                });
            });
    }
}

export function loadTagsList(dispatch) {
    return (ddcat) => {
        let plugin = ddcat.getCurrentPlugin();
        let home = plugin.main.home;
        let tags = home.tags;
        let list = [];
        console.log(tags);
        let items = tags.items;

        (() => {
            if (tags && tags.attribs && typeof tags.attribs.parse === 'function') {
                return ddcat.getNodeData(tags.attribs.url, tags.attribs, plugin.encode)
            } else {
                return Promise.resolve([]);
            }
        })().then((dataList) => {
            let data = null;
            if (items && items.length > 0) {
                data = items.concat(dataList);
            } else {
                data = dataList;
            }
            if (data && data.length > 0) {
                let group = null;
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    if (i === 0 || item.group) {
                        if (group) {
                            list.push(group);
                        }
                        group = {title: data[i].group || '全部', key: i, data: []}
                    }
                    if (item.title) {
                        group.data.push({title: item.title, url: item.url, key: item.url + i});
                    }
                }
                list.push(group);
            }
            dispatch({
                type: types.LOAD_TAGS_LIST,
                data: list
            });

        });
    }
}

export function loadTagList(dispatch) {
    return (ddcat, url, page=1) => {
        let plugin = ddcat.getCurrentPlugin();
        let tags = plugin.main.tag;
        let tagConfig = null;
        let dtype = plugin.main.dtype;
        if (tags.length === 1) {
            tagConfig = tags[0]['attribs'];
        } else {
            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                if (tag && tag['attribs'].expr) {
                    let re = new RegExp(tag['attribs'].expr);
                    if (url.match(re)) {
                        tagConfig = tag['attribs'];
                        break;
                    }
                }
            }
        }
        let newUrl = url.replace('@page', page);
        console.log(url);
        if (!tagConfig.buildUrl && url.indexOf('@page') <0 && page >1) {
            return;
        }
        let encode = tagConfig.encode || plugin.encode;
        ddcat.getNodeData(newUrl, tagConfig, encode, page)
            .then((dataList) => {
                if(page ===1){
                    dispatch({
                        type: types.LOAD_TAG_LIST,
                        data: dataList
                    });
                }else {
                    dispatch({
                        type: types.LOAD_TAG_MORE,
                        data: dataList
                    });
                }

            });
    }
}

export function loadUpdatesList(dispatch) {
    return (ddcat) => {
        let plugin = ddcat.getCurrentPlugin();
        let home = plugin.main.home;
        let updates = home.updates;
        let url = updates.url.replace('@page', 1);
        ddcat.getNodeData(url, updates, plugin.encode)
            .then((dataList) => {
                console.log(dataList);
                let data = dataList.map((item, i) => {
                    item['key'] = item.name + i;
                    return item;
                });
                dispatch({
                    type: types.LOAD_UPDATES_LIST,
                    data: data
                });
            });
    }
}

export function loadBookList(dispatch) {
    return (ddcat, url) => {
        let plugin = ddcat.getCurrentPlugin();
        console.log(plugin);
        let books = plugin.main.book;
        let bookConfig = null;
        let dtype = plugin.main.dtype;
        let selectBook = null;
        if (books.length === 1) {
            bookConfig = books[0]['attribs'];
            selectBook = books[0];
        } else {
            for (let i = 0; i < books.length; i++) {
                let book = books[i];
                if (book && book['attribs'].expr) {
                    let re = new RegExp(book['attribs'].expr);
                    if (url.match(re)) {
                        bookConfig = book['attribs'];
                        selectBook = book;
                        break;
                    }
                }
            }
        }
        let encode = bookConfig.encode || plugin.encode;
        ddcat.getNodeData(url, bookConfig, encode)
            .then((dataList) => {
                console.log(dataList);
                if (dtype === '4') {
                    dispatch({
                        type: types.LOAD_BOOK_LIST,
                        data: dataList
                    });
                    return;
                }
                let data = dataList.map((item, i) => {
                    item['key'] = item.name + i;
                    return item;
                });

                if (selectBook.sections && selectBook.sections.length > 0) {
                    let sectionsConfig = selectBook.sections[0]['attribs'];
                    return ddcat.getNodeData(url, sectionsConfig, plugin.encode)
                        .then((sectionsDataList) => {
                            data[0].sections = data[0].sections.concat(sectionsDataList[0].sections);
                            dispatch({
                                type: types.LOAD_BOOK_LIST,
                                data: data[0]
                            });
                        })
                }
                dispatch({
                    type: types.LOAD_BOOK_LIST,
                    data: data[0]
                });
            });
    }
}

export function loadSectionList(dispatch) {
    return (ddcat, url) => {
        let plugin = ddcat.getCurrentPlugin();
        let sections = plugin.main.section;
        let sectionConfig = null;
        if (sections.length === 1) {
            sectionConfig = sections[0]['attribs'];
        } else {
            for (let i = 0; i < sections.length; i++) {
                let section = sections[i];
                if (section && section['attribs'].expr) {
                    let re = new RegExp(section['attribs'].expr);
                    if (url.match(re)) {
                        sectionConfig = section['attribs'];
                        break;
                    }
                }
            }
        }
        console.log(sectionConfig);
        ddcat.getNodeData(url, sectionConfig, plugin.encode)
            .then((dataList) => {
                // console.log(dataList);
                let data = dataList.map((item, i) => {
                    item['key'] = '' + (item.name || item.t) + i;
                    return item;
                });
                dispatch({
                    type: types.LOAD_SECTION_LIST,
                    data: data
                });
            });
    }
}
