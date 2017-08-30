import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from "../../actions/sitedAction";
import {
    StyleSheet,
    Text,
    ActivityIndicator,
    View,
    TouchableOpacity,
    SectionList,
    Dimensions,
    InteractionManager
} from 'react-native';
import tag from "./tag";

const screenW = Dimensions.get('window').width;

class Tags extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.loadTagsList(this.props.ddcat);
        });
    }

    _pressRow(item){
        const ddcat = this.props.ddcat;
        this.props.dispatch(actions.resetLoadingState('tag'));
        this.props.navigator.push({
            component: tag,
            title: item.name,
            passProps: {
                ddcat: ddcat,
                url: item.url,
            },
            type: 'Normal'
        })
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
            <SectionList contentContainerStyle={styles.SectionListStyle}
                         sections={this.props.data}
                         renderSectionHeader={({section}) => <Text style={styles.header}>{section.title}</Text>}
                         renderItem={({item, index}) => {
                             return (
                                 <View style={styles.innerViewStyle}>
                                     <TouchableOpacity key={index} onPress={() => this._pressRow(item)} underlayColor="transparent">
                                         <View style={styles.row}>
                                             <Text  ellipsizeMode='tail' numberOfLines={1} style={styles.text}>{item.title} </Text>
                                         </View>
                                     </TouchableOpacity>
                                 </View>
                             )
                         }}
                         ListHeaderComponent={() => <View style={{ backgroundColor: '#25B960', alignItems: 'center', height: 30 }}>
                             <Text style={{ fontSize: 18, color: '#ffffff' }}>分类</Text></View>}
                         ListFooterComponent={() => <View style={{ backgroundColor: '#25B960', alignItems: 'center', height: 30 }}>
                             <Text style={{ fontSize: 18, color: '#ffffff' }}>分类结束</Text></View>}
            />
        );
    }
}

const styles = StyleSheet.create({

    header: {
        minWidth: '100%',
        paddingLeft:10,
        paddingTop: 20,
        paddingBottom: 10,
        fontWeight: 'bold',
        fontSize: 32
    },

    SectionListStyle: {
        // flexDirection: 'column',
        justifyContent: 'space-between',
    },
    innerViewStyle: {
        width:screenW/3,
        height: 40,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
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
        fontSize: 20
    }
});

function mapStateToProps(state) {
    return {
        isLoading: state.sitedReducer.tags.isLoading,
        data: state.sitedReducer.tags.data
    }
}

function mapDispatchToProps(dispatch) {
    let loadTagsList = actions.loadTagsList(dispatch);
    return {
        loadTagsList, dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags)