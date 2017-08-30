import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from "../actions/sitedAction";
import realm from '../util/realmDB'
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    AlertIOS,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    InteractionManager
} from 'react-native';
import ddcatInstance from "../common/ddcat"
import home from "./plugin/home";
import {deleteSited} from "../util/sited";

const screenW = Dimensions.get('window').width;

class Site extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.loadPluginList();
        });
    }

    render() {
        if (this.props.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20,flexDirection: 'row',justifyContent: "center",alignItems: 'center', alignSelf: "center"}}>
                    <ActivityIndicator/>
                </View>
            );
        }
        return (
            <FlatList
                keyExtractor={(item, index) => item.title + index}
                numColumns={4}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {
                            this.props.loadPluginList();
                        }}
                    />}
                data={this.props.data}
                renderItem={this.renderRow.bind(this)}
                contentContainerStyle={styles.listViewStyle}
            />
        );
    }

    _pressRow(param) {
        const ddcat = ddcatInstance;
        let Sited = realm.objects('Sited');
        let siteds = Sited.filtered('title == $0', param.title);
        if (siteds.length > 0) {
            let sited = siteds[0];
            ddcat.installNewPlugin(sited.xml);
            console.log(ddcat.getConfigs());
        }
        ddcat.setCurrentPlugin(param.title);
        this.props.dispatch(actions.resetLoadingState('hots'));
        this.props.navigator.push({
            component: home,
            title: param.title,
            passProps: {
                ddcat: ddcat
            },
            type: 'Normal'
        })
    }
    _pressLongRow(param) {
        console.log('delete plugin');
        AlertIOS.alert('提示','确定删除',[
            {text:'确定', onPress:()=>{deleteSited(param); this.props.loadPluginList()}},
            {text:'取消', onPress:()=>{console.log('取消')},style: "cancel"}
        ]);
    }

    renderRow({item, index}) {
        return (
            <View style={styles.innerViewStyle}>
                <TouchableOpacity style={styles.textViewStyle} onPress={() => this._pressRow(item)}
                                  onLongPress={()=>this._pressLongRow(item)}
                                  activeOpcity={0.8}>
                    <Text style={styles.textStyle}> {this.getFirstWord(item.title)} </Text>
                </TouchableOpacity>
                <Text ellipsizeMode='tail' numberOfLines={1}>{item.title} </Text>
            </View>
        )
    }

    getFirstWord(text) {
        return text.charAt(0);
    }
}

const styles = StyleSheet.create({
    listViewStyle: {
        margin: 0
    },
    textViewStyle: {
        width: screenW / 4 - 20,
        height: screenW / 4 - 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#EEEEEE'
    },
    textStyle: {
        fontSize: 32
    },
    innerViewStyle: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: screenW / 4,
        height: screenW / 4,
        alignItems: 'center',
    }
});

function mapStateToProps(state) {
    return {
        isLoading: state.sitedReducer.plugin.isLoading,
        data: state.sitedReducer.plugin.data
    }
}

function mapDispatchToProps(dispatch) {
    let loadPluginList = actions.loadPluginList(dispatch);
    return {
        loadPluginList, dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Site)