export const authSelect = (state) => state.auth;
export const authLoadingSelect = (state) => state.auth.loading;
export const authFetchingSelect = (state) => state.auth.fetching;
export const authErrorSelect = (state) => state.auth.error;
export const tokenSelect = (state) => state.auth.token;
export const meSelect = (state) => state.auth.user;
// export const meSelect = state => state.auth.result;
// export const smscodeSelect = state => state.auth.smscode;

// export const meInfoSelect = state => {
//   let _id =
//     state.auth.result && state.auth.result.user && state.auth.result.user._id;
//   if (!_id) return null;
//   return state.restful.db.user[_id];
// };

// export const meIdSelect = state =>
//   state.auth.result && state.auth.result.user && state.auth.result.user._id;

export function hasCap(user, cap) {
  if (!user) return false;
  if (!cap) return true;
  cap = cap.toUpperCase();
  let caps = (user && user.caps) || [];
  return caps.includes(cap);
}
