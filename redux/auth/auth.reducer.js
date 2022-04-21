import {AuthActionTypes} from './auth.types';
import {INITIAL_STATE} from '../initialState';

const auth = (state = INITIAL_STATE.authStore, action) => {
  switch (action.type) {
    case AuthActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case AuthActionTypes.SIGN_OUT_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: false,
      };
    case AuthActionTypes.SET_TEMP_USER:
      return {
        ...state,
        tempUser: action.payload,
        isAuthenticated: true,
      };
    case AuthActionTypes.REMOVE_TEMP_USER:
      return {
        ...state,
        tempUser: action.payload,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default auth;
