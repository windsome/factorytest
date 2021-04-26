import Errcode from './errcode';
// let xdebug = window.myDebug('app:_request');
const xdebug = (...args) => {
  console.log(...args);
};

/**
 * 通用网络请求函数,返回json,否则抛出异常
 * @param {String} method GET/POST/PUT/DELETE
 * @param {String} url 请求地址
 * @param {Object} data json数据,放在body中,当请求为GET/DELETE时,data无效
 * @param {Object} options 选项,默认为{ headers: { 'Content-Type': 'application/json' },credentials: true }
 * @returns {Object} 返回的json数据,错误则抛出错误
 */
export const request = (method, url, data = {}, options) => {
  if (!method) {
    xdebug('error! method=null!');
  }
  if (!url) {
    xdebug('error! url=null!');
  }

  let body = null;
  if (method === 'GET' || method === 'DELETE') {
    body = null;
  } else {
    body = JSON.stringify(data);
  }

  let { headers, credentials } = {
    headers: { 'Content-Type': 'application/json' },
    credentials: true,
    ...(options || {}),
  };

  let opts = {
    method,
    headers: headers,
    body,
  };
  if (credentials) {
    opts = {
      ...opts,
      credentials: 'include',
    };
  }
  xdebug('request', url, JSON.stringify(opts));
  return fetch(url, opts)
    .catch((error) => {
      console.error('error!', error, url, opts);
      throw new Errcode('可能已经断网了', -1);
    })
    .then((response) => {
      if (!response.ok) {
        console.error('error! response fail!', response.statusText, url, opts);
        let message = response.statusText;
        let errcode = -1;
        if (response.status === 401) {
          message = '不是授权用户';
          errcode = 401;
        }
        throw new Errcode(message, errcode);
      }
      if (response.status === 204) {
        return {};
      }

      let contentType = response.headers.get('content-type');
      if (contentType.includes('application/json')) {
        return response.json();
      } else {
        xdebug("Oops, we haven't got JSON!");
        return { errcode: -1, xContentType: contentType, xOrigData: response };
      }
    });
};

/**
 * POST请求的封装
 * @param {String} url 请求地址
 * @param {Object} data body数据
 */
export const requestPost = (url, data = {}) => {
  return request('POST', url, data);
};

/**
 * PUT请求的封装
 * @param {String} url 请求地址
 * @param {Object} data body数据
 */
export const requestPut = (url, data = {}) => {
  return request('PUT', url, data);
};

/**
 * GET请求的封装
 * @param {String} url 请求地址
 * @param {Object} options 选项,默认为{ headers: { 'Content-Type': 'application/json' },credentials: true }
 */
export const requestGet = (url, options) => {
  return request('GET', url, null, options);
};

/**
 * DELETE请求的封装
 * @param {String} url 请求地址
 */
export const requestDelete = (url) => {
  return request('DELETE', url);
};

export default request;
