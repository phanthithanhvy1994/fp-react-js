import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  Form,
  Item,
  Input,
  Label,
  Picker,
  Icon,
  Button,
  View,
  CheckBox,
  Text,
  Switch,
} from 'native-base';
import { TouchableOpacity } from 'react-native';
// import analytics, {firebase} from '@react-native-firebasefirebase/analytics';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import Password from './login/Password';
import ScanBarCode from './scan/ScanBarCode';
import MultiSelect from './MultiSelect';

import {
  FieldConstant,
  fieldRecipient,
  asyncStorageConst,
  NumberConstant,
  format,
} from '../../../constants/constants';
import icoMoonConfig from '../../../selection.json';
import DatePicker from './DatePicker';
import UploadImage from '../upload-image/UploadImage';
import { styles, configToggle } from './Field.style';

const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHoneyWell: 'false',
      isChecked: false,
    };
  }

  getDeviceInfo = async () => {
    // Get device info
    let isHoneyWell = await AsyncStorage.getItem(asyncStorageConst.isHoneyWell);
    this.setState({ isHoneyWell: isHoneyWell });
  };

  componentDidMount() {
    this.getDeviceInfo();
  }

  renderFieldType = (field, index) => {
    // Get props
    const { t, onChange, onSubmitEditing, navigation, isPortTrait } = this.props;
    // Field props
    // fieldType(TEXT, NUMBER, TEXT_AREA, PICKER: Date time, SELECT)
    // label(string)
    // iconName(string) name of icon
    // style(obj) styling
    // placeHolder(string)
    // disabled(boolean)
    // multiline(boolean) -> Text Area
    // numberOfLines(number) -> Text Area line
    // keyBoardType(string)
    switch (field.fieldType) {
      case FieldConstant.type.TEXT:
        return this.renderTextFields(field, t, onChange, isPortTrait);
      case FieldConstant.type.UPLOAD_IMAGE:
        return this.renderUploadImages(field, index);
      case FieldConstant.type.PICKER:
        return this.renderDatePickers(field, t, onChange);
      case FieldConstant.type.DATE_FROM_TO:
        return this.renderDateFromTo(field, t, onChange, isPortTrait);
      case FieldConstant.type.SELECT:
        return this.renderSelects(field, t, onChange, isPortTrait);
      case FieldConstant.type.RECIPIENT:
        return this.renderRecipients(
          field,
          t,
          onChange,
          onSubmitEditing,
          navigation,
          isPortTrait,
        );
      case FieldConstant.type.SCAN:
        return this.renderScan(field, onChange, navigation, isPortTrait);
      case FieldConstant.type.PASSWORD:
        return this.renderPassword(field, onChange, onSubmitEditing);
      case FieldConstant.type.CHECKBOX:
        return this.renderCheckbox(field, t, isPortTrait, onChange);
      case FieldConstant.type.MULTI_SELECT:
        return this.renderMultiSelects(field, t, onChange, isPortTrait);
      case FieldConstant.type.TEXT_ONLY:
        return this.renderTextOnlyFields(field, t, onChange);
      case FieldConstant.type.QUANTITY:
        return this.renderQtyFields(field, t, onChange, index);
      case FieldConstant.type.RECEIVED:
        return this.renderReceivedFields(field, onChange, index);
      default:
        return this.renderTextFields(field, t);
    }
  };

  renderTextFields = (field, t, onChange, isPortTrait) => {
    // Get field props
    const {
      id,
      label,
      value,
      iconName,
      fieldName,
      placeHolderText,
      disabled,
      multiline,
      hasButton,
      btnOnPress,
      btnIconName,
      numberOfLines,
      keyboardType,
      customStyle,
      maxLength,
      require,
      isIcoMoon,
      hidden,
      isFontAwesome,
      styleName,
    } = field;
    const { errors } = this.props;
    // Allow customize Text field style
    const style = customStyle === undefined ? styles : customStyle;
    // Get styles props
    const {
      fieldContainer,
      fieldItem,
      labelContainer,
      iconItem,
      button,
      icon,
      input,
      placeholderStyle,
    } = style;
    return !hidden ? (
      <Item
        key={id}
        style={[
          fieldContainer,
          isPortTrait ? style.flexWidth : style.autoWidth,
          styleName ? style[styleName] : '',
        ]}
        stackedLabel>
        {label && (
          <Item style={labelContainer}>
            <Label style={styles.labelText}>{t(label)}</Label>
            {require && <Label style={styles.require}>*</Label>}
          </Item>
        )}
        <Item
          style={[fieldItem, disabled ? style.disableField : style.activeField]}
          regular>
          {isIcoMoon ? (
            <IcoMoon
              name={iconName}
              style={iconItem}
              size={styles.iconSize.width}
            />
          ) : (
            iconName && <Icon name={iconName} style={iconItem} />
          )}
          <Input
            placeholder={t(placeHolderText)}
            keyboardType={keyboardType}
            disabled={disabled}
            multiline={multiline}
            numberOfLines={numberOfLines}
            value={(value && `${value}`) || ''}
            maxLength={maxLength}
            onChangeText={text =>
              onChange({ target: { value: text, name: fieldName } })
            }
            style={[input, styles.input]}
            placeholderTextColor={placeHolderText && placeholderStyle}
          />

          {hasButton && (
            <Button style={button} onPress={btnOnPress}>
              <Icon
                name={btnIconName || 'search'}
                style={icon}
                type={isFontAwesome ? 'FontAwesome' : ''}
              />
            </Button>
          )}
        </Item>
        {errors && errors[fieldName] && (
          <Item style={labelContainer}>
            <Label style={[styles.labelText, styles.errorText]}>
              {errors[fieldName]}
            </Label>
          </Item>
        )}
      </Item>
    ) : null;
  };

  renderUploadImages = (field, index) => {
    const { onChange } = this.props;
    return (
      <View key={index}>
        <UploadImage config={field} onChange={onChange} />
      </View>
    );
  };

  renderDatePickers = (field, t, onChange) => {
    // Get field props
    const { id, label, iconName, fieldName, placeHolderText, disabled } = field;
    // Get styles props
    const { fieldContainer, fieldItem, labelContainer } = styles;
    const { errors } = this.props;

    return (
      <Item key={id} style={fieldContainer} stackedLabel>
        <Item style={labelContainer}>
          <Label>{t(label)}</Label>
        </Item>
        <Item style={fieldItem} regular>
          <DatePicker
            locale={'en'}
            animationType={'fade'}
            androidMode={'calendar'}
            placeHolderText={t(placeHolderText)}
            onDateChange={date =>
              onChange({ target: { value: date, name: fieldName } })
            }
            timeZoneOffsetInMinutes={undefined}
            disabled={disabled}
          />
          <Icon name={iconName || 'ios-calendar'} />
        </Item>
        {errors && errors[fieldName] && (
          <Item style={labelContainer}>
            <Label style={[styles.labelText, styles.errorText]}>
              {errors[fieldName]}
            </Label>
          </Item>
        )}
      </Item>
    );
  };

  renderSelects = (field, t, onChange, isPortTrait) => {
    // Get field props
    const {
      id,
      label,
      value,
      iconName,
      fieldName,
      customStyle,
      defaultBlank,
      require,
      disabled,
    } = field;
    const { errors } = this.props;
    let fieldData = field.data;
    if (defaultBlank) {
      // Default blank options
      fieldData = [{ display: '', value: '' }, ...field.data];
    }
    // Allow customize Selects field style
    const style = customStyle === undefined ? styles : customStyle;

    // Get styles props
    const {
      customView,
      fieldContainer,
      selectedItem,
      labelContainer,
      errorsLabelContainer,
      disabledOpacity,
    } = style;

    return (
      !field.hidden && (
        <View key={id} style={customView}>
          <View
            key={id}
            style={[
              fieldContainer,
              isPortTrait ? styles.flexWidth : styles.autoWidth,
            ]}
            stackedLabel>
            <Item style={[labelContainer]}>
              <Label style={[styles.labelText, disabled && styles.disabledOpacity]}>{t(label)}</Label>
              {require && <Label style={[styles.require, disabled && styles.disabledOpacity]}>*</Label>}
            </Item>
            <View
              style={[
                selectedItem,
                styles.picker,
                disabled ? style.disableField : style.activeField,
              ]}>
              <Picker
                enabled={!disabled}
                mode="dropdown"
                iosIcon={<Icon name={iconName} />}
                selectedValue={`${value}`}
                onValueChange={val => {
                  onChange({ target: { value: val, name: fieldName } });
                }}>
                {/* Generate item */}
                {fieldData.map((item, i) => (
                  <Picker.Item
                    key={i}
                    color={styles.pickerItem.color}
                    label={item.display}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>
            {errors && errors[fieldName] && (
              <Item style={errorsLabelContainer}>
                <Label style={[styles.labelText, styles.errorText]}>
                  {errors[fieldName]}
                </Label>
              </Item>
            )}
          </View>
        </View>
      )
    );
  };

  renderRecipients = (field, t, onChange, onSubmitEditing, navigation) => {
    // Get field props
    const {
      id,
      value,
      iconName,
      placeHolderText,
      disabled,
      fieldName,
      fieldNameError,
      customStyle,
      label,
      hasAddIcon,
      onClickAddIcon,
      listAddedData,
      childAddedItemList,
      removeChildItem,
      maxLength,
      keyboardType,
      isAssetTransTransferTracking // True: Hidden text box Asset Transfer No
    } = field;
    // Get styles props
    // Allow customize Recipients field style
    const style = customStyle === undefined ? styles : customStyle;
    // Get styles props
    const {
      fieldContainer,
      recipientInput,
      icon,
      button,
      labelContainer,
      fieldItem,
      sizeIcon,
      scanStyle,
      addedFieldItemList,
      addBtn,
    } = style;
    const { errors } = this.props;

    return (
      !field.hidden && (
        <Item key={id} style={fieldContainer} stackedLabel>
          {label && (
            <Item style={labelContainer}>
              <Label style={styles.labelText}>{t(label)}</Label>
              <Label style={styles.require}>*</Label>
            </Item>
          )}
          {!isAssetTransTransferTracking &&
            <Item style={[style.wrapperRecipientAddIcon]}>
              <Item
                style={[
                  fieldItem,
                  disabled ? style.disableField : style.activeField,
                  hasAddIcon ? style.wrapperRecipientInput : '',
                ]}>
                <Input
                  placeholder={t(placeHolderText)}
                  disabled={disabled}
                  value={value || ''}
                  textStyle={styles.inputText}
                  style={recipientInput}
                  maxLength={maxLength || fieldRecipient.maxLength}
                  onChangeText={text =>
                    onChange({ target: { value: text, name: fieldName } })
                  }
                  onSubmitEditing={onSubmitEditing}
                  placeholderTextColor={placeHolderText && scanStyle.color}
                  keyboardType={keyboardType}
                />
                <Button
                  style={[
                    button,
                    disabled ? style.disableField : style.activeField,
                  ]}
                  onPress={() => {
                    if (this.state.isHoneyWell === 'false' && !disabled) {
                      // Navigate to BarCode screen
                      navigation.navigate('CodeScan', {
                        // This function callback onChange when goBack event active
                        onGoBack: data =>
                          onChange({
                            target: {
                              value: data,
                              name: fieldName,
                              fldName: 'codeScan',
                            },
                          }),
                      });
                    }
                  }}>
                  <IcoMoon style={icon} name={iconName} size={sizeIcon} />
                </Button>
              </Item>
              {!isAssetTransTransferTracking && hasAddIcon && (
                <Button style={[button, addBtn]} onPress={onClickAddIcon}>
                  <Icon
                    name={'plus'}
                    type="FontAwesome5"
                    style={[icon, style.iconAdd, style.childIcon]}
                    size={sizeIcon}
                  />
                </Button>
              )}
            </Item>
          }

          {errors && errors[fieldNameError || fieldName] && (
            <Item style={labelContainer}>
              <Label style={[styles.labelText, styles.errorText]}>
                {errors[fieldNameError || fieldName]}
              </Label>
            </Item>
          )}

          {hasAddIcon &&
            listAddedData &&
            listAddedData.length > 0 &&
            listAddedData.map((value, index) => (
              <Item key={index} style={[style.activeField, addedFieldItemList]}>
                {this.renderFieldType(
                  {
                    ...childAddedItemList,
                    value,
                  },
                  index,
                )}
                {!isAssetTransTransferTracking &&
                  <Button
                    style={[button, addBtn, style.actionChildBtn]}
                    onPress={() => removeChildItem(value, index)}>
                    <Icon
                      name={'minus'}
                      type="FontAwesome5"
                      style={[icon, style.iconAdd, style.childIcon]}
                      size={sizeIcon}
                    />
                  </Button>
                }

              </Item>
            ))}
        </Item>
      )
    );
  };

  renderScan = (field, onChange, navigation, isPortTrait) => {
    return (
      <ScanBarCode
        key={field.id}
        field={field}
        onChange={onChange}
        navigation={navigation}
        isPortTrait={isPortTrait}
      />
    );
  };

  renderDateFromTo = (field, t, onChange, isPortTrait) => {
    let { from, to, labelName, disabled } = field;
    const date = new Date();

    // [#HONDAIPB-CR] - 20/06/2020 - The Honda IT wants to change the defaults:
    // FromDate = Current Date -30 days
    // ToDate = Current Date
    //[#HONDAIPB-FIXBUG] - 28/092020 - Log date value to trace problem [start]
    // firebase.analytics().logEvent('initial_filter_date', {
    //   ini_from_date: from.value,
    //   ini_to_date: to.value,
    // });
    if (to.value) {
      to.value = new Date(to.value);
    } else {
      if (to.defaultBlank) {
        to.value = null;
      } else {
        //to.value = date.setDate(date.getDate());
        to.value = new Date(date.setDate(date.getDate()));
      }
    }

    if (from.value) {
      from.value = new Date(from.value);
    } else {
      if (from.defaultBlank) {
        from.value = null;
      } else {
        //from.value = date.setDate(date.getDate() - 30);
        from.value = new Date(moment().subtract(1, 'months'));
      }
    }

    if (from.value >= to.value) {
      to.value = from.value;
    }


    // firebase.analytics().logEvent('gen_filter_date', {
    //   gen_from_date: from.value.toISOString(),
    //   gen_to_date: to.value.toISOString(),
    // });

    // Use to refresh date time
    if (this.dateFrom && this.dateFrom[from.fieldName]) {
      this.dateFrom[from.fieldName].state.chosenDate = from.value;
    }

    if (this.dateTo && this.dateTo[to.fieldName]) {
      this.dateTo[to.fieldName].state.chosenDate = to.value;
    }

    if (!this.dateFrom) {
      this.dateFrom = [];
    }
    if (!this.dateTo) {
      this.dateTo = [];
    }

    // firebase.analytics().logEvent('format_filter_date', {
    //   fmt_from_date: moment(from.value).format('DD/MM/YYYY'),
    //   fmt_to_date: moment(to.value).format('DD/MM/YYYY'),
    // });
    //[#HONDAIPB-FIXBUG] - 28/092020 - Log date value to trace problem [end]
    const {
      fieldContainer,
      labelContainer,
      dateContainer,
      dateItem,
      element,
      labelTo,
      dateIconSize,
      disableField,
    } = styles;

    return (
      !field.hidden && (
        <Item
          key={field.id}
          style={[
            fieldContainer,
            element,
            isPortTrait ? styles.flexWidth : '',
          ]}>
          <Item key={from.id} style={dateContainer} stackedLabel>
            <Item style={[labelContainer, styles.labelDate]}>
              <Label style={styles.labelText}>{t(labelName)}</Label>
              {require && <Label style={styles.require}>*</Label>}
            </Item>
            <Item
              style={[dateItem, disabled && disableField]}
              regular
              disabled={disabled}
              onPress={() => this.dateFrom[from.fieldName].showDatepicker()}>
              <Label style={styles.labelDate}>
                {from.value ? moment(from.value).format('DD/MM/YYYY') : ''}
              </Label>
              <DatePicker
                ref={ref => (this.dateFrom[from.fieldName] = ref)}
                onDateChange={dateDay => {
                  onChange({
                    target: {
                      value: dateDay,
                      name: from.fieldName,
                    },
                  });
                }}
                value={from.value}
                maximumDate={to.value}
              />
              <IcoMoon
                style={styles.dateIcon}
                size={dateIconSize.width}
                name={from.iconName || 'icon-calendar'}
              />
            </Item>
          </Item>
          <Text style={labelTo}>to</Text>
          <Item key={to.id} style={dateContainer} stackedLabel>
            <Item style={[labelContainer, styles.labelDate]} />
            <Item
              style={[dateItem, disabled && disableField]}
              regular
              disabled={disabled}
              onPress={() => this.dateTo[to.fieldName].showDatepicker()}>
              <Label style={styles.labelDate}>
                {to.value ? moment(to.value).format('DD/MM/YYYY') : ''}
              </Label>
              <DatePicker
                ref={ref => (this.dateTo[to.fieldName] = ref)}
                onDateChange={dateDay => {
                  onChange({
                    target: {
                      value: dateDay,
                      name: to.fieldName,
                    },
                  });
                }}
                value={to.value}
                minimumDate={from.value}
              />
              <IcoMoon
                style={styles.dateIcon}
                size={dateIconSize.width}
                name={from.iconName || 'icon-calendar'}
              />
            </Item>
          </Item>
        </Item>
      )
    );
  };

  renderPassword = (field, onChange, onSubmitEditing) => {
    return (
      <Password
        key={field.id}
        field={field}
        onChange={onChange}
        onSubmitEditing={onSubmitEditing}
      />
    );
  };

  renderMultiSelects = (field, t, onChange) => {
    let fieldData = field.data;
    const { id, label, customStyle, require, value } = field;
    // Allow customize Selects field style
    const style = customStyle === undefined ? styles : customStyle;
    const { errors } = this.props;

    // Get styles props
    const { fieldContainer, selectedItem, labelContainer } = style;
    return (
      <Item key={id} stackedLabel style={fieldContainer}>
        <Item style={labelContainer}>
          <Label style={styles.labelText}>{t(label)}</Label>
          {require && <Label style={styles.require}>*</Label>}
        </Item>
        <Item style={selectedItem}>
          <MultiSelect
            label={label}
            item={fieldData}
            selectedValue={value}
            onChange={value =>
              onChange({
                target: {
                  value,
                  name: field.fieldName,
                  customOnChange: field.customOnChange,
                },
              })
            }
          />
        </Item>
        {errors && errors[fieldName] && (
          <Item style={labelContainer}>
            <Label style={[styles.labelText, styles.errorText]}>
              {errors[fieldName]}
            </Label>
          </Item>
        )}
      </Item>
    );
  };

  renderCheckbox = (field, t, isPortTrait, onChange) => {
    const { id, label, value, fieldName } = field;

    return (
      <Item
        key={id}
        style={[styles.fieldCheckbox, isPortTrait ? styles.fieldPadding : '']}
        stackedLabel>
        <Item
          style={styles.itemCheckbox}
          onPress={() => onChange({ target: { value: !value, name: fieldName } })}>
          <CheckBox style={styles.checkbox} checked={value} />
          <Label style={styles.labelCheckbox}>{t(label)}</Label>
        </Item>
      </Item>
    );
  };

  renderTextOnlyFields = (field, t) => {
    const { label, value, display, id, customStyle } = field;
    // Allow customize Selects field style
    const style = customStyle === undefined ? styles : customStyle;

    // Get styles props
    const { textContainer } = style;
    return (
      <Item stackedLabel style={textContainer} key={id}>
        <Label style={styles.labelTextOnly}>
          {t(label)}: {display ? display : value}
        </Label>
      </Item>
    );
  };
  render() {
    const { conditionalArray, isPortTrait } = this.props;
    return (
      <Form style={[isPortTrait ? styles.flexGird : styles.gird]}>
        {conditionalArray.map((field, index) =>
          this.renderFieldType(field, index),
        )}
      </Form>
    );
  }

  renderQtyFields = (item, classes, onChange, index) => {
    const {
      customStyle,
      value,
      maximumValue,
      minimumValue,
      increaseInValue,
      disabled,
      defaultValue,
      maxLength,
      isBranchPOType,
      fieldName,
      errors,
      hidden
    } = item;
    // Allow customize Selects field style
    const style = customStyle === undefined ? styles : customStyle;

    let minimum = minimumValue || NumberConstant.minimumValue;
    let maximum = maximumValue || NumberConstant.maximumValue;
    // Get styles props
    const { fldQty, customQuantityView, fieldContainer } = style;

    let checkValue = value;

    if (+checkValue > +defaultValue && isBranchPOType) {
      checkValue = defaultValue;
    }

    return (
      !hidden && (<View key={index} style={customQuantityView} stackedLabel>
        <View style={fieldContainer}>
          <Item
            style={[fldQty, disabled ? style.disableField : style.activeField]}
            error={!!errors}>
            <Button
              style={styles.btnQuantity}
              primary
              disabled={disabled}
              onPress={() => {
                let tempValue = +checkValue;
                // If value is decimal, apply this rule when decreasing:
                // Ex: 11.25 => 11   11.99 => 11   11 => 10
                if (+checkValue % 1 !== 0) {
                  tempValue = Math.trunc(tempValue);
                } else {
                  increaseInValue
                    ? (tempValue -= increaseInValue)
                    : (tempValue -= 1);
                }
                if (minimum !== undefined && tempValue < minimum) {
                  return;
                } else {
                  if (!disabled) {
                    onChange({
                      target: {
                        value: tempValue,
                        name: fieldName,
                      },
                    });
                  }
                }
              }}>
              <Icon style={styles.qtyIcon} name="md-remove" />
            </Button>
            <Input
              style={[
                styles.quantityField,
                disabled && styles.quantityFieldDisabled,
              ]}
              disabled={disabled}
              maxLength={maxLength}
              keyboardType={'numeric'}
              value={checkValue || ''}
              onChangeText={checkValue =>
                onChange({
                  target: {
                    value: checkValue,
                    name: fieldName,
                  },
                })
              }
            />
            <Button
              style={styles.btnQuantity}
              primary
              disabled={disabled}
              onPress={() => {
                let tempValue = +checkValue;

                // If value is decimal, increase follow this rule:
                // Ex: 11 => 12,   11.25 => 12,   11.99 => 12
                if (+checkValue % 1 !== 0) {
                  tempValue = Math.ceil(+value);
                } else {
                  increaseInValue
                    ? (tempValue += increaseInValue)
                    : (tempValue += 1);
                }

                if (maximum !== undefined && tempValue > maximum) {
                  return;
                } else {
                  if (!disabled) {
                    onChange({
                      target: {
                        value: tempValue,
                        name: fieldName,
                      },
                    });
                  }
                }
              }}>
              <Icon style={styles.qtyIcon} name="md-add" />
            </Button>
          </Item>
        </View>
      </View>
      ));
  };

  renderReceivedFields = (item, onChange, index) => {
    const { value, fieldName } = item;
    return (
      <View key={index}>
        <View style={styles.receivedField}>
          <Switch
            style={styles.transForm}
            trackColor={{
              false: configToggle.trackColorFalse,
              true: configToggle.trackColorTrue,
            }}
            thumbColor={configToggle.defaultWhileColor}
            onValueChange={checkValue =>
              onChange({
                target: {
                  value: checkValue,
                  name: fieldName,
                },
              })
            }
            value={value}
          />
          <Text style={styles.received}>{item.label ? item.label : 'Received'}</Text>
        </View>
      </View>
    );
  };
}

Field.propTypes = {
  conditionalArray: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  t: PropTypes.func,
  navigation: PropTypes.any,
  isPortTrait: PropTypes.bool,
};

export default withTranslation()(Field);
