import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import BaseComponent from '../../components/baseComponent';

/**
 * 欢迎界面
 *
 * @export
 * @class SplashView
 * @extends {Component}
 */
export default class SplashView extends BaseComponent {
    static navigationOptions = {
        title: 'Splash'
    };

    componentDidMount() {
        this.mTimer = setTimeout(
            () => { this.props.navigation.navigate({ routeName: 'Main', key: 'Main' }) },
            1000
        );
    }

    componentWillUnmount() {
        this.mTimer && clearTimeout(this.mTimer);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Wait a minute.
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    }
});
