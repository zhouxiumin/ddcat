import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from "../../actions/sitedAction";
import * as userAgent from "../../common/userAgent";
import Orientation from 'react-native-orientation';
import {
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    InteractionManager
} from 'react-native';
import VideoPlayer from "react-native-video-controls";

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const imageW = screenW;
const imageH = screenH;

class Section extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const ddcat = this.props.ddcat;
        const plugin = ddcat.getCurrentPlugin();

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.loadSectionList(this.props.ddcat, this.props.url);
            const ddcat = this.props.ddcat;
            const plugin = ddcat.getCurrentPlugin();

            if (plugin.main.dtype === '3') {
                Orientation.lockToLandscape();
            }
        });
    }

    componentWillUnmount() {
        Orientation.unlockAllOrientations();
        Orientation.lockToPortrait();
    }

    _onPressImage() {
        console.log(this);
    }

    render() {
        if (this.props.isLoading) {
            return (
                <View style={{
                    flex: 1,
                    paddingTop: 20,
                    flexDirection: 'row',
                    justifyContent: "center",
                    alignItems: 'center',
                    alignSelf: "center"
                }}>
                    <ActivityIndicator/>
                </View>
            );
        }
        const ddcat = this.props.ddcat;
        const plugin = ddcat.getCurrentPlugin();
        const dtype = plugin.main.dtype;
        const headers = {
            'Referer': this.props.url,
            'User-Agent': userAgent.MAC
        };
        switch (dtype) {
            case '1':
            case 1:
                return (
                    <FlatList contentContainerStyle={styles.flatListStyle}
                              keyExtractor={(item, index) => item + index}
                              data={this.props.data}
                              renderItem={({item, i}) => {
                                  return (
                                      <TouchableOpacity activeOpacity={1} onLongPress={this._onPressImage.bind(this)}>
                                          <Image source={{
                                              uri: item,
                                              cache: 'force-cache',
                                              headers: headers
                                          }}
                                                 style={{width: imageW, height: imageH, resizeMode: 'contain'}}
                                          />
                                      </TouchableOpacity>
                                  )
                              }}
                    />
                );
                break;
            case '2':
            case 2:
                return (
                    <FlatList contentContainerStyle={styles.novelViewStyle}
                              keyExtractor={(item, index) => item.key}
                              data={this.props.data}
                              renderItem={({item, i}) => {
                                  if (item.t === 1) {
                                      return (<Text style={styles.novelStyle}>{item.d}</Text>)
                                  } else {
                                      return (<View/>);
                                  }
                              }}
                    />
                );
                break;
            case '3':
            case 3:
                return (
                    <VideoPlayer source={{uri: this.props.data[0]}} controlTimeout={15000}
                                 resizeMode={'cover'}
                                 navigator={this.props.navigator}
                                 onBack={() => {
                                     console.log(this);
                                     this.props.updateNavBarStatus(false);
                                     this.props.updateTabBarStatus(true);
                                     this.props.navigator.pop();
                                 }}
                                 style={styles.videoStyle}
                    />
                );
                break;
            default:
                return (
                    <View/>
                );
        }

    }
}

const styles = StyleSheet.create({

    flatListStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    innerViewStyle: {
        width: screenW,
        height: 32,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#eaeaea'
    },
    row: {
        marginTop: 5,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 20,
        marginLeft: 10,
    },
    text: {
        flexDirection: 'row',
        fontSize: 14
    },
    novelViewStyle: {
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    novelStyle: {
        flexDirection: 'row',
        fontSize: 14
    },
    videoStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    }
});

function mapStateToProps(state) {
    return {
        isLoading: state.sitedReducer.section.isLoading,
        data: state.sitedReducer.section.data,
        showBar: state.sitedReducer.section.showBar,
        showPluginNavBar: state.sitedReducer.tabs.showPluginNavBar,
        showPluginTabBar: state.sitedReducer.tabs.showPluginTabBar,
    }
}

function mapDispatchToProps(dispatch) {
    let loadSectionList = actions.loadSectionList(dispatch);
    let updateScreenWidth = actions.updateScreenWidth(dispatch);
    let updateNavBarStatus = actions.updateNavBarStatus(dispatch);
    let updateTabBarStatus = actions.updateTabBarStatus(dispatch);
    let hiddenBar = actions.hiddenBar(dispatch);

    return {
        loadSectionList, updateScreenWidth, dispatch, updateNavBarStatus, updateTabBarStatus, hiddenBar
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section)