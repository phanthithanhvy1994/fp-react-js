import { StyleSheet } from 'react-native';
import { defaultColor } from '../../../styles/theme/variables/platform';


export const styles = StyleSheet.create({
  textStatus: {
    width: 90,
    height: 16,
    borderRadius: 200,
    textAlign: 'center',
    alignContent: 'center',
    flex: 1,
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 10,
  },

  textFailed: {
    backgroundColor: defaultColor.error,
    color: defaultColor.white,
  },
  textDraft: {
    backgroundColor: defaultColor.secondary,
    color: defaultColor.white,
  },
  textCompleted: {
    color: defaultColor.primary,
    borderColor: defaultColor.primary,
    borderWidth: 1,
  },
  textSubmitted: {
    color: defaultColor.white,
    backgroundColor: defaultColor.primary,
  },
  textInTransit: {
    color: defaultColor.secondary,
    borderColor: defaultColor.secondary,
    borderWidth: 1,
  },
  textCancelled: {
    color: defaultColor.white,
    backgroundColor: defaultColor.lightGray,
  },

  textConfirmed: {
    color: defaultColor.white,
    backgroundColor: defaultColor.primary,
  },

  textUnConfirmed: {
    color: defaultColor.white,
    backgroundColor: defaultColor.lightGray,
  },

  contentQuantity: {
    flex: 1,
    flexDirection: 'row',
  },

  textQuantity: {
    width: 190,
  },

  textDeliveredQty: {
    justifyContent: 'flex-end',
    textAlign: 'center',
  },
  textItemQuantity: {
    fontSize: 16,
  },

  assetTransferNoContent: {
    // marginTop: 20
  },

  mappingContent: {
    marginBottom: 30,
    paddingLeft:16,
    paddingRight:16,
    backgroundColor: '#F9F9F9',
    paddingBottom:10
  },

  textAssetTransfer: {
    fontSize: 12,
    marginLeft: 16,
    marginBottom: 10
  },

  assetTransferBranchContent: {
    // fontSize: 16,
    height: 30,
    backgroundColor: '#D8EEEE',
    borderRadius: 0,
    justifyContent: 'center',
    paddingLeft: 16,
  },

  textAssetTransferBranch: {
    color: '#0D9499',
    fontSize: 12,
    fontWeight: 'bold',
  },

});
