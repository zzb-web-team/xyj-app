/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from "axios";
// import QS from 'qs';
// import store from '../store/index'
// 环境的切换
// let rootsd = process.env.NODE_ENV;
// switch (rootsd) {
//     case "development": //开发环境
//         axios.defaults.baseURL = 'http://xyj.grapefruitcloud.com';
//         break;
//     case "production": //生产环境
//         axios.defaults.baseURL = 'http://xyj.grapefruitcloud.com';
//         break;
//     default: //测试环境
//         axios.defaults.baseURL = 'http://39.100.131.247';
// }
// 请求超时时间
const clearRequest = {
    source: {
        token: null,
        cancel: null
    }
};
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.defaults.timeout = 30000;
// post请求头
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
// 请求拦截器
// 配置发送请求拦截器
axios.interceptors.request.use(
    config => {
        config.cancelToken = clearRequest.source.token; // 这句很重要
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status == 0) {
            console.log(response);
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是200的情况
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    router.replace({
                        path: "/login",
                        query: { redirect: router.currentRoute.fullPath }
                    });
                    break;
                    // 403 token过期
                    // 登录过期对用户进行提示
                    // 清除本地token和清空vuex中token对象
                    // 跳转登录页面
                case 403:
                    this.$message("登录过期，请重新登录");
                    // 清除token
                    localStorage.removeItem("token");
                    //  store.commit('loginSuccess', null);
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    setTimeout(() => {
                        router.replace({
                            path: "/login",
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                    break;
                    // 404请求不存在
                case 404:
                    this.$message("网络请求不存在");
                    break;
                    // 其他错误，直接抛出错误提示
                default:
                    this.$message(error.response.data.message);
            }
            return Promise.reject(error.response);
        }
    }
);
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}