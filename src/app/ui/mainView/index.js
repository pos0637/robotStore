import React from 'react';
import { View } from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import HomeView from '../homeView';
import GoodsView from '../goodsView';
import CarView from '../carView';
import SettingsView from '../settingsView';

/**
 * 主界面
 */
export const MainView = TabNavigator(
    {
        Home: {
            screen: HomeView
        },
        Goods: {
            screen: GoodsView
        },
        Car: {
            screen: CarView
        },
        Settings: {
            screen: SettingsView
        }
    },
    {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false
    }
);

MainView.navigationOptions = {
    title: 'Main',
    headerLeft: (<View></View>)
};