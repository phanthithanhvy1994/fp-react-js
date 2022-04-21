import React from 'react';

import {View, Modal} from 'react-native';

import MessageDialogStyle from './MessageDialog.style';

class SettingDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {isOpen, content, arrayButton} = this.props;

    return (
      <Modal animationType="slide" transparent={true} visible={isOpen}>
        <View style={MessageDialogStyle.centeredView}>
          <View
            style={[
              MessageDialogStyle.modalView,
              MessageDialogStyle.flexWidth,
            ]}>
            {content}
            <View style={MessageDialogStyle.modalBottomView}>
              {arrayButton}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default SettingDialog;
