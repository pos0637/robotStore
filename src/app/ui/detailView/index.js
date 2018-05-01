import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import BaseComponent from '../../components/baseComponent';

/**
 * 商品详情界面
 *
 * @export
 * @class DetailView
 * @extends {Component}
 */
export default class DetailView extends BaseComponent {
    static navigationOptions = {
        title: 'Detail'
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    This is Detail.
                </Text>
                <View style={{ height: 10 }} />
                <Button
                    onPress={() => this.props.navigation.navigate({ routeName: 'Settings', key: 'Settings' })}
                    title="Settings"
                />
                <View style={{ height: 10 }} />
                <Button
                    onPress={() => this._backNavigation('Main', 'Car')}
                    title="Car"
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
