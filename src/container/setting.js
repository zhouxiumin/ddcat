import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from "../actions/settingAction";
import * as sitedActions from "../actions/sitedAction";
import {
    StyleSheet,
    Text,
    View,
    Modal,
    PickerIOS,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TouchableHighlight,
    InteractionManager
} from 'react-native';
import {clearHttpCache} from "../util/httpCache";
import cache from "./settings/cache";
import h5 from "./settings/h5";

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const modalWith = 300;
const modalHeight = 200;

class Setting extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

        });
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.listViewStyle}>
                    <TouchableOpacity style={styles.innerViewStyle} onPress={this._setSitedUrl.bind(this)}
                                      underlayColor="transparent">
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>设置插件地址</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.innerViewStyle} onPress={this._clearPageCache.bind(this)}
                                      underlayColor="transparent">
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>清除页面缓存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.innerViewStyle} onPress={() => {
                    }} underlayColor="transparent">
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>清除图片缓存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.innerViewStyle} onPress={this._viewSysCache.bind(this)}
                                      underlayColor="transparent">
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>查看系统缓存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.innerViewStyle} onPress={this._viewNav.bind(this)}
                                      underlayColor="transparent">
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>网址导航</Text>
                    </TouchableOpacity>
                </ScrollView>
                <View>
                    <Modal visible={this.props.isModalOpen} onPressBackdrop={this.props.closeModal}
                           onRequestClose={() => this.closeModal()} animationType={"slide"} transparent={true}>
                        <View style={styles.container}>
                            <View style={styles.main}>
                                <PickerIOS
                                    style={{width: 200}}
                                    selectedValue={this.props.selectSitedSource}
                                    onValueChange={(src) => {this.props.changeSitedSource(src);this.props.loadSitedList()}}>
                                    {this.props.SitedSources.map(
                                        (src) => (
                                            <PickerIOS.Item
                                                key={src}
                                                style={{width: 100}}
                                                value={src}
                                                label={src}
                                            />
                                        ))
                                    }
                                </PickerIOS>
                                <TouchableHighlight style={{marginBottom:20}} onPress={() => {
                                    this.props.closeModal()
                                }}>
                                    <Text>关闭</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }

    _setSitedUrl() {
        this.props.openModal();
    }

    _viewSysCache() {
        this.props.navigator.push({
            component: cache,
            title: '缓存信息',
            passProps: {
            },
            type: 'Normal'
        });
    }
    _viewNav() {
        this.props.navigator.push({
            component: h5,
            title: '网址导航',
            passProps: {
            },
            type: 'Normal'
        });
    }

    _clearPageCache() {
        clearHttpCache();
    }
}

const styles = StyleSheet.create({
    listViewStyle: {
        flexDirection: 'column',
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    main: {
        position: 'absolute',
        left: (screenW-modalWith)/2,
        right: 0,
        top: (screenH-modalHeight)/2,
        width: modalWith,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: '#FFFFFF',
    },
    innerViewStyle: {
        margin: 10,
        flexDirection: 'row',
        width: screenW - 20,
        height: 60,
        alignItems: 'center',
        backgroundColor: '#EEEEEE'
    },
    text: {
        marginLeft: 10,
        flexDirection: 'row',
        fontSize: 20
    }
});

function mapStateToProps(state) {
    return {
        isModalOpen: state.settingReducer.isModalOpen,
        selectSitedSource: state.settingReducer.selectSitedSource,
        SitedSources: state.settingReducer.SitedSources,
    }
}

function mapDispatchToProps(dispatch) {
    let openModal = actions.openModal(dispatch);
    let closeModal = actions.closeModal(dispatch);
    let changeSitedSource = actions.changeSitedSource(dispatch);
    let loadSitedList = sitedActions.loadSitedList(dispatch);
    return {
        openModal, dispatch, closeModal, changeSitedSource, loadSitedList
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting)