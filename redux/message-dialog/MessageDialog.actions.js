import {MessageDialogAction} from './MessageDialog.types';
import store from '../store';

export const openMessageDialog = messageConfig => {
  store.dispatch({
    type: MessageDialogAction.OPEN_MESSAGE,
    payload: messageConfig,
  });
};

export const closeDialog = () => {
  store.dispatch({
    type: MessageDialogAction.CLOSE_DIALOG,
  });
};
