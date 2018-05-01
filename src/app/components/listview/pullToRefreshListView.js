import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    Dimensions,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import BaseComponent from '../baseComponent';
import GiftedListView from './giftedListView';

const gWindowWidth = Dimensions.get('window').width;

/**
 * 下拉刷新列表
 */
export default class PullToRefreshListView extends BaseComponent {
    static propTypes = {
        firstLoader: PropTypes.bool, // 是否自动加载首屏
        loadMore: PropTypes.bool, // 是否加载更多
        autoLoadMore: PropTypes.bool, // 是否自动加载更多
        pullToRefresh: PropTypes.bool, // 拖拉刷新
        emptyHint: PropTypes.string, // 空数据提示
        leftMargin: PropTypes.number, // 左边距
        rightMargin: PropTypes.number, // 右边距
        spacePadding: PropTypes.number, // 间距
        columns: PropTypes.number, // 列数
        pageSize: PropTypes.number, // 一页数量
        rawData: PropTypes.array, // 数据源列表
        onFetch: PropTypes.func, // 加载更多函数
        renderEmptyView: PropTypes.func, // 加载空界面
        renderCell: PropTypes.func.isRequired, // 单元格渲染函数
        renderHeader: PropTypes.func, // 头部渲染函数
        onDataChanged: PropTypes.func // 列表刷新回调函数
    };

    /**
     * 默认属性
     */
    static defaultProps = {
        firstLoader: true,
        loadMore: true,
        autoLoadMore: true,
        pullToRefresh: true,
        emptyHint: '暂无记录',
        leftMargin: 0,
        rightMargin: 0,
        spacePadding: 0,
        columns: 1,
        rawData: [],
        onFetch: null,
        renderEmptyView: null,
        renderCell: null,
        renderHeader: null,
        onDataChanged: null
    };

    constructor(props) {
        super(props);

        this._initialize(props);
    }

    componentWillReceiveProps(nextProps) {
        this._initialize(nextProps);
    }

    /**
     * 获取原始数据
     *
     * @returns {Array} 原始数据
     */
    getRawData() {
        return this.ref ? this.ref._getRows() : [];
    }

    /**
     * 设置原始数据
     *
     * @param {Array} rawData 原始数据
     * @param {Object} options 选项
     */
    setRawData(rawData, options = {}) {
        this.ref._updateRows(rawData, options || {});
    }

    /**
     * 重新加载数据
     *
     * @param {boolean} showWaiting 显示等待视图
     * @param {Object} options 选项
     */
    reload(showWaiting = true, options = {}) {
        if (showWaiting) {
            this.ref._refresh();
        }
        else {
            this.ref._refreshWithoutWaiting(options);
        }
    }

    /**
     * 获取渲染组件
     *
     * @returns {JSX.Element} 组件
     */
    render() {
        if (this.props.pullToRefresh) {
            return (
                <GiftedListView
                    firstLoader={this.props.firstLoader}
                    refreshable={true}
                    withSections={false}
                    pagination={this.props.loadMore}
                    enableEmptySections={true}
                    refreshableTitle="正在获取数据..."
                    initialListSize={10}
                    contentContainerStyle={styles.contentContainer}
                    paginationFetchingView={() => this._renderPaginationFetchingView()}
                    paginationAllLoadedView={() => this._renderPaginationAllLoadedView()}
                    paginationWaitingView={(paginateCallback) => this._renderPaginationWaitingView(paginateCallback)}
                    emptyView={(refreshCallback) => this._emptyView(refreshCallback)}

                    {...this.props}

                    ref={(r) => { this.ref = r }}
                    renderRow={(cellData, sectionID, cellID) => this._renderCell(cellData, sectionID, cellID)}
                    headerView={() => this.props.renderHeader()}
                    onFetch={(page, callback, options) => this._onFetch(page, callback, options)}
                    onEndReachedThreshold={0}
                    onEndReached={() => this._onEndReached()}

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
                    firstLoader={false}
                    refreshable={false}
                    withSections={false}
                    pagination={false}
                    enableEmptySections={true}
                    contentContainerStyle={styles.contentContainer}
                    emptyView={() => this._emptyView()}
                    onEndReachedThreshold={0}
                    onEndReached={() => this._onEndReached()}

                    {...this.props}

                    ref={(r) => { this.ref = r }}
                    renderRow={(cellData, sectionID, cellID) => this._renderCell(cellData, sectionID, cellID)}
                    headerView={() => this.props.renderHeader()}
                />
            );
        }
    }

