import { createActions, handleActions } from 'redux-actions';
import { requestPost } from '../utils/_request';
// import { otherSuccess } from './restful';

/**
 * 支持登录方式:
 * 1. 如果cookie在服务器端存在,则直接使用cookie登录
 * 2. 支持密码登录
 * 3. 支持验证码登录
 * 注意:请求中需要在headers中带 `credentials: 'include'`
 */
const BASE_URL = '/apis/v1/auth';
const urls = {
  auth_by_phone_password: BASE_URL + '/auth_by_phone_password',
  auth_by_phone_sms: BASE_URL + '/auth_by_phone_sms',
  auth_by_phone_sms_get_sms: BASE_URL + '/auth_by_phone_sms/get_sms',
  auth_by_cookie: BASE_URL + '/auth_by_cookie',
  auth_by_code_state: BASE_URL + '/auth_by_code_state',
  // auth_by_code_or_cookie: BASE_URL+'/auth_by_code_or_cookie',
  // bind_phone: BASE_URL+'/bind_phone',
  // bind_phone_get_sms_code: BASE_URL+'/bind_phone/get_sms_code',
  // change_phone_get_sms_code: BASE_URL+'/change_phone/get_sms_code',
  refresh_token: BASE_URL + '/refresh_token',
  me_info: '/apis/v1/me/me_info',
  logout: BASE_URL + '/logout',
  get_authorize_url: BASE_URL + '/get_authorize_url'
};

export const {
  smscode: {
    request: smscodeRequest,
    success: smscodeSuccess,
    failure: smscodeFailure
  },
  login: {
    request: loginRequest,
    success: loginSuccess,
    failure: loginFailure
  },
  logout: {
    request: logoutRequest,
    success: logoutSuccess,
    failure: logoutFailure
  }
} = createActions({
  SMSCODE: {
    REQUEST: null,
    SUCCESS: null,
    FAILURE: null
  },
  LOGIN: {
    REQUEST: null,
    SUCCESS: null,
    FAILURE: null
  },
  LOGOUT: {
    REQUEST: null,
    SUCCESS: null,
    FAILURE: null
  }
});

const combinedLoginSuccess = payload => {
  return (dispatch, getState) => {
    let result = payload && payload.result;
    if (result) {
      let entities = {};
      if (result.user) {
        entities.user = { [result.user._id]: result.user };
      }
      // dispatch(otherSuccess({ entities, what: '$_forauthuser' }));
    }
    dispatch(loginSuccess(payload));
  };
};

// export const getSmsCodeBindPhone = phone => {
//   return (dispatch, getState) => {
//     dispatch(smscodeRequest({ phone }));
//     return requestPost(urls.bind_phone_get_sms_code, { phone })
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

// export const bindPhone = userdata => {
//   return (dispatch, getState) => {
//     dispatch(loginRequest());
//     return requestPost(urls.bind_phone, userdata)
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

// export const getSmsCodeChangePhone = phone => {
//   return (dispatch, getState) => {
//     dispatch(smscodeRequest({ phone }));
//     return requestPost(urls.change_phone_get_sms_code, { phone })
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

// export const loginByCodeOrCookie = () => {
//   return (dispatch, getState) => {
//     dispatch(loginRequest());
//     return requestPost(urls.auth_by_code_or_cookie, {})
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

export const smscode = phone => {
  return (dispatch, getState) => {
    dispatch(smscodeRequest({ phone }));
    return requestPost(urls.auth_by_phone_sms_get_sms, { phone })
      .then(result => {
        if (!result) {
          throw new Error('fetch return null!');
        }
        if (result.errcode) {
          throw result;
        }
        dispatch(smscodeSuccess({ phone, result }));
        return { phone, result };
      })
      .catch(error => {
        dispatch(smscodeFailure({ phone, error }));
        // throw error;
        return null;
      });
  };
};
export const getSmsCode = smscode;

export const loginByCookie = () => {
  return (dispatch, getState) => {
    dispatch(loginRequest());
    return requestPost(urls.auth_by_cookie, {})
      .then(result => {
        if (!result) {
          throw new Error('fetch return null!');
        }
        if (result.errcode) {
          throw result;
        }
        dispatch(combinedLoginSuccess({ result }));
        return { result };
      })
      .catch(error => {
        dispatch(loginFailure({ error }));
        // throw error;
        return null;
      });
  };
};

