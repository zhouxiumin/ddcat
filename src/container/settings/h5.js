import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    WebView,
    Dimensions,
    InteractionManager
} from 'react-native';

const screenW = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');
class H5View extends Component {

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
                <WebView
                    style={{width:width,height:height-20,backgroundColor:'gray'}}
                    source={{uri:'http://star.ka94.com/sm.html',method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    listViewStyle: {
        flexDirection: 'column',
        flex: 1
    },
    innerViewStyle: {
        margin: 10,
        flexDirection: 'row',
        width: screenW - 20,
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(H5View)