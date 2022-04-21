import { StyleSheet } from 'react-native';
import { defaultColor, borderStyle } from '../../../styles/theme/variables/platform';

export const styles = StyleSheet.create({
    assetTransferNoCtn: {
        paddingBottom: 16,
    },
    locationFld: {
        top: -18,
        marginBottom: -20,
    },
    viewItemInfo: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 13,
        backgroundColor: defaultColor.lightBlue,
    },
    assetTransferNo: {
        paddingBottom: 16,
        paddingLeft: 16,
        fontSize: 12,
    },
    assetTransferCatg: {
        color: defaultColor.primary,
    },
    itemInfoCtn: {
        backgroundColor: defaultColor.extraLightGray,
        marginBottom: 4,
        paddingLeft: 16,
        paddingRight: 16,
    },
    viewQty: {
        position: 'absolute',
        flexDirection: 'row',
        right: 16,
        width: 90,
        height: 22,
        backgroundColor: defaultColor.secondary,
        justifyContent: 'center',
        borderRadius: 10,
    },
    textQty: {
        color: defaultColor.white,
    },

    customQtyFieldStyle: {
        position: 'absolute',
        right: 16,
        flexDirection: 'column',
        justifyContent: 'center',
    },

    // bottom buton
    fullWidthBtn: {
        height: 36,
        backgroundColor: defaultColor.white,
        borderColor: borderStyle.borderColor,
        borderStyle: borderStyle.borderStyle,
        borderWidth: 1,
    },

    actionArea: {
        marginTop: -8,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    actionChildArea: {
        paddingBottom: 16,
        flex: 1,
    },

    cancelBtn: {
        height: 36,
        backgroundColor: defaultColor.white,
        borderColor: borderStyle.borderColor,
        borderStyle: borderStyle.borderStyle,
        borderWidth: 1,
    },
});
