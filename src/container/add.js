import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from "../actions/sitedAction";
import {
    Button,
    StyleSheet,
    Text,
    ActivityIndicator,
    View,
    FlatList,
    Dimensions,
    InteractionManager
} from 'react-native';

import {saveSited} from "../util/sited";
import site from "./site";

const screenW = Dimensions.get('window').width;

class Add extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.loadSitedList();
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
            <FlatList contentContainerStyle={styles.flatListStyle}
                      data={this.props.data}
                      refreshing = {false}
                      onRefresh={()=>{console.log('refresh')}}
                      renderItem={({item, index}) => {
                          return (
                              <View style={styles.innerViewStyle}>
                                  <View style={styles.textSection}>
                                      <Text style={styles.textStyle}>{item.title}</Text>
                                  </View>
                                  <View style={styles.buttonSection}>
                                      <Button style={styles.buttonStyle} title="安装" onPress={() => {
                                          saveSited(item).then(()=>{
                                              this.props.loadPluginList();
                                              this.props.dispatch(actions.selectTab('site'));
                                          });
                                      }}/>
                                  </View>
                              </View>
                          )
                      }}
            />
        );
    }
}

const styles = StyleSheet.create({
    flatListStyle: {

    },
    innerViewStyle: {
        marginTop: 10,
        marginLeft: 5,
        marginBottom: 10,
        marginRight: 5,
        flexDirection: 'row',
        width: screenW - 10,
        height: 60,
        alignItems: 'center',
        backgroundColor: '#EEEEEE'
    },
    textSection: {
        width: screenW * 3 / 4 - 5
    },
    buttonSection: {
        width: screenW / 4 - 5,
    },
    textStyle: {
        fontSize: 20,
        paddingLeft: 20,
    },
    buttonStyle: {
        flexDirection: 'row-reverse',
        alignItems: 'flex-end',
        marginRight: 5,
        backgroundColor: '#C10066'
    }
});

function mapStateToProps(state) {
    return {
        isLoading: state.sitedReducer.add.isLoading,
        data: state.sitedReducer.add.data
    }
}

function mapDispatchToProps(dispatch) {
    let loadSitedList = actions.loadSitedList(dispatch);
    let loadPluginList = actions.loadPluginList(dispatch);
    return {
        loadSitedList, dispatch, loadPluginList
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Add)