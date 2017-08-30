/**
 * action 类型
 * zhouxiumin create by 2017-08-16
 */


// 选取工具栏
export const TABS_SELECT = 'TABS_SELECT';
export const UPDATE_SCREEN_WIDTH = 'UPDATE_SCREEN_WIDTH';
export const UPDATE_NAVBAR_STATE = 'UPDATE_NAVBAR_STATE';
export const UPDATE_TABBAR_STATE = 'UPDATE_TABBAR_STATE';
// 重置加载状态
export const RESET_LOADING_STATE = 'RESET_LOADING_STATE';
// 加载插件
export const LOAD_PLUGIN_LIST = 'LOAD_PLUGIN_LIST';
// 加载组件
export const LOAD_SITED_LIST = 'LOAD_SITED_LIST';
// 加载热门列表
export const LOAD_HOTS_LIST = 'LOAD_HOTS_LIST';
// 加载分类列表
export const LOAD_TAGS_LIST = 'LOAD_TAGS_LIST';

export const LOAD_TAG_LIST = 'LOAD_TAG_LIST';
export const LOAD_TAG_MORE = 'LOAD_TAG_MORE';
// 加载更新列表
export const LOAD_UPDATES_LIST = 'LOAD_UPDATES_LIST';
// 加载书籍列表
export const LOAD_BOOK_LIST = 'LOAD_BOOK_LIST';
// 加载章节列表
export const LOAD_SECTION_LIST = 'LOAD_SECTION_LIST';

export const HIDDEN_BAR = 'HIDDEN_BAR';


// setting

//
export const OPEN_SETTING_MODAL = 'OPEN_SETTING_MODAL';
export const CLOSE_SETTING_MODAL = 'CLOSE_SETTING_MODAL';
export const CHANGE_SITED_SOURCE = 'CHANGE_SITED_SOURCE';


// search
export const LOAD_SEARCH_LIST = 'LOAD_SEARCH_LIST';


//读取鼠绘漫画列表
export const LOAD_SHUHUI_LIST = "LOAD_SHUHUI_LIST";
//得到鼠绘漫画列表
export const GET_SHUHUI_LIST = "GET_SHUHUI_LIST";
//刷新鼠绘漫画列表
export const RESET_SHUHUI_LIST = "RESET_SHUHUI_LIST";

// 订阅
export const GET_SUBSCRIBE_LIST="GET_SUBSCRIBE_LIST";
export const LOAD_SUBSCRIBE_LIST="LOAD_SUBSCRIBE_LIST";

//读取发现列表
export const LOAD_DISCOVERY_LIST = "LOAD_DISCOVERY_LIST";
//得到发现列表
export const GET_DISCOVERY_LIST = "GET_DISCOVERY_LIST";
//刷新
export const RESET_DISCOVERY_LIST = "RESET_DISCOVERY_LIST";

//读取国产漫画列表
export const LOAD_DOMESTIC_LIST = "LOAD_DOMESTIC_LIST";
//得到国产漫画列表
export const GET_DOMESTIC_LIST = "GET_DOMESTIC_LIST";
//刷新国产漫画列表
export const RESET_DOMESTIC_LIST = "RESET_DOMESTIC_LIST";

//读取热血漫画列表
export const LOAD_PASSION_LIST = "LOAD_PASSION_LIST";
//得到热血漫画列表
export const GET_PASSION_LIST = "GET_PASSION_LIST";
//刷新热血漫画列表
export const RESET_PASSION_LIST = "RESET_PASSION_LIST";
// 章节列表

export const LOAD_CHAPTER_LIST = "LOAD_CHAPTER_LIST";
export const GET_CHAPTER_LIST = "GET_CHAPTER_LIST";
export const RESET_CHAPTER_LIST = "RESET_CHAPTER_LIST";

// 漫画详情

export const LOAD_COMBICK_DETIAL_LIST = "LOAD_COMBICK_DETIAL_LIST";
export const GET_COMBICK_DETIAL_LIST = "GET_COMBICK_DETIAL_LIST";
export const RESET_COMBICK_DETIAL_LIST = "RESET_COMBICK_DETIAL_LIST";

// 收藏

export const LOAD_COLLECTION_LIST = "LOAD_COLLECTION_LIST";
export const GET_COLLECTION_LIST = "GET_COLLECTION_LIST";
export const RESET_COLLECTION_LIST = "RESET_COLLECTION_LIST";


// for user
export const LOGGED_IN 	= 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';
export const LOGGED_ERROR = 'LOGGED_ERROR';
export const LOGGED_DOING = 'LOGGED_DOING';


export const SELECT_RECOMMEND_TAG = 'SELECT_RECOMMEND_TAG';
export const RESET_SEARCH_STATE = 'RESET_SEARCH_STATE';
export const SETUP_SEARCH_TEXT = 'SETUP_SEARCH_TEXT';