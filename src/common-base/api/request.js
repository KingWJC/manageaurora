// import axios from 'axios'
const axios = require('axios'); // 使用引入CDN方式
import config from '../../config/index';
//axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.crossDomain = true;
axios.defaults.timeout = 120000;
// axios.defaults.withCredentials = true
// 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
axios.interceptors.request.use(
  cfg => {
    if (cfg.method && cfg.method.toUpperCase() === 'GET' && cfg.params && cfg.params.requestHeaders) {
      Object.assign(cfg.headers.common, cfg.params.requestHeaders);
      delete cfg.params.requestHeaders;
    }
    if (config.token) {
      cfg.headers.common['ACCESS-TOKEN'] = config.token;
    }
    return cfg;
  },
  err => Promise.resolve(err)
);
axios.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  err => {
    return Promise.reject(err);
  }
);

export default axios;
