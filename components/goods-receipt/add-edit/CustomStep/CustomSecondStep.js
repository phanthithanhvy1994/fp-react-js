import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import CustomRowSecondStep from './CustomRowSecondStep';
import {styles} from './CustomSecondStep.style';

const CustomSecondStep = ({
  dataEdit,
  deliveryTypeData,
  getDataForStep2,
  isBranchPOType,
  isEditPage,
  sndField,
}) => {
  const [dataDetail, setDataDetail] = useState(dataEdit);
  const onChangeData = data => {
    let newArr = dataDetail && dataDetail.goodsReceiptItemVOS;
    newArr.forEach((element, index) => {
      if (element.itemVO.id === data.id) {
        newArr[index] = {itemVO: data};
      }
    });
    getDataForStep2(newArr);
  };

  if (JSON.stringify(dataDetail) !== JSON.stringify(dataEdit)) {
    setDataDetail(dataEdit);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dataDetail.goodsReceiptItemVOS}
        renderItem={({item, index}) => (
          <CustomRowSecondStep
            itemData={item.itemVO}
            onChanges={onChangeData}
            isEditPage={isEditPage}
            isBranchPOType={isBranchPOType}
            deliveryTypeData={deliveryTypeData}
            sndField={sndField}
          />
        )}
        keyExtractor={(item, i) => i.toString()}
      />
    </View>
  );
};

export default CustomSecondStep;
