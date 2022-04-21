import React from 'react';
import {View, Text} from 'react-native';
import {withTranslation} from 'react-i18next';

import Style from './EditableTable.style';

class Column extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      value: props.value,
    };
  }

  render() {
    const {title, customStyles, width, t} = this.props;

    const columnStyle = [
      Style.cell,
      Style.column,
      Style.cellHeader,
      customStyles.cell,
    ];
    if (width) {
      columnStyle.push(width);
    }

    const columnText = [Style.headerText, customStyles.columnText];

    return (
      <View style={columnStyle}>
        <Text style={columnText}>{t(`${title}`)}</Text>
      </View>
    );
  }
}

export default withTranslation()(Column);
