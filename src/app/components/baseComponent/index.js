import { Component } from 'react';
import { NavigationActions } from 'react-navigation';

/**
 * 基础组件
 *
 * @export
 * @class BaseComponent
 * @extends {Component}
 */
export default class BaseComponent extends Component {
    constructor(props) {
        super(props);
        this.mId = Math.random();
        this.ref = null;
        this._mWillFocusListener = null;
        this._mDidFocusListener = null;
        this._mWillBlurListener = null;
        this._mDidBlurListener = null;
    }

    componentWillMount() {
        console.log('componentWillMount: ' + this.constructor.name + ': ' + this.mId);
    }

    componentDidMount() {
        console.log('componentDidMount: ' + this.constructor.name + ': ' + this.mId);
        const navigation = this.props.navigation;
        if (navigation) {
            this._mWillFocusListener = navigation.addListener('willFocus', () => this.componentWillFocus());
            this._mDidFocusListener = navigation.addListener('didFocus', () => this.componentDidFocus());
            this._mWillBlurListener = navigation.addListener('willBlur', () => this.componentWillBlur());
            this._mDidBlurListener = navigation.addListener('didBlur', () => this.componentDidBlur());
        }
    }

    componentWillReceiveProps() {
        console.log('componentWillReceiveProps: ' + this.constructor.name + ': ' + this.mId);
    }

    componentWillUnmount() {
        console.log('componentWillUnmount: ' + this.constructor.name + ': ' + this.mId);
        if (this.props.navigation) {
            this._mWillFocusListener.remove();
            this._mDidFocusListener.remove();
            this._mWillBlurListener.remove();
            this._mDidBlurListener.remove();
        }
    }

    componentWillFocus() {
        console.log('componentWillFocus: ' + this.constructor.name + ': ' + this.mId);
    }

    componentDidFocus() {
        console.log('componentDidFocus: ' + this.constructor.name + ': ' + this.mId);
    }

    componentWillBlur() {
        console.log('componentWillBlur: ' + this.constructor.name + ': ' + this.mId);
    }

    componentDidBlur() {
        console.log('componentDidBlur: ' + this.constructor.name + ': ' + this.mId);
    }

    /**
     * 重置路由
     *
     * @param {any} routeName 重置路由名称
     * @param {any} subRouteNames 子路由名称
     * @memberof BaseComponent
     */
    _resetNavigation(routeName, ...subRouteNames) {
        let actions = new Set();
        actions.add(NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: routeName, key: routeName })],
        }));

        for (let subRouteName of subRouteNames) {
            actions.add(NavigationActions.navigate({ routeName: subRouteName, key: subRouteName }));
        }

        actions.forEach(action => this.props.navigation.dispatch(action));
    }

    _backNavigation(routeName, ...subRouteNames) {
        let actions = new Set();
        actions.add(NavigationActions.back({
            key: routeName
        }));

        for (let subRouteName of subRouteNames) {
            actions.add(NavigationActions.navigate({ routeName: subRouteName, key: subRouteName }));
        }

        actions.forEach(action => this.props.navigation.dispatch(action));
    }
}