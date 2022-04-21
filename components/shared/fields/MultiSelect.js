import React, { useState, useEffect } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon } from 'native-base';

import MasterButton from '../buttons/MasterButton';

import SelectBox from 'react-native-multi-selectbox';
import { xorBy } from 'lodash';
import { styles } from './MultiSelect.style';

function MultiSelect(props) {
  const { item, label, selectedValue } = props;

  let formatItem = item.map((items, index) => ({
    ...items,
    item: items.display,
    id: index,
  }));
  const [listItem] = useState(formatItem);
  const [selectedItem, setSelectedItem] = useState(selectedValue);
  const [modalVisible, setModalVisible] = useState(false);

  const onChange = () => {
    props.onChange(selectedItem);
    setModalVisible(!modalVisible);
  };

  const onClear = () => {
    setSelectedItem([]);
  };

  const onMultiChange = () => {
    return item => setSelectedItem(xorBy(selectedItem, [item], 'id'));
  };

  useEffect(() => {
    if (!selectedValue) {
      onClear();
    }
  }, [selectedValue]);

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.backView}>
              <TouchableOpacity onPress={() => onChange()}>
                <Text style={styles.primaryColor}>back to Filter</Text>
              </TouchableOpacity>
            </View>
            <SelectBox
              label={label}
              options={listItem}
              selectedValues={selectedItem}
              onMultiSelect={onMultiChange()}
              onTapClose={onMultiChange()}
              isMulti
              arrowIconColor={styles.arrowIcon.color}
              searchIconColor={styles.primaryColor.color}
              toggleIconColor={styles.primaryColor.color}
              multiOptionContainerStyle={{
                backgroundColor: styles.primaryColor.color,
              }}
              arrowIconColor={styles.arrowIcon.color}
            />
            <View style={styles.modalBottomView}>
              <MasterButton
                title="Clear"
                buttonStyle={styles.buttonClearStyle}
                titleStyle={styles.titleOutLineStyle}
                handleClick={() => onClear()}
              />
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.openButton}>
        <Button
          transparent
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Text style={styles.textStyle}>
            {selectedItem.length !== 0 ? `${selectedItem.length} selected` : ''}
          </Text>
          <Icon
            name="arrow-drop-down"
            type="MaterialIcons"
            style={styles.arrowIcon}
          />
        </Button>
      </View>
    </>
  );
}

export default MultiSelect;
