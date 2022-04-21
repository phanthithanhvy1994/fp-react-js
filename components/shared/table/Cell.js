import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import Style from './EditableTable.style';
import {cellTableService} from '../../../services/cellTableService';

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      shouldComponentUpdate: true,
      isHighlight: false,
    };
  }

  // just re-render text changed (improve performance)
  shouldComponentUpdate(props, state) {
    return state.shouldComponentUpdate;
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.value !== state.value ||
      props.isHighlight !== state.isHighlight ||
      props.editable
    ) {
      return {
        value: props.value,
        shouldComponentUpdate: true,
        isHighlight: props.isHighlight,
      };
    } else {
      return {shouldComponentUpdate: false};
    }
  }

  // Catch focus and blur events on cell
  changeEventOnCell = event => {
    cellTableService.changeEvent(event);
  };

  formatNumber = number => {
    // case: 999,999,999 => 999999999
    const {columnInfo} = this.props;
    number = (number || '').replace(/,/g, '');
    number = number.replace(/[^0-9]/g, '');
    const commaCount = columnInfo.maxLength === 11 ? 2 : 1;
    if (number.length >= columnInfo.maxLength - commaCount) {
      number = number.substring(0, columnInfo.maxLength - commaCount);
    }
    number = !number ? number : Number(number);

    return number;
  };

  onChangeText = (e, scanType) => {
    let {text} = e.nativeEvent;
    text = this.formatNumber(text);
    if (typeof this.props.onCellChange === 'function') {
      const {rowData, field} = this.props;
      this.props.onCellChange(text, field, rowData, scanType);
    }
  };

  onCheck = checked => {
    const value = checked ? 'X' : '';
    const {rowData, field} = this.props;
    this.props.onCellChange(value, field, rowData);
  };

  renderDisableCell = (value, columnStyle, isHighlight) => (
    <View style={[columnStyle, isHighlight ? Style.cellHighLight : '']}>
      <Text style={Style.cellText}>{value}</Text>
    </View>
  );

  renderIconDelete = () => {
    const {onDeleteRow, rowData} = this.props;
    return (
      <TouchableOpacity onPress={() => onDeleteRow(rowData)}>
        <Icon type="FontAwesome" name="times-circle" style={Style.closeIcon} />
      </TouchableOpacity>
    );
  };

  render() {
    const {
      editable,
      customStyles,
      width,
      columnInfo,
      autoFocus,
      onSubmitEditing,
      onDeleteRow,
      isLastCell,
      rowData,
      onFocusCell,
      isHighlight,
      scanType,
      zeroCount,
    } = this.props;
    const {value} = this.state;
    let textAlign = Style.alignItemsCenter;
    if (columnInfo.type === 'numeric') {
      textAlign = Style.alignItemsRight;
    }
    if (columnInfo.type === 'text') {
      textAlign = Style.alignItemsLeft;
    }

    let columnStyle = [Style.cell, textAlign, customStyles.cell];

    if (width) {
      columnStyle.push(width);
    }

    if (editable) {
      const cellStyle = [
        Style.cellInput,
        customStyles.cellInput,
        onDeleteRow ? Style.inputPaddingLeft : '',
      ];
      columnStyle.push(Style.cellBlue);

      if (zeroCount && rowData.Sap_CheckBox) {
        return this.renderDisableCell(value, columnStyle, isHighlight);
      }

      return (
        <View style={[columnStyle, isHighlight ? Style.cellHighLight : '']}>
          <View style={[Style.cellEditable]}>
            <TextInput
              ref={input => {
                input &&
                  autoFocus &&
                  setTimeout(() => {
                    input.focus();
                  }, 0);
              }}
              value={value}
              onChange={e => this.onChangeText(e, scanType)}
              style={cellStyle}
              keyboardType={columnInfo.type}
              onFocus={() => {
                typeof onFocusCell === 'function' &&
                  onFocusCell('', '', rowData);
                this.changeEventOnCell('focusCell');
              }}
              onBlur={() => this.changeEventOnCell('blurCell')}
              onSubmitEditing={onSubmitEditing}
              maxLength={columnInfo.maxLength}
            />
            {onDeleteRow && isLastCell && this.renderIconDelete()}
          </View>
        </View>
      );
    }

    if (columnInfo.type === 'checkbox') {
      return (
        <View
          style={[
            columnStyle,
            isHighlight ? Style.cellHighLight : Style.cellBlue,
            Style.alignItemsCenter,
          ]}>
          <CheckBox
            value={!!value}
            onValueChange={checked => this.onCheck(checked)}
          />
        </View>
      );
    }

    return (
      <View style={[columnStyle, isHighlight ? Style.cellHighLight : '']}>
        <Text style={Style.cellText}>{value}</Text>
      </View>
    );
  }
}

export default Cell;
