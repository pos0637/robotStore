import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import BaseComponent from '../../components/baseComponent';
import PullToRefreshListView from '../../components/listview/pullToRefreshListView';

/**
 * 商品列表界面
 *
 * @export
 * @class GoodsView
 * @extends {Component}
 */
export default class GoodsView extends BaseComponent {
    static navigationOptions = {
        title: 'Goods'
    };

    constructor(props) {
        super(props);
        this.listview = null;
    }

    componentDidMount() {
        super.componentDidMount();
        this.listview.setRawData([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    This is Goods.
                </Text>
                <View style={{ height: 10 }} />
                <PullToRefreshListView
                    ref={(r) => { this.listview = r }}
                    columns={2}
                    renderCell={(cellData, sectionID, cellID) => this.renderCell(cellData, sectionID, cellID)}
                />
                <Text style={styles.welcome}>
                    This is Goods.
                </Text>
            </View>
        );
    }

    renderCell(cellData, sectionID, cellID) {
        return (
            <Text>{cellData}</Text>
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
