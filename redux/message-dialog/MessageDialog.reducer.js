import {INITIAL_STATE} from '../initialState';
import {MessageDialogAction} from './MessageDialog.types';

const MessageDialog = (state = INITIAL_STATE.messageDialogStore, action) => {
  switch (action.type) {
    case MessageDialogAction.OPEN_MESSAGE:
      return {
        content: action.payload.content,
        buttons: action.payload.buttons,
        isOpen: true,
      };
    case MessageDialogAction.CLOSE_DIALOG:
      return {
        ...INITIAL_STATE.messageDialogStore,
      };
    default:
      return state;
  }
};

export default MessageDialog;
