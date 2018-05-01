import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import BaseComponent from '../../components/baseComponent';

/**
 * 设置界面
 *
 * @export
 * @class SettingsView
 * @extends {Component}
 */
export default class SettingsView extends BaseComponent {
    static navigationOptions = {
        title: 'Settings'
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    This is Settings.
                </Text>
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
