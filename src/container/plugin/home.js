import React, {Component} from 'react';
import {
    View,
} from 'react-native';
import Hots from './hots';
import Updates from './updates';
import Tags from './tags';
import ScrollableTabView from 'react-native-scrollable-tab-view';

export default class Home extends Component {

    constructor(props) {
        super(props);
        let plugin = props.ddcat.getCurrentPlugin();
        let home = plugin.main.home;
        const tabs = [];
        if (home.hasOwnProperty('hots')) {
            tabs.push(<Hots key='hots' tabLabel={home['hots'].title || '首页'} navigator={props.navigator}
                            ddcat={props.ddcat}/>);
        }
        if (home.hasOwnProperty('updates')) {
            tabs.push(<Updates key='updates' tabLabel={home['updates'].title || '更新'} navigator={props.navigator}
                               ddcat={props.ddcat}/>);
        }
        if (home.hasOwnProperty('tags')) {
            tabs.push(<Tags key='tags' tabLabel={home['tags'].attribs.title || '分类'} navigator={props.navigator}
                            ddcat={props.ddcat}/>);
        }
        this.state = {
            tabs: tabs
        }
    }

    render() {
        return (
            <View style={{flex:1,marginBottom:120}}>
                <ScrollableTabView>
                    {this.state.tabs}
                </ScrollableTabView>
            </View>
        );
    }
}
