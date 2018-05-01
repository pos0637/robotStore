import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import BaseComponent from '../../components/baseComponent';

/**
 * 购物车界面
 *
 * @export
 * @class CarView
 * @extends {Component}
 */
export default class CarView extends BaseComponent {
    static navigationOptions = {
        title: 'Car'
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    This is Car.
                </Text>
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
