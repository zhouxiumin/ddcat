import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from "../../actions/sitedAction";
import {
    StyleSheet,
    ActivityIndicator,
    View,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions,
    InteractionManager
} from 'react-native';
import section from "./section";
import {imageUrlCheckAndFix} from "../../util/stringUtils";

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const imageW = screenW / 3 - 10;
const imageH = imageW / 0.618;

class Hots extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.loadBookList(this.props.ddcat, this.props.url);
        });
    }

    _pressRow(item) {
        const ddcat = this.props.ddcat;
        const plugin = ddcat.getCurrentPlugin();
        const dtype = plugin.main.dtype;
        switch (dtype) {
            case '1':
            case '2':
            case '3':
                this.props.dispatch(actions.resetLoadingState('section'));
                this.props.navigator.push({
                    component: section,
                    title: item.name,
                    passProps: {
                        ddcat: ddcat,
                        url: item.url
                    },
                    type: 'Normal'
                });
                return;
                break;
        }
    }

    render() {
        if (this.props.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20,flexDirection: 'row',justifyContent: "center",alignItems: 'center', alignSelf: "center"}}>
                    <ActivityIndicator/>
                </View>
            );
        }
        const ddcat = this.props.ddcat;
        const plugin = ddcat.getCurrentPlugin();
        const dtype = plugin.main.dtype;
        console.log('dtype type: '+ (typeof dtype) +' ' +dtype);
        console.log(this.props.data.sections);
        switch (dtype) {
            case '1':
            case '2':
            case '3':
                return (
                    <View style={styles.viewStyle}>
                        <View style={styles.firstViewStyle}>
                            <Image source={{uri: imageUrlCheckAndFix(this.props.data.logo) || this.props.logo, cache: 'force-cache'}} style={
                                {width: imageW, height: imageH,}}
                            />
                            <Text style={{fontSize: 14}}>
                                {this.props.data.name}
                                <Text style={{fontSize: 10}}>{this.props.data.author}</Text>
                            </Text>
                        </View>
                        <FlatList contentContainerStyle={styles.flatListStyle}
                                  keyExtractor={(item, index) => item.name + index}
                                  numColumns={3}
                                  data={this.props.data.sections}
                                  renderItem={({item, i}) => {
                                      return (
                                          <View style={styles.innerViewStyle}>
                                              <TouchableOpacity key={i} onPress={() => this._pressRow(item)}
                                                                underlayColor="transparent">
                                                  <View style={styles.row}>
                                                      <Text ellipsizeMode='tail' numberOfLines={1}
                                                            style={styles.text}>{item.name} </Text>
                                                  </View>
                                              </TouchableOpacity>
                                          </View>
                                      )
                                  }}
                        />
                    </View>
                );
                break;
            case '4':
                const headers ={
                    'Referer': this.props.url,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
                };
                return (
                    <FlatList contentContainerStyle={styles.sectionStyle}
                              keyExtractor={(item, index) => item + index}
                              data={this.props.data}
                              renderItem={({item, i}) => {
                                  return (
                                      <Image source={{
                                          uri: item,
                                          cache: 'force-cache',
                                          headers: headers
                                      }}
                                             style={{width: screenW, height: screenH}}
                                      />
                                  )
                              }}
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
    sectionStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    viewStyle: {
        flex:1,
        justifyContent: 'center',
        paddingBottom: 120
    },
    firstViewStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListStyle: {
        marginTop: 32,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 60
    },
    innerViewStyle: {
        width: screenW / 3,
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
        // flex: 1,
        flexDirection: 'row',
        fontSize: 20
    }
});

function mapStateToProps(state) {
    return {
        isLoading: state.sitedReducer.book.isLoading,
        data: state.sitedReducer.book.data
    }
}

function mapDispatchToProps(dispatch) {
    let loadBookList = actions.loadBookList(dispatch);
    return {
        loadBookList, dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hots)