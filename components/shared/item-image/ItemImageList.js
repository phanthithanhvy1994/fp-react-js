import React from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import { styles } from './item-image.style';
import { noImage } from '../../../assets/images';

function ItemImageList(props) {
  const { itemData, informationList } = props;

  return <View style={styles.viewItemInfo}>
    <Image style={styles.image} source={itemData.url || noImage} />
    <View style={styles.viewInfo}>
      {informationList.map((info, index) => (
        <Text style={styles.textFont} key={index}>
          {info.label && `${info.label}: `}
          {(info.value && itemData[info.value]) || ''}
          {(info.customValue && info.customValue()) || ''}
        </Text>
      ))}
    </View>
    {informationList.map((info, index) => (
      <Text style={info.customQtyFieldStyle ? info.customQtyFieldStyle : styles.viewQty} key={index}>
        {(info.customQtyField && info.customQtyField()) || ''}
      </Text>
    ))}
  </View>;
}

export default ItemImageList;