import {openMessageDialog} from '../redux/message-dialog/MessageDialog.actions';
import {
  buttonConstant,
  dialogConstant,
} from '../constants/constants';

export const showMessage = (msg, handler, isCanelAction = false) => {
  const buttons = [{
    name: buttonConstant.BUTTON_OK,
    type: dialogConstant.button.FUNCTION,
    action: () => {
      handler && handler();
    },
  }];
  isCanelAction && buttons.unshift({
    name: buttonConstant.BUTTON_CANCEL,
    type: dialogConstant.button.NONE_FUNCTION,
  });
  openMessageDialog({
    content: msg,
    buttons
  });
}

export const getErrorMessage = (response) => {
  let errMsg = '';
  if (response && response.message && response.message.messages) {
    errMsg = response.message.messages[0] && response.message.messages[0].messageContent;
  } else if (response && response.messages) {
    errMsg = response.messages[0] && response.messages[0].messageContent;
  }
  return errMsg;
};
