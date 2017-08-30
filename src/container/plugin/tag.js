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
import book from "./book";

const screenW = Dimensions.get('window').width;
const imageW = screenW/6 -10;
const imageH = imageW/0.618;

class Tag extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.loadTagList(this.props.ddcat, this.props.url);
        });
    }

    _pressRow(item){
        const ddcat = this.props.ddcat;
        const plugin = ddcat.getCurrentPlugin();
        const dtype = plugin.main.dtype;
        let tag = ddcat.matchTagByUrl(item.url);
        if(!tag) {
            this.props.dispatch(actions.resetLoadingState('book'));
            this.props.navigator.push({
                component: book,
                title: item.name,
                passProps: {
                    ddcat: ddcat,
                    url: item.url,
                    logo:item.logo
                },
                type: 'Normal'
            })
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
        let url = this.props.url.replace('@page', 1);
        const headers ={
            'Referer': url,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
        };
        return (
            <FlatList contentContainerStyle={styles.flatListStyle}
                      numColumns={1}
                      keyExtractor={(item, index)=> item+index}
                         data={this.props.data}
                         renderItem={({item, i}) => {
                             return (
                                 <View style={styles.innerViewStyle}>
                                     <TouchableOpacity key={i} onPress={() => this._pressRow(item)} underlayColor="transparent">
                                         <View style={styles.row}>
                                             <Image source={{uri:item.logo, cache: 'force-cache', headers:headers}} style={{width: imageW, height: imageH}}
                                                    />
                                             <Text  ellipsizeMode='tail' numberOfLines={1} style={styles.text}>{item.name} </Text>
                                         </View>
                                     </TouchableOpacity>
                                 </View>
                             )
                         }}
                      onEndReached={()=>{this._loadMoreData()}}
                      onEndReachedThreshold={0.1}
            />
        );
    }
    _loadMoreData(){
        console.log(this.props.page);
        this.props.loadTagList(this.props.ddcat,this.props.url, this.props.page);
    }
}

const styles = StyleSheet.create({

    flatListStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    innerViewStyle: {
        flexDirection: 'row',
        marginLeft: 10,

        height:imageH + 20,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#eaeaea'
    },
    row: {
        width: screenW,
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 20,
        marginLeft: 10,
    },
    text: {
        marginLeft: 10,
        flexDirection: 'row',
        fontSize: 20
    }
});

function mapStateToProps(state) {
    return {
        page: state.sitedReducer.tag.page,
        isLoading: state.sitedReducer.tag.isLoading,
        data: state.sitedReducer.tag.data
    }
}

function mapDispatchToProps(dispatch) {
    let loadTagList = actions.loadTagList(dispatch);
    return {
        loadTagList, dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tag)