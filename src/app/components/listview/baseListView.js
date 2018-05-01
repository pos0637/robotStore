
import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    StyleSheet,
    Dimensions,
    TouchableHighlight
} from 'react-native';
import PropTypes from 'prop-types';
import GiftedListView from 'react-native-gifted-listview';

const gWindowWidth = Dimensions.get('window').width;

/**
 * 基础列表(支持多列数据)
 */
export default class BaseListView extends Component {
    static propTypes = {
        loadMore: PropTypes.bool, // 是否加载更多
        pullToRefresh: PropTypes.bool, // 拖拉刷新
        leftMargin: PropTypes.number, // 左边距
        rightMargin: PropTypes.number, // 右边距
        spacePadding: PropTypes.number, // 间距
        columns: PropTypes.number, // 列数
        onFetch: PropTypes.func, // 加载更多函数
        rawData: PropTypes.array, // 数据源列表
        renderCell: PropTypes.func, // 单元格渲染函数
        renderHeader: PropTypes.func, // 头部渲染函数
        onDataChanged: PropTypes.func // 列表刷新回调函数
    };

    /**
     * 默认属性
     */
    static defaultProps = {
        rawData: [],
        leftMargin: 0,
        rightMargin: 0,
        spacePadding: 0,
        columns: 1,
        loadMore: true,
        pullToRefresh: false
    };

    constructor(props) {
        super(props);

        this.ref = null;
        this.mDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.mRawData = props.rawData;
        this.mLeftMargin = props.leftMargin;
        this.mRightMargin = props.rightMargin;
        this.mSpacePadding = props.spacePadding;
        this.mColumns = props.columns;
        this.mPullToRefresh = props.pullToRefresh;
        this.mLoadMore = props.loadMore;
        this.mCellWidth = parseInt((gWindowWidth - this.mLeftMargin - this.mRightMargin - (this.mColumns - 1) * this.mSpacePadding) / this.mColumns, 10);

        this.state = {
            dataSource: this.mDataSource.cloneWithRows(this.mRawData)
        };
    }

    componentWillReceiveProps(newProps) {
        if (!this.mPullToRefresh && (typeof newProps.rawData !== 'undefined')) {
            this.setState({
                dataSource: this.mDataSource.cloneWithRows(newProps.rawData)
            });
        }
    }

    /**
     * 外部刷新数据
     */
    refresh() {
        this.ref._refresh();
    }

    /**
     * 获取原始数据
     *
     * @returns {Array} 原始数据
     */
    getRawData() {
        return this.ref._getRows();
    }

    /**
     * 设置原始数据
     *
     * @param {Array} rawData 原始数据
     * @param {object} options 操作对象
     */
    setRawData(rawData, options) {
        this.ref._updateRows(rawData, options);
    }

    /**
     * 设置强制更新
     *
     * @param {Boolean} forceUpdate 是否强制更新
     */
    setForceUpdate(forceUpdate) {
        let ds = this.state.dataSource;
        if (forceUpdate) {
            ds._rowHasChanged = () => true;
        }
        else {
            ds._rowHasChanged = (row1, row2) => row1 !== row2;
        }

        this.setState({ dataSource: ds });
    }

