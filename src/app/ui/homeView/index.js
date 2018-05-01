import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import BaseComponent from '../../components/baseComponent';

/**
 * 首页界面
 *
 * @export
 * @class HomeView
 * @extends {Component}
 */
export default class HomeView extends BaseComponent {
    static navigationOptions = {
        title: 'Home'
    };

    constructor(props) {
        super(props);
        this.mTimer = null;
    }

    componentWillFocus() {
        super.componentWillFocus();
        this.mTimer = setInterval(
            () => { console.log('===> i am HomeView ' + this.mId) },
            3000
        );
    }

    componentDidBlur() {
        super.componentDidBlur();
        this.mTimer && clearTimeout(this.mTimer);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    This is Home.
                </Text>
                <View style={{ height: 10 }} />
                <Button
                    onPress={() => this.props.navigation.navigate({ routeName: 'Detail', key: 'Detail' })}
                    title="Detail"
                />
                <View style={{ height: 10 }} />
                <Button
                    onPress={() => this.props.navigation.navigate({ routeName: 'Settings', key: 'Settings' })}
                    title="Settings"
                />
                <View style={{ height: 10 }} />
                <Button
                    onPress={() => this.props.navigation.goBack()}
                    title="Back"
                />
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