export const loginByPassword = userdata => {
  return (dispatch, getState) => {
    dispatch(loginRequest());
    return requestPost(urls.auth_by_phone_password, userdata)
      .then(result => {
        if (!result) {
          throw new Error('fetch return null!');
        }
        if (result.errcode) {
          throw result;
        }
        dispatch(combinedLoginSuccess({ result }));
        return { result };
      })
      .catch(error => {
        dispatch(loginFailure({ error }));
        // throw error;
        return null;
      });
  };
};

export const loginBySmscode = userdata => {
  return (dispatch, getState) => {
    dispatch(loginRequest());
    return requestPost(urls.auth_by_phone_sms, userdata)
      .then(result => {
        if (!result) {
          throw new Error('fetch return null!');
        }
        if (result.errcode) {
          throw result;
        }
        dispatch(combinedLoginSuccess({ result }));
        return { result };
      })
      .catch(error => {
        dispatch(loginFailure({ error }));
        // throw error;
        return null;
      });
  };
};

export const getAuthorizeURL = (scope = 'snsapi_userinfo') => {
  return requestPost(urls.get_authorize_url, { scope }).catch(error => {
    console.log('error getAuthorizeURL!', error);
    return error;
  });
};

export const loginByCodeState = userdata => {
  return (dispatch, getState) => {
    dispatch(loginRequest());
    return requestPost(urls.auth_by_code_state, userdata)
      .then(result => {
        if (!result) {
          throw new Error('fetch return null!');
        }
        if (result.errcode) {
          throw result;
        }
        dispatch(combinedLoginSuccess({ result }));
        return { result };
      })
      .catch(error => {
        dispatch(loginFailure({ error }));
        // throw error;
        return null;
      });
  };
};

export const refresh_token = () => {
  return (dispatch, getState) => {
    dispatch(loginRequest());
    return requestPost(urls.refresh_token, {})
      .then(result => {
        if (!result) {
          throw new Error('fetch return null!');
        }
        if (result.errcode) {
          throw result;
        }
        dispatch(combinedLoginSuccess({ result }));
        return { result };
      })
      .catch(error => {
        dispatch(loginFailure({ error }));
        // throw error;
        return null;
      });
  };
};

export const me_info = () => {
  return (dispatch, getState) => {
    return requestPost(urls.me_info, {})
      .then(result => {
        if (!result) {
          throw new Error('fetch return null!');
        }
        if (result.errcode) {
          throw result;
        }
        let entities = {};
        if (result.user) {
          entities.user = { [result.user._id]: result.user };
        }
        // dispatch(otherSuccess({ entities, what: '$_forauthuser' }));
        return { result };
      })
      .catch(error => {
        // throw error;
        return null;
      });
  };
};

export const logout = () => {
  return (dispatch, getState) => {
    dispatch(logoutRequest());
    return requestPost(urls.logout, {})
      .then(result => {
        if (!result) {
          throw new Error('fetch return null!');
        }
        if (result.errcode) {
          throw result;
        }
        dispatch(logoutSuccess({ result }));
        return { result };
      })
      .catch(error => {
        dispatch(logoutFailure({ error }));
        // throw error;
        return null;
      });
  };
};

const reducer = handleActions(
  {
    SMSCODE: {
      REQUEST: (state, action) => ({
        ...state,
        smscode: { fetching: true, error: null, phone: action.payload.phone }
      }),
      SUCCESS: (state, action) => ({
        ...state,
        smscode: {
          fetching: false,
          error: null,
          phone: action.payload.phone,
          result: action.payload.result,
          time: new Date()
        }
      }),
      FAILURE: (state, action) => ({
        ...state,
        smscode: {
          fetching: false,
          error: action.payload.error,
          phone: action.payload.phone
        }
      })
    },
    LOGIN: {
      REQUEST: (state, action) => ({
        ...state,
        fetching: true
      }),
      SUCCESS: (state, action) => ({
        ...state,
        fetching: false,
        error: null,
        result: action.payload.result
      }),
      FAILURE: (state, action) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
        result: null
      })
    },
    LOGOUT: {
      REQUEST: (state, action) => ({
        ...state,
        fetching: true
      }),
      SUCCESS: (state, action) => ({
        ...state,
        fetching: false,
        error: null,
        result: null
      }),
      FAILURE: (state, action) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
        result: null
      })
    }
  },
  {
    smscode: {},
    fetching: false,
    error: null,
    result: null
  }
);

export default reducer;
