import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from "../actions/sitedAction";
import {
    StyleSheet,
    View,
    TabBarIOS,
    Dimensions,
    NavigatorIOS
} from 'react-native';
import site from './site'
import add from './add'
import setting from "./setting";
import search from "./plugin/search";

const screenW = Dimensions.get('window').width;

class App extends Component {

    constructor(props) {
        super(props);
    }

    isTabSelected(tabName) {
        return this.props.tabsSelected === tabName;
    }

    selectTab(tabName) {
        return this.props.dispatch(actions.selectTab(tabName));
    }

    componentWillMount() {
        this.props.updateScreenWidth(screenW);
    }

    render() {
        return (
                <TabBarIOS style={{flex:1}}>
                    <TabBarIOS.Item systemIcon="bookmarks"
                                    title="插件"
                                    selected={this.isTabSelected('site')}
                                    onPress={() => this.selectTab('site')}>
                        <NavigatorIOS
                            style={{flex: 1}}
                            showTabBar={this.props.showPluginTabBar}
                            initialRoute={{
                                component: site,
                                title: '插件',
                            }}
                            navigationBarHidden={this.props.showPluginNavBar}
                            translucent={false}
                        />
                    </TabBarIOS.Item>
                    <TabBarIOS.Item systemIcon="downloads"
                                    title="添加"
                                    selected={this.isTabSelected('add')}
                                    onPress={() => this.selectTab('add')}>
                        <NavigatorIOS
                            style={{flex: 1}}
                            translucent={false}
                            initialRoute={{
                                component: add,
                                title: '新增',
                                showTabBar: true
                            }}/>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        systemIcon="favorites">
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        systemIcon="search"
                        title="搜索"
                        selected={this.isTabSelected('search')}
                        onPress={() => this.selectTab('search')}>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        systemIcon="contacts"
                        title="添加"
                        selected={this.isTabSelected('setting')}
                        onPress={() => this.selectTab('setting')}>
                        <NavigatorIOS
                            style={{flex: 1}}
                            translucent={false}
                            initialRoute={{
                                component: setting,
                                title: '设置',
                                showTabBar: true
                            }}/>
                    </TabBarIOS.Item>
                </TabBarIOS>
        );
    }
}

function mapStateToProps(state) {
    return {
        tabsSelected: state.sitedReducer.tabs.selected,
        showPluginNavBar: state.sitedReducer.tabs.showPluginNavBar,
        showPluginTabBar: state.sitedReducer.tabs.showPluginTabBar,
    }
}

function mapDispatchToProps(dispatch) {
    let updateScreenWidth = actions.updateScreenWidth(dispatch);
    let updateNavBarStatus = actions.updateNavBarStatus(dispatch);
    return {
        updateScreenWidth,updateNavBarStatus, dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(App)