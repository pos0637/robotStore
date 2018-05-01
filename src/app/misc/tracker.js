/**
 * 日志
 */
export default class Tracker {
    /**
     * 跟踪信息
     *
     * @param {any} content 信息
     * @memberof Tracker
     */
    static trace(content) {
        console.trace('trace: ' + content);
    }

    /**
     * 提示信息
     *
     * @param {any} content 信息
     * @memberof Tracker
     */
    static info(content) {
        console.info('info: ' + content);
    }

    /**
     * 提示异常
     *
     * @param {any} content 信息
     * @memberof Tracker
     */
    static error(content) {
        console.error('error: ' + content);
    }
}