    /**
     * 初始化组件
     *
     * @param {any} props 参数
     */
    _initialize(props) {
        this.mCellWidth = parseInt((gWindowWidth - props.leftMargin - props.rightMargin - (props.columns - 1) * props.spacePadding) / props.columns, 10);
    }

    /**
     * 获取渲染单元格组件
     *
     * @param {array} cellData 单元格数据
     * @param {int} sectionID 节索引
     * @param {int} cellID 单元格索引
     * @returns {JSX.Element} 组件
     */
    _renderCell(cellData, sectionID, cellID) {
        let cell = this.props.renderCell(cellData, sectionID, cellID);
        let marginLeft = ((cellID % this.props.columns) === 0) ? this.props.leftMargin : this.props.spacePadding;

        return (
            <View key={'cell_' + cellID} style={{ marginLeft: marginLeft, width: this.mCellWidth }}>
                {cell}
            </View>
        );
    }

    /**
     * 获取无数据视图组件
     *
     * @param {Function} refreshCallback 重新刷新数据回调函数
     * @returns {JSX.Element} 组件
     */
    _emptyView(refreshCallback) {
        if (this.props.renderEmptyView) {
            return this.props.renderEmptyView();
        }

        return this._defaultEmptyView();
    }

    _renderPaginationFetchingView() {
        return null;
    }

    /**
     * 获取加载更多视图组件
     *
     * @param {Function} paginateCallback 更多回调函数
     * @returns {JSX.Element} 组件
     */
    _renderPaginationWaitingView(paginateCallback) {
        if (this.getRawData().length < this.props.pageSize) {
            return this._renderPaginationAllLoadedView();
        }

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
        if (this.getRawData().length > 0) {
            return (<View style={styles.emptyView}><Text>数据加载完毕</Text></View>);
        }

        if (this.props.renderEmptyView) {
            return this.props.renderEmptyView();
        }

        return this._defaultEmptyView();
    }

    /**
     * 获取数据
     *
     * @param {Int32} [page=1] 页面
     * @param {Function} callback 获取数据完成回调函数
     * @param {Object} options 选项
     */
    _onFetch(page = 1, callback, options) {
        if (this.props.onFetch) {
            this.props.onFetch(page, (data, options) => {
                callback(data, options);
                if (this.props.onDataChanged) {
                    setTimeout(() => this.props.onDataChanged(), 0);
                }
            }, options);
        }
        else {
            callback([], {
                allLoaded: true
            });
            if (this.props.onDataChanged) {
                setTimeout(() => this.props.onDataChanged(), 0);
            }
        }
    }

    /**
     * 到达列表底部事件处理函数
     */
    _onEndReached() {
        if (!this.props.loadMore) {
            return;
        }

        if ((this.getRawData().length < this.props.pageSize)
            || (this.ref._getPaginationStatus() !== 'waiting')) {
            return;
        }

        if (this.props.autoLoadMore) {
            this.ref._onPaginate();
        }
    }

    /**
     * 默认无数据时展现的界面
     */
    _defaultEmptyView() {
        return (<View style={styles.emptyViewContainer}>
            <Image
                style={[styles.noDataImage]}
                source={require('./empty_bg.png')}
            />
            <Text style={styles.noDataText}>{this.props.emptyHint}</Text>
        </View>);
    }
}

const styles = StyleSheet.create({
    emptyViewContainer: {
        width: gWindowWidth,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    contentContainer: {
        alignItems: 'flex-start'
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
    },
    noDataImage: {
        marginTop: 40,
        width: 50,
        height: 70
    },
    noDataText: {
        fontSize: 13,
        marginBottom: 40,
        color: '#bbb'
    }
});