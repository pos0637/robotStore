import { StackNavigator } from 'react-navigation';
import SplashView from './ui/splashView';
import DetailView from './ui/detailView';
import { MainView } from './ui/mainView';

export const BaseNavigation = StackNavigator(
    {
        Splash: {
            screen: SplashView
        },
        Main: {
            screen: MainView
        },
        Detail: {
            screen: DetailView
        }
    },
    {
        initialRouteName: 'Splash'
    }
);