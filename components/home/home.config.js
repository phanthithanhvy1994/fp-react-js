import {
  goodsReceipt, 
  assetTransfer, 
  assetTransferTracking
} from '../../assets/images';

export const listItems = [
  {
    title: 'Goods Receipt Management',
    screen: 'GoodsReceiptList',
    icon: goodsReceipt,
  },
  {
    title: 'Asset Transfer Management',
    screen: 'AssetTransferList',
    icon: assetTransfer,
  },
  {
    title: 'Asset Transfer Tracking Management',
    screen: 'AssetTransferTrackingList',
    icon: assetTransferTracking,
  },
  {
    title: 'Asset Receipt List',
    screen: 'AssetReceiptList',
    icon: assetTransferTracking,
  },
];

export const numColumns = 3;
