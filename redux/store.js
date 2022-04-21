import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import messageDialogReducer from './message-dialog/MessageDialog.reducer';
import buttonHeaderReducer from './button-header/ButtonHeader.reducer';

// import authReducer from './auth/auth.reducer';

import {INITIAL_STATE as initialState} from './initialState';

function createReducer() {
  return combineReducers({
    messageDialogStore: messageDialogReducer,
    buttonHeaderStore: buttonHeaderReducer,
    // authStore: authReducer,
  });
}

function configStore(state) {
  const storeConfig = createStore(
    createReducer(),
    state,
    applyMiddleware(thunk),
  );
  return storeConfig;
}

const store = configStore(initialState);
export default store;
