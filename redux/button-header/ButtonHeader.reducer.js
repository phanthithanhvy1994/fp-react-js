import {INITIAL_STATE} from '../initialState';
import {ButtonHeaderAction} from './ButtonHeader.types';

const ButtonHeaderCustom = (state = INITIAL_STATE.buttonHeaderStore, action) => {
  switch (action.type) {
    case ButtonHeaderAction.CUSTOM_BUTTON_HEADER:
      return {
        buttons: action.payload.buttons,
        isCustomBtn: true,
      };
    case ButtonHeaderAction.CLOSE_CUSTOM_BUTTON_HEADER:
      return {
        ...INITIAL_STATE.buttonHeaderStore,
      };
    default:
      return state;
  }
};

export default ButtonHeaderCustom;
