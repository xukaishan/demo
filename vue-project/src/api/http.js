import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

Vue.prototype.$axios = axios;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
// request 拦截器
axios.interceptors.request.use(
    config => {

        Object.assign(config, {
            baseURL: 'http://localhost:3000',
            timeout: 15000,
        })

        let token = localStorage.getItem('access_token') || 'eyJhY2Nlc3NfdG9rZW4iOiI2MjFWVVB0OTZTNlh3WmZVIiwicmVmcmVzaF90b2tlbiI6IjZUNmxiQzloY2tpRVhLRnMiLCJ0b2tlbl90eXBlIjoibWFjIiwiZXhwaXJlX2luIjoyNTkyMDAwfQ=='
        if (token) {
            Object.assign(config, {
                token
            })
        }

        console.log('config=>', config);

        const encodeForm = data => Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
        let url = config.url
        // get参数编码
        if (config.method === 'get' && config.params) {
            url = '?' + encodeForm(config.params)
            config.params = {}
        }
        config.url = url

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// response 拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '错误请求'
                    break;
                case 401:
                    err.message = '未授权，请重新登录'
                    break;
                case 403:
                    err.message = '拒绝访问'
                    break;
                case 404:
                    err.message = '请求错误,未找到该资源'
                    break;
                case 405:
                    err.message = '请求方法未允许'
                    break;
                case 408:
                    err.message = '请求超时'
                    break;
                case 500:
                    err.message = '服务器端出错'
                    break;
                case 501:
                    err.message = '网络未实现'
                    break;
                case 502:
                    err.message = '网络错误'
                    break;
                case 503:
                    err.message = '服务不可用'
                    break;
                case 504:
                    err.message = '网络超时'
                    break;
                case 505:
                    err.message = 'http版本不支持该请求'
                    break;
                default:
                    err.message = `连接错误${err.response.status}`
            }

        } else {
            err.message = "连接到服务器失败"
        }
        return Promise.reject(err)
    })

/**
* 封装get方法
* @param url
* @param data
* @returns {Promise}
*/

export function get ({ url = '', data }) {

    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: data
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 * 
 *若content-type是application/x-www-form-urlencoded也就是常说的表单提交传输的样式是formdata:{a:xxx,b:xxx},urlencoding后是a=xxx&b=xxx
 *约定为纯JSON格式入参 Content-Type=application/json。后台就要使用@RequestBody注解，接收的入参可以是一个固定格式的bean，也可以是一个Map。同时前台直接使用axios.post即可，不再需要使用QS序列化。
 */

export function post ({ url = '', options = {}, data }) {
    let contentType = options.headers && options.headers['Content-Type'] || axios.defaults.headers['Content-Type'];
    let send = {
        method: 'post',
        url,
        headers: options.headers || axios.defaults.headers,
        responseType: options.responseType || 'json',
    };
    if (data && /form/.test(contentType)) {
        data = qs.stringify(data);
    }
    send = Object.assign(send, {
        data
    })
    console.log('send=>', send);


    return new Promise((resolve, reject) => {
        axios(send)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}






