import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from "../../actions/searchAction";
import {
    StyleSheet,
    TextInput,
    View,
    Image,
    Text,
    Button,
    TouchableOpacity,
    FlatList,
    Dimensions,
    InteractionManager
} from 'react-native';
import book from "./book";

const screenW = Dimensions.get('window').width;
const imageW = screenW / 3 - 10;
const imageH = imageW / 0.618;

class Search extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

        });
    }

    _pressRow(item) {
        const ddcat = this.props.ddcat;
        const plugin = ddcat.getCurrentPlugin();
        const dtype = plugin.main.dtype;
        let tag = ddcat.matchTagByUrl(item.url);
        if (!tag) {
            this.props.dispatch(actions.resetLoadingState('book'));
            this.props.navigator.push({
                component: book,
                title: item.name,
                passProps: {
                    ddcat: ddcat,
                    url: item.url,
                    logo: item.logo
                },
                type: 'Normal'
            })
        }
    }

    render() {
        let plugin = this.props.ddcat.getCurrentPlugin();
        let home = plugin.main.home;
        let hots = home.hots;
        let url = hots.url.replace('@page', 1);
        const headers = {
            'Referer': url,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
        };
        return (
            <View>
                <View>
                    <TextInput  style={styles.textInputStyle} />
                    <Button />
                </View>
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
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    textInputStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
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
        isLoading: state.searchReducer.search.isLoading,
        keyword: state.searchReducer.search.keyword,
        data: state.searchReducer.search.data,

    }
}

function mapDispatchToProps(dispatch) {
    let loadSearchList = actions.loadSearchList(dispatch);
    return {
        loadSearchList, dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)