import {StyleSheet} from 'react-native';
import {defaultColor} from '../../../styles/theme/variables/platform';
export const styles = StyleSheet.create({
    mainField: {
        margin: 16,
        marginBottom: 0
    },
    searchField: {
        marginLeft: -4,
        marginRight: -4,
    },
    dateSelected: {

    },
    textFont: {
        fontSize: 13,
        color: defaultColor.text,
    },
    viewItem: {
      backgroundColor: defaultColor.extraLightGray,
      marginLeft: 8,
      marginRight: 8,
      marginTop: -8,
    },
    viewItemInfo: {
      marginLeft: 24,
      marginRight: 24,
      marginTop: 8,
      marginBottom: 8,
      flexDirection: 'row',
    },
    image: {
      marginRight: 8,
      width: 90,
      height: 90,
    },
    viewQty: {
      position: 'absolute',
      right: 0,
      top: 24,
    },
    rowAsset: {
      paddingBottom: 8
    }
});