import { FieldConstant } from '../../../../constants/constants';
import { styles } from '../AssetTransferAddEdit.style';
import { ATConstant} from '../../../../constants/constants';

export const fieldsArray = (data, listComboboxData, typeChange, isShowLabelQty, branchCodeTo) =>{
  const dataMaster = data.item;
  const isAssetRequest = typeChange === ATConstant.typeValue.fromAR;
  const isUtensil = dataMaster.assetCategory === ATConstant.assetCategory.Utensil;
  const isHideLocation = isUtensil && typeChange === ATConstant.typeValue.returnPermanent||
    isUtensil && typeChange === ATConstant.typeValue.returnStripDown || 
    typeChange === ATConstant.typeValue.assetLendingReturn||
    typeChange === ATConstant.typeValue.branchOpening;
  const plant = (typeChange === ATConstant.typeValue.fromAR
      || typeChange === ATConstant.typeValue.location) ? branchCodeTo : dataMaster.plant;
  return[{
    id: 'quantity',
    fieldName: 'quantity',
    fieldType: FieldConstant.type.QUANTITY,
    value: String(dataMaster.quantity) || '0',
    minimumValue: '0',
    customStyle: styles,
    maxLength: 4,
    hidden: isShowLabelQty, //iShowLocation
  },
  {
    id: 'location',
    fieldName: 'assetLocationCode',
    fieldType: FieldConstant.type.SELECT,
    value:  (!isHideLocation && dataMaster && dataMaster.assetLocationCode) || '',
    data: (plant && listComboboxData && listComboboxData[plant]) || [],
    hidden:  isHideLocation,
    defaultBlank: true
  },
]};