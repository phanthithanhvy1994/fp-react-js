import React from 'react';
import {Text, View, Modal} from 'react-native';
import MasterButton from '../buttons/MasterButton';
import MessageDialogStyle from './MessageDialog.style';
import {buttonConstant} from '../../../constants/constants';
import {useTranslation} from 'react-i18next';
import map from 'lodash/map';
import {MESSAGE} from '../../../constants/message';

function DialogSAP(props) {
  const {t} = useTranslation();
  const [visible, setVisible] = React.useState(true);
  const {
    content,
    title,
    actionButtonOk,
    actionButtonCancel,
    hasCancelBtn,
  } = props.config;

  const closeDialog = () => {
    setVisible(false);
  };

  const clickButtonOK = () => {
    closeDialog();
    actionButtonOk && actionButtonOk();
  };

  const clickButtonCancel = () => {
    closeDialog();
    actionButtonCancel && actionButtonCancel();
  };

  // [HONDAIPB-CR] - 15/07/2020 - Cancel previous request if HardwareBack press
  // Cover render error message
  const renderMessage = message => {
    if (
      MESSAGE.M015 === message ||
      MESSAGE.M019 === message ||
      MESSAGE.M020 === message
    ) {
      return t(message);
    }
    return message;
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={closeDialog}
      onDismiss={closeDialog}>
      <View style={MessageDialogStyle.centeredView}>
        <View
          style={[
            MessageDialogStyle.modalView,
            MessageDialogStyle.defaultWidth,
          ]}>
          {title && <Text style={MessageDialogStyle.textDialog}>{title}</Text>}
          {map(content, (err, i) => (
            <Text key={i} style={MessageDialogStyle.textDialog}>
              {renderMessage(err)}
            </Text>
          ))}

          <View style={MessageDialogStyle.modalBottomView}>
            {hasCancelBtn && (
              <MasterButton
                name={buttonConstant.BUTTON_CANCEL}
                handleClick={clickButtonCancel}
                key="btn_cancel"
              />
            )}
            <MasterButton
              name={buttonConstant.BUTTON_OK}
              handleClick={clickButtonOK}
              key="btn_ok"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default DialogSAP;
