import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import {Text, View, Modal} from 'react-native';

import MasterButton from '../../../components/shared/buttons/MasterButton';

import {closeDialog} from '../../../redux/message-dialog/MessageDialog.actions';

import {dialogConstant} from '../../../constants/constants';

import MessageDialogStyle from './MessageDialog.style';

class MessageDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  closeDialog = () => {
    closeDialog();
  };

  getButton = (button, index) => {
    let properties = null;
    switch (button.type) {
      // Functional button
      case dialogConstant.button.FUNCTION:
        properties = {
          key: index,
          name: button.name,
          handleOnPress: () => {
            this.closeDialog();
            return button.action && button.action();
          },
        };
        break;
      // None functional button(Cancel)
      default:
        properties = {
          key: index,
          name: button.name,
          handleOnPress: this.closeDialog,
        };
        break;
    }
    return (
      <MasterButton
        key={properties.key}
        name={properties.name}
        handleClick={properties.handleOnPress}
      />
    );
  };

  renderButton = buttons =>
    buttons
      ? buttons.map((button, index) => this.getButton(button, index))
      : null;

  render() {
    const {isOpen, isSettingField, content, buttons} = this.props;
    // Disable render component
    // eslint-disable-next-line no-extra-boolean-cast
    if (!Boolean(isOpen)) {
      return null;
    }

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={isOpen}
        onRequestClose={this.closeDialog}>
        <View style={MessageDialogStyle.centeredView}>
          <View
            style={[
              MessageDialogStyle.modalView,
              MessageDialogStyle.defaultWidth,
            ]}>
            <Text style={MessageDialogStyle.textDialog}>{content}</Text>
            <View style={MessageDialogStyle.modalBottomView}>
              {this.renderButton(buttons)}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const getDialogInfo = storeData => storeData.messageDialogStore;

const selectDialogInfo = createSelector(
  [getDialogInfo],
  dialogData => dialogData,
);

function mapStateToProps(storeData) {
  return {...selectDialogInfo(storeData)};
}

export default connect(mapStateToProps)(MessageDialog);
