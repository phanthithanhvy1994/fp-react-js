import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import messageDialogReducer from './message-dialog/MessageDialog.reducer';
import buttonHeaderReducer from './button-header/ButtonHeader.reducer';

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['authStore'],
  blacklist: ['dialogStore'],
};

const rootReducer = combineReducers({
  messageDialogStore: messageDialogReducer,
  buttonHeaderStore: buttonHeaderReducer,
});

export default persistReducer(persistConfig, rootReducer);
