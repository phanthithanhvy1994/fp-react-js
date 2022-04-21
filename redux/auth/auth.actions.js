import {AuthActionTypes} from './auth.types';
import store from '../store';

export const setUser = (user, userAttr) => {
  store.dispatch({
    type: AuthActionTypes.SET_USER,
    payload: {
      user,
      userAttr,
    },
  });
};

// export const setUser = (user, userAttr) => ({
//   type: AuthActionTypes.SET_USER,
//   payload: {
//     user,
//     userAttr,
//   },
// });

export const signOutUser = () => {
  store.dispatch({type: AuthActionTypes.SIGN_OUT_USER, payload: null});
};

// export const signOutUser = () => ({
//   type: AuthActionTypes.SIGN_OUT_USER,
//   payload: null,
// });

export const setTempUser = user => {
  store.dispatch({type: AuthActionTypes.SET_TEMP_USER, payload: user});
};

// export const setTempUser = user => ({
//   type: AuthActionTypes.SET_TEMP_USER,
//   payload: user,
// });

export const removeTempUser = () => {
  store.dispatch({type: AuthActionTypes.REMOVE_TEMP_USER, payload: null});
};

// export const removeTempUser = () => ({
//   type: AuthActionTypes.REMOVE_TEMP_USER,
//   payload: null,
// });
