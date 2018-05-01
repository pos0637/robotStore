import Tracker from './tracker';

/**
 * 请求
 */
export default class Request {
    constructor(url, params, timeout) {
        this.url = url;
        this.params = params;
        this.timeout = timeout;
    }

    get(success, error, complete) {
        return this.do('get', success, error, complete);
    }

    post(success, error, complete) {
        return this.do('post', success, error, complete);
    }

    put(success, error, complete) {
        return this.do('put', success, error, complete);
    }

    delete(success, error, complete) {
        return this.do('delete', success, error, complete);
    }

    batchDelete(success, error, complete) {
        this.params = {
            delete: JSON.stringify(this.params)
        };

        return this.do('post', success, error, complete);
    }

    /**
     * 执行请求
     *
     * @param {string} method 请求方式
     * @param {function} success 请求成功处理函数
     * @param {function} error 请求失败处理函数
     * @param {function} complete 请求完成处理函数
     * @memberof Request
     */
    do(method, success, error, complete) {
        let isResponseOK = false;
        return new Promise((resolve, reject) => {
            fetch(this.url, this.params, { timeout: this.timeout })
                .then((response) => {
                    isResponseOK = response.ok;
                    return response.json();
                }, () => {
                    Tracker.error('网络请求失败，未返回数据:' + this.url);
                    return null;
                })
                .then((result) => {
                    if (isResponseOK) {
                        this.checkResult(result) ? resolve(result) : reject(result);
                    }
                    else {
                        reject(result);
                    }
                })
                .catch((error) => {
                    Tracker.error('网络请求异常:' + this.url);
                    reject(error);
                })
                .done();
        }).then(
            (result) => success && success(result),
            (result) => error && error(result)
        );
    }

    /**
     * 检查返回结果是否正确
     *
     * @param {any} result 返回结果
     * @returns 是否正确
     * @memberof Request
     */
    checkResult(result) {
        return (result && (result['code'] === 200));
    }
}