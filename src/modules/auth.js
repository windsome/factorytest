import { createActions, handleActions } from 'redux-actions';
import { requestPost } from '../utils/_request';
import { read, write, remove } from '../utils/storage';

// import { otherSuccess } from './restful';

/**
 * 支持登录方式:
 * 1. 如果cookie在服务器端存在,则直接使用cookie登录
 * 2. 支持密码登录
 * 3. 支持验证码登录
 * 注意:请求中需要在headers中带 `credentials: 'include'`
 *
 * 登录接口返回数据:
 * {
 *  token,
 *  user
 * }
 */

const STORE_AUTH_TOKEN = 'user_token';
const STORE_AUTH_USER = 'user_info';
async function readStore() {
  let token = await read(STORE_AUTH_TOKEN);
  let user = await read(STORE_AUTH_USER);
  if (token && user) {
    return { token, user: JSON.parse(user) };
  }
  return {};
}
async function saveStore(token, user) {
  await write(STORE_AUTH_TOKEN, token);
  await write(STORE_AUTH_USER, JSON.stringify(user));
  return { token, user };
}
async function clearStore() {
  await remove(STORE_AUTH_TOKEN);
  await remove(STORE_AUTH_USER);
  return null;
}

// const BASE_URL = '/apis/v1/auth';
const BASE_URL = 'https://m.h5ren.com/apis/v1/auth';
const urls = {
  auth_by_phone_password: BASE_URL + '/auth_by_phone_password',
  // auth_by_phone_sms: BASE_URL + '/auth_by_phone_sms',
  // auth_by_phone_sms_get_sms: BASE_URL + '/auth_by_phone_sms/get_sms',
  // auth_by_cookie: BASE_URL + '/auth_by_cookie',
  logout: BASE_URL + '/logout',
};

export const {
  smscode: {
    request: smscodeRequest,
    success: smscodeSuccess,
    failure: smscodeFailure,
  },
  login: {
    request: loginRequest,
    success: loginSuccess,
    failure: loginFailure,
  },
  logout: {
    request: logoutRequest,
    success: logoutSuccess,
    failure: logoutFailure,
  },
} = createActions({
  SMSCODE: {
    REQUEST: null,
    SUCCESS: null,
    FAILURE: null,
  },
  LOGIN: {
    REQUEST: null,
    SUCCESS: null,
    FAILURE: null,
  },
  LOGOUT: {
    REQUEST: null,
    SUCCESS: null,
    FAILURE: null,
  },
});

export function authByLocalStore() {
  return (dispatch, getState) => {
    return readStore().then((result) => {
      let { token, user } = result;
      if (token && user) {
        dispatch(loginSuccess({ token, user }));
      } else {
        dispatch(loginFailure({ error: null }));
      }
      return user;
    });
  };
}

// const combinedLoginSuccess = payload => {
//   return (dispatch, getState) => {
//     let result = payload && payload.result;
//     if (result) {
//       let entities = {};
//       if (result.user) {
//         entities.user = { [result.user._id]: result.user };
//       }
//       // dispatch(otherSuccess({ entities, what: '$_forauthuser' }));
//     }
//     dispatch(loginSuccess(payload));
//   };
// };

export const loginByPassword = (userdata) => {
  return (dispatch, getState) => {
    dispatch(loginRequest());
    return requestPost(urls.auth_by_phone_password, userdata)
      .then((result) => {
        if (!result) {
          throw new Error('fetch return null!');
        }
        if (result.errcode) {
          throw result;
        }
        let { token, user } = result;
        return saveStore(token, user);
      })
      .then((result) => {
        dispatch(loginSuccess(result));
        return result.user;
      })
      .catch((error) => {
        dispatch(loginFailure({ error }));
        // throw error;
        return null;
      });
  };
};

// export const smscode = phone => {
//   return (dispatch, getState) => {
//     dispatch(smscodeRequest({ phone }));
//     return requestPost(urls.auth_by_phone_sms_get_sms, { phone })
//       .then(result => {
//         if (!result) {
//           throw new Error('fetch return null!');
//         }
//         if (result.errcode) {
//           throw result;
//         }
//         dispatch(smscodeSuccess({ phone, result }));
//         return { phone, result };
//       })
//       .catch(error => {
//         dispatch(smscodeFailure({ phone, error }));
//         // throw error;
//         return null;
//       });
//   };
// };
// export const getSmsCode = smscode;

// export const loginBySmscode = userdata => {
//   return (dispatch, getState) => {
//     dispatch(loginRequest());
//     return requestPost(urls.auth_by_phone_sms, userdata)
//       .then(result => {
//         if (!result) {
//           throw new Error('fetch return null!');
//         }
//         if (result.errcode) {
//           throw result;
//         }
//         dispatch(combinedLoginSuccess({ result }));
//         return { result };
//       })
//       .catch(error => {
//         dispatch(loginFailure({ error }));
//         // throw error;
//         return null;
//       });
//   };
// };

export const logout = () => {
  return (dispatch, getState) => {
    dispatch(logoutRequest());
    return requestPost(urls.logout, {})
      .then((result) => {
        if (!result) {
          throw new Error('fetch return null!');
        }
        if (result.errcode) {
          throw result;
        }
        dispatch(logoutSuccess({ result }));
        return result;
      })
      .catch((error) => {
        dispatch(logoutFailure({ error }));
        return clearStore();
      });
  };
};

const reducer = handleActions(
  {
    SMSCODE: {
      REQUEST: (state, action) => ({
        ...state,
        smscode: { fetching: true, error: null, phone: action.payload.phone },
      }),
      SUCCESS: (state, action) => ({
        ...state,
        smscode: {
          fetching: false,
          error: null,
          phone: action.payload.phone,
          result: action.payload.result,
          time: new Date(),
        },
      }),
      FAILURE: (state, action) => ({
        ...state,
        smscode: {
          fetching: false,
          error: action.payload.error,
          phone: action.payload.phone,
        },
      }),
    },
    LOGIN: {
      REQUEST: (state, action) => ({
        ...state,
        fetching: true,
      }),
      SUCCESS: (state, action) => ({
        ...state,
        loading: false,
        fetching: false,
        error: null,
        token: action.payload.token,
        user: action.payload.user,
      }),
      FAILURE: (state, action) => ({
        ...state,
        loading: false,
        fetching: false,
        error: action.payload.error,
        token: null,
        user: null,
      }),
    },
    LOGOUT: {
      REQUEST: (state, action) => ({
        ...state,
        fetching: true,
      }),
      SUCCESS: (state, action) => ({
        ...state,
        fetching: false,
        error: null,
        token: null,
        user: null,
      }),
      FAILURE: (state, action) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
        token: null,
        user: null,
      }),
    },
  },
  {
    smscode: {},
    loading: true,
    fetching: false,
    error: null,
    token: null,
    user: null,
  }
);

export default reducer;
