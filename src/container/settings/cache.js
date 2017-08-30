import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    InteractionManager
} from 'react-native';

const screenW = Dimensions.get('window').width;

class Cache extends Component {

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
                    <TouchableOpacity style={styles.innerViewStyle}
                                      underlayColor="transparent">
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>设置插件地址</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.innerViewStyle}
                                      underlayColor="transparent">
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>清除页面缓存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.innerViewStyle} onPress={() => {
                    }} underlayColor="transparent">
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>清除图片缓存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.innerViewStyle}
                                      underlayColor="transparent">
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>查看系统缓存</Text>
                    </TouchableOpacity>
                </ScrollView>
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cache)