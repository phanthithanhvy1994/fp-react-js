import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import Field from '../../../shared/fields/field';

import {noImage} from '../../../../assets/images';
import {styles} from './CustomSecondStep.style';
import isEmpty from 'lodash/isEmpty';
import {GRConstant} from '../../../../constants/constants';
const CustomRowSecondStep = ({
  itemData,
  onChanges,
  isEditPage,
  isBranchPOType,
  deliveryTypeData,
  sndField,
}) => {
  let isReceived =
    typeof itemData.isReceived === 'boolean'
      ? itemData.isReceived
      : itemData.isReceived === 1
      ? true
      : false;
  const [labelQty, setLabelQty] = useState(
    itemData.deliveredQty ? itemData.deliveredQty : itemData.quantity,
  );
  const [data, setData] = useState({...itemData, isReceived: isReceived});

  const clearQuantity = isEditPage
    ? isBranchPOType
      ? 'quantity'
      : 'adjQty'
    : 'qty';

  let sndFld = sndField(
    itemData.id,
    data,
    isBranchPOType,
    isEditPage,
    deliveryTypeData,
  );

  useEffect(() => {
    onChanges(data);
  }, [data]);

  const toggleSwitch = (value, name) => {
    setData({...data, [clearQuantity]: '0', deliveryType: '', [name]: value});
  };

  const checkReceive = (value, name) => {
    let condition = (name === 'qty' || 'quantity') && value > 0;
    if (!isBranchPOType) {
      condition = condition && !isEmpty(data.deliveryType);
    }
    if (condition) {
      setData({...data, isReceived: true, [name]: value});
    } else {
      setData({...data, [name]: value});
    }
  };

  const onValueChange = e => {
    const {value, name} = e.target;
    let checkValue = value;
    if (
      name === clearQuantity &&
      +value > (+itemData.quantity || +labelQty) &&
      (isBranchPOType ||
        +itemData.deliveryType === +GRConstant.deliveryType.underDelivery)
    ) {
      checkValue = '' + labelQty;
    }
    if (name === 'deliveryType') {
      setData({...data, [name]: value, [clearQuantity]: '0'});
      return;
    }

    if (name === 'isReceived' && !value) {
      toggleSwitch(value, name);
      return;
    } else {
      checkReceive(checkValue, name);
    }
  };

  const renderCustomField = sndFld => {
    return <Field conditionalArray={sndFld} onChange={e => onValueChange(e)} />;
  };

  return (
    <View key={itemData.id} style={styles.rowContainer}>
      <View style={styles.container}>
        <Image source={noImage} style={styles.photo} />
        <View style={styles.container_text}>
          <View style={styles.materialField}>
            <View style={styles.materialCode}>
              <Text style={styles.title}>Code: {itemData.sku}</Text>
            </View>
            {!isBranchPOType ? (
              <View style={styles.branchCode}>
                <Text style={styles.title}>
                  {itemData.batchNo ? `<${itemData.batchNo}>` : '<Batch No.>'}
                </Text>
              </View>
            ) : null}
          </View>
          <View>
            <Text style={styles.title}>{itemData.description}</Text>
            <View style={styles.materialField}>
              <View style={styles.unitLabel}>
                <Text style={styles.title}>
                  Order Unit: {itemData.orderUnit}
                </Text>
                <Text style={styles.titleQuantity}>{labelQty}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.fieldReceivedBottom}>
        {renderCustomField(sndFld)}
      </View>
    </View>
  );
};

export default CustomRowSecondStep;
