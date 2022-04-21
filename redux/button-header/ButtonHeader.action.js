import {ButtonHeaderAction} from './ButtonHeader.types';
import store from '../store';

export const openCustomButtonHeader = buttonConfig => {
  store.dispatch({
    type: ButtonHeaderAction.CUSTOM_BUTTON_HEADER,
    payload: buttonConfig,
  });
};

export const closeCustomButtonHeader = () => {
  store.dispatch({
    type: ButtonHeaderAction.CLOSE_CUSTOM_BUTTON_HEADER,
  });
};
