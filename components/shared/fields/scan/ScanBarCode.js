import React from 'react';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import {Dimensions, TextInput} from 'react-native';

import {Item, Input, Button} from 'native-base';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import {
  FieldConstant,
  asyncStorageConst,
  ScreenSizeDevice,
} from '../../../../constants/constants';

import icoMoonConfig from '../../../../selection.json';
import {cellTableService} from '../../../../services/cellTableService';
import {styles} from './ScanBarCode.style';

const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);

class ScanBarCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: FieldConstant.scan.INIT,
      isHoneyWell: false,
      scanType: '',
    };
  }

  componentDidMount() {
    this.checkHoneyWell();

    // Fixbug: HONDAIPB-513
    this.subscription = cellTableService.onChangeEvent().subscribe(event => {
      const {isHoneyWell} = this.state;
      if (this.entryScanRef && isHoneyWell) {
        if (event === 'focusCell') {
          this.entryScanRef.blur();
        } else {
          this.entryScanRef.focus();
        }
      }
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  checkHoneyWell = async () => {
    let isHoneyWell = await AsyncStorage.getItem(asyncStorageConst.isHoneyWell);
    this.setState({isHoneyWell: isHoneyWell === 'true'});
  };

  handleOnChange = e => {
    // Get target data
    const {scanType} = e;
    this.props.onChange(e);
    // Get Type
    const {ENTRY_SCAN, INIT} = FieldConstant.scan;
    if (scanType === ENTRY_SCAN) {
      this.setState({status: INIT});
    } else {
      this.setState({status: scanType});
    }
  };

  handleHandheld = e => {
    // Get target data
    const {scanType} = e;
    this.setState({status: scanType});
    this.props.onChange(e);
    // Get Type
    const {QUICK_SCAN} = FieldConstant.scan;
    //
    if (scanType === QUICK_SCAN) {
      this.quickScanRef._root.focus();
    }
  };

  handleSwitchActive = (scanType, fieldName, navigation) => {
    this.setState({status: scanType, scanType: scanType});
    const {isHoneyWell} = this.state;
    // Workaround case detect HH & mobile
    if (!isHoneyWell) {
      // Navigate to BarCode screen
      navigation.navigate('CodeScan', {
        // This function callback onChange when goBack event active
        onGoBack: data =>
          this.handleOnChange({
            value: data,
            name: fieldName,
            scanType: scanType,
          }),
      });
    }
  };

  renderScan = (field, t, onChange, navigation, isPortTrait) => {
    // Get state
    const {status: active, scanType} = this.state;
    // Get field props
    const {iconName, placeHolderText, disabled, fieldName} = field;
    // Get styles props
    const {
      scanContainer,
      scan,
      scanActive,
      input,
      icon,
      button,
      quickScan,
      entryScan,
      flexWidth,
      quickScanEDA61K,
      entryScanEDA61K,
      inputEDA61K,
      alignContent,
    } = styles;
    const {QUICK_SCAN, ENTRY_SCAN} = FieldConstant.scan;
    const screenHeight = Dimensions.get('window').height;
    let screenDevice = false;
    if (screenHeight < ScreenSizeDevice.EDA61K) {
      screenDevice = true;
    }
    return (
      <Item style={[scanContainer, screenDevice ? '' : alignContent]}>
        <Item
          style={[
            scan,
            screenDevice
              ? quickScanEDA61K
              : isPortTrait
              ? quickScan
              : flexWidth,
          ]}>
          <Button
            onPress={() =>
              this.handleSwitchActive(QUICK_SCAN, fieldName, navigation)
            }
            style={[button, active === QUICK_SCAN ? scanActive : {}]}>
            <IcoMoon style={icon} name={iconName} />
          </Button>
          <Input
            placeholder={t(placeHolderText.QUICK_SCAN)}
            disabled={disabled}
            style={[
              screenDevice ? inputEDA61K : input,
              active === QUICK_SCAN ? scanActive : {},
            ]}
            placeholderTextColor={'black'}
            ref={inputQuick => {
              this.quickScanRef = inputQuick;
            }} // Handle keep focus
            value={''} // Alway display empty
            caretHidden={true} // Hide cursor
            showSoftInputOnFocus={false} // Hide keyboard onFocus
            onChangeText={value =>
              this.handleHandheld({
                value: value,
                name: fieldName,
                scanType: QUICK_SCAN,
              })
            }
            onFocus={() =>
              this.handleSwitchActive(QUICK_SCAN, fieldName, navigation)
            }
          />
        </Item>
        <Item
          style={[
            scan,
            screenDevice
              ? entryScanEDA61K
              : isPortTrait
              ? entryScan
              : flexWidth,
          ]}>
          <Button
            onPress={() =>
              this.handleSwitchActive(ENTRY_SCAN, fieldName, navigation)
            }
            style={[button, scanType === ENTRY_SCAN ? scanActive : {}]}>
            <IcoMoon style={icon} name={iconName} />
          </Button>
          <TextInput
            placeholder={t(placeHolderText.ENTRY_SCAN)}
            disabled={disabled}
            style={[
              screenDevice ? inputEDA61K : input,
              scanType === ENTRY_SCAN ? scanActive : {},
            ]}
            placeholderTextColor={'black'}
            ref={inputEntry => {
              this.entryScanRef = inputEntry;
            }}
            value={''}
            caretHidden={true}
            showSoftInputOnFocus={false}
            onChangeText={value =>
              this.handleHandheld({
                value: value,
                name: fieldName,
                scanType: ENTRY_SCAN,
              })
            }
            onFocus={() =>
              this.handleSwitchActive(ENTRY_SCAN, fieldName, navigation)
            }
          />
        </Item>
      </Item>
    );
  };

  render() {
    const {field, t, navigation, isPortTrait} = this.props;
    return (
      <>
        {this.renderScan(
          field,
          t,
          this.handleOnChange,
          navigation,
          isPortTrait,
        )}
      </>
    );
  }
}

ScanBarCode.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  t: PropTypes.func,
  navigation: PropTypes.object.isRequired,
  isPortTrait: PropTypes.bool,
};

export default withTranslation()(ScanBarCode);
