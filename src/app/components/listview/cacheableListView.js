import React from 'react';
import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';
import PropTypes from 'prop-types';
import BaseComponent from '../baseComponent';
import PullToRefreshListView from './pullToRefreshListView';

/**
 * 缓存数据列表
 */
export default class CacheableListView extends BaseComponent {
    static propTypes = {
        firstLoader: PropTypes.bool, // 是否自动加载首屏
        cacheable: PropTypes.bool, // 是否缓存数据
        cacheName: PropTypes.string, // 缓存名称
        url: PropTypes.string, // 请求地址
        body: PropTypes.any, // 请求提交内容
        headerUrl: PropTypes.string, // 请求头部头部地址
        expires: PropTypes.number, // 缓存超时时间
        pageSize: PropTypes.number, // 一页数量
        loadMore: PropTypes.bool, // 是否加载更多
        rawData: PropTypes.array, // 数据源列表
        renderHeader: PropTypes.func, // 渲染头部函数
        renderFooter: PropTypes.func, // 渲染底部函数
        onFetch: PropTypes.func, // 加载函数
        onFetchData: PropTypes.func, // 网络请求函数
        onFetchComplete: PropTypes.func, // 网络请求完成函数
        onRefreshHeader: PropTypes.func // 头部刷新回调
    };

    /**
     * 默认属性
     */
    static defaultProps = {
        firstLoader: true,
        cacheable: true,
        cacheName: 'CacheableListViewDefaultKey',
        url: '',
        body: undefined,
        expires: 1000 * 3600 * 24 * 1,
        pageSize: 10,
        loadMore: true,
        rawData: [],
        renderHeader: null,
        onFetch: null,
        onFetchData: null,
        onFetchComplete: null,
        onRefreshHeader: null
    };

    constructor(props) {
        super(props);

        /**
         * 请求地址
         */
        this.mUrl = this.props.url;

        /**
         * 请求头部地址
         */
        this.mHeaderUrl = this.props.headerUrl;

        /**
         * 缓存键值
         */
        this.mCacheName = this.props.cacheName;

        /**
         * 是否首次加载
         */
        this.mIsFirstLoad = true;

        /**
         * 是否加载数据
         */
        this.mFirstLoader = this.props.firstLoader;

        /**
         * 列表头部数据
         */
        this.mHeaderData = null;

        /**
         * 持久化存储对象
         */
        this.mStorage = new Storage({
            size: this.props.pageSize,
            storageBackend: AsyncStorage,
            defaultExpires: this.props.expires,
            enableCache: true
        });
    }

    componentWillReceiveProps(newProps) {
        if ((newProps.url !== this.mUrl) || (newProps.headerUrl !== this.mHeaderUrl)) {
            this.mUrl = newProps.url;
            this.mHeaderUrl = newProps.headerUrl;
            this.mFirstLoader = newProps.firstLoader;
            this.mCacheName = newProps.cacheName;
            this.mIsFirstLoad = true;
            this.ref.reload(false, { showWaiting: false });
        }
    }

    render() {
        return (
            <PullToRefreshListView
                ref={(r) => { this.ref = r }}
                {...this.props}
                onFetch={(page, callback, options) => this._onFetch(page, callback, options)}
                renderHeader={() => this._renderHeader()}
            />
        );
    }

    /**
     * 重新加载数据
     *
     * @param {boolean} showWaiting 是否显示等待界面
     */
    reload(showWaiting) {
        this.ref.reload(false, { showWaiting: showWaiting });
    }

    /**
     * 获取原始数据
     *
     * @returns {Array} 原始数据
     */
    getRawData() {
        return this.ref ? this.ref.getRawData() : [];
    }

    /**
     * 设置原始数据
     *
     * @param {Array} rawData 原始数据
     */
    setRawData(rawData) {
        this.ref.setRawData(rawData);
        this.mStorage.save({
            key: this.mCacheName,
            rawData: { data: rawData },
            expires: this.props.expires
        });
    }

    /**
     * 获取所有项目
     */
    getAllItems() {
        return this.ref ? this.ref.getRawData() : [];
    }

    /**
     * 清空列表
     */
    clearAllItems() {
        this.ref.setRawData([]);
        this.mStorage.save({
            key: this.mCacheName,
            rawData: { data: [] },
            expires: this.props.expires
        });

        return this;
    }
}