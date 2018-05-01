import { Platform, NativeModules } from 'react-native';
import all from './All.js';

function getLocale() {
    try {
        if (Platform.OS === 'android') {
            return NativeModules.I18nManager.localeIdentifier;
        } else {
            return NativeModules.SettingsManager.settings.AppleLocale;
        }
    } catch (e) {
        return null;
    }
}
function getI18N(v) {
    let locale = getLocale();
    if (v[locale]) {
        return v[locale];
    } else if (v['']) {
        return v[''];
    } else {
        return v['default'];
    }
}
const i18n = getI18N(all);
export default i18n;