    /**
     * 获取渲染组件
     *
     * @returns {JSX.Element} 组件
     */
    render() {
        if (this.mPullToRefresh) {
            return (
                <GiftedListView
                    firstLoader={true}
                    refreshable={true}
                    withSections={false}
                    pagination={this.mLoadMore}
                    enableEmptySections={true}
                    refreshableTitle="正在获取数据..."
                    initialListSize={10}
                    contentContainerStyle={styles.list}
                    paginationAllLoadedView={() => this._renderPaginationAllLoadedView()}
                    paginationWaitingView={(paginateCallback) => this._renderPaginationWaitingView(paginateCallback)}
                    emptyView={(refreshCallback) => this._emptyView(refreshCallback)}
                    {...this.props}
                    ref={(r) => { this.ref = r }}
                    headerView={() => { return (typeof this.props.renderHeader !== 'undefined') ? this.props.renderHeader() : null }}
                    rowView={(cellData, sectionID, cellID, highlightCell) => this._renderCell(cellData, sectionID, cellID, highlightCell)}
                    onFetch={(page, callback, options) => this._onFetch(page, callback, options)}
                    customStyles={{
                        paginationView: {
                            width: gWindowWidth,
                            backgroundColor: 'transparent'
                        }
                    }}
                />
            );
        }
        else {
            return (
                <GiftedListView
                    {...this.props}
                    ref={(r) => { this.ref = r }}
                    firstLoader={false}
                    refreshable={false}
                    withSections={false}
                    pagination={false}
                    enableEmptySections={true}
                    contentContainerStyle={styles.list}
                    dataSource={this.state.dataSource}
                    emptyView={() => this._emptyView()}
                    rowView={(cellData, sectionID, cellID, highlightCell) => this._renderCell(cellData, sectionID, cellID, highlightCell)}
                    headerView={() => { return (typeof this.props.renderHeader !== 'undefined') ? this.props.renderHeader() : null }}
                />
            );
        }
    }

    /**
     * 获取渲染单元格组件
     *
     * @param {array} cellData 单元格数据
     * @param {int} sectionID 节索引
     * @param {int} cellID 单元格索引
     * @param {function} highlightCell 高亮单元格重置函数
     * @returns {JSX.Element} 组件
     */
    _renderCell(cellData, sectionID, cellID, highlightCell) {
        let cell = this.props.renderCell(cellData, sectionID, cellID, highlightCell);
        let marginLeft = ((cellID % this.mColumns) === 0) ? this.mLeftMargin : this.mSpacePadding;

        return (
            <View style={{ marginLeft: marginLeft, width: this.mCellWidth }}>
                {cell}
            </View>
        );
    }

    /**
     * 获取数据
     *
     * @param {Int32} [page=1] 页面
     * @param {Function} callback 获取数据完成回调函数
     * @param {Object} options 选项
     */
    _onFetch(page = 1, callback, options) {
        if (typeof this.props.onFetch !== 'undefined') {
            this.props.onFetch(page, callback, options);
            if (typeof this.props.onDataChanged !== 'undefined') {
                this.props.onDataChanged();
            }

            return this;
        }

        callback([], {
            allLoaded: true
        });
    }

    /**
     * 空数据界面
     *
     * @param {Function} refreshCallback 刷新回调函数
     * @returns
     */
    _emptyView(refreshCallback) {
        if (this.mPullToRefresh) {
            return (
                <View style={styles.emptyView}>
                    <Text>暂时没有数据</Text>
                    <TouchableHighlight
                        style={styles.emptyRefresh}
                        underlayColor="#c8c7cc"
                        onPress={refreshCallback}
                    >
                        <Text>刷新</Text>
                    </TouchableHighlight>
                </View>
            );
        }
        else {
            return (
                <View style={styles.emptyView} />
            );
        }
    }

    /**
     * 加载更多
     *
     * @param {Function} paginateCallback 更多回调函数
     * @returns
     */
    _renderPaginationWaitingView(paginateCallback) {
        return (
            <TouchableHighlight
                underlayColor="#c8c7cc"
                onPress={paginateCallback}
                style={styles.paginationView}
            >
                <Text style={[styles.actionsLabel, { fontSize: 13 }]}>
                    加载更多
                </Text>
            </TouchableHighlight>
        );
    }

    /**
     * 数据加载完毕
     *
     * @returns
     */
    _renderPaginationAllLoadedView() {
        return (
            <View style={styles.emptyView}>
                <Text>数据加载完毕</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    emptyView: {
        width: gWindowWidth,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    paginationView: {
        height: 44,
        width: gWindowWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionsLabel: {
        fontSize: 20,
        color: '#007aff'
    },
    emptyRefresh: {
        top: 10
    }
});