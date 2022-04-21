import {StyleSheet} from 'react-native';
import {defaultColor} from '../../../styles/theme/variables/platform';

export const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    quantityLabel: {
        fontSize: 16
    },
    headerItem: {
        marginLeft: 16,
        marginRight: 16,
    },
    viewBranch: {
        height: 30,
        backgroundColor: '#D8EEEE'
    },
    textBranch: {
        fontWeight: 'bold',
        lineHeight: 30,
        color: '#0D9499'
    },
    textAssetTransfer: {
        lineHeight: 30,
    },
    lineItem: {
        marginBottom: 8,
        backgroundColor: defaultColor.extraLightGray,
    },
    assetItem: {
        paddingLeft: 16,
        paddingRight: 16,
    }
});
