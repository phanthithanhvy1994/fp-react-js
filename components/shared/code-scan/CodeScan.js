import React, {Component} from 'react';
import {View, Text, Dimensions} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import getStyles from '../../../styles/code-scan';
import {withTranslation} from 'react-i18next';
// import {Button} from 'native-base';
class CodeScan extends Component {
  constructor(props) {
    super(props);
    this.state = {styles: {}};
  }

  onSuccess(e) {
    this.props.navigation.state.params.onGoBack(e.data);
    this.props.navigation.goBack();
  }

  componentDidMount() {
    this.detectPortrait();
    Dimensions.addEventListener('change', this.detectPortrait);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.detectPortrait);
  }

  detectPortrait = data => {
    let screenWidth = '',
      screenHeight = '';
    if (!data) {
      screenWidth = Dimensions.get('window').width;
      screenHeight = Dimensions.get('window').height;
    } else {
      screenWidth = data.window.width;
      screenHeight = data.window.height;
    }

    const isPortTrait = screenHeight < screenWidth;
    const styles = getStyles(screenHeight, screenWidth, isPortTrait);
    this.setState({styles});
  };

  render() {
    const {styles} = this.state;
    const {t} = this.props;
    return (
      <View style={styles.rectangleContainer}>
        <View style={styles.topOverlay} />
        <View style={styles.rectangleCover}>
          <View style={styles.leftAndRightOverlay} />
          <View style={styles.rectangle}>
            <QRCodeScanner
              // showMarker
              onRead={this.onSuccess.bind(this)}
              cameraStyle={styles.cameraStyle}
              cameraProps={{ratio: '1:1'}}
            />
          </View>
          <View style={styles.leftAndRightOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Text style={styles.text}>
            {t('Code/Barcode inside the viewfinder rectangle to scan it.')}
          </Text>
        </View>
      </View>
    );
  }
}

export default withTranslation()(CodeScan);
