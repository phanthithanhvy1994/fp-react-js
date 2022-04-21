import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Grid, Row } from 'react-native-easy-grid';

import { Icon, Content, Container } from 'native-base';
import { Text, View, Modal, TouchableOpacity } from 'react-native';

import Field from '../fields/field';
import MasterButton from '../buttons/MasterButton';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import { buttonConstant } from '../../../constants/constants';
import { onChangeInput, getStateFields } from '../../../utils/functions';

import { FilterStyles } from './filter.style';

function useOnMount(handler) {
  return React.useEffect(handler, []);
}

const Filter = React.forwardRef((props, ref) => {
  const { setValue, register, handleSubmit } = useForm({
    reValidateMode: 'onSubmit',
    submitFocusError: false,
  });
  const { t } = useTranslation();
  const {
    fieldArray,
    validationRules,
    modalVisible,
    headerTitle,
    showDialog,
    isPortTrait,
  } = props;
  const [fields, setFields] = useState([...fieldArray]);

  useOnMount(() => {
    if (validationRules) {
      validationRules.forEach(valid => register(valid.name, valid.rule));
    }
  });

  const onValueChange = e => {
    const newFields = onChangeInput(fields, e);

    setFields(newFields);
    // Set new value to validate
    setValue(e.target.name, e.target.value);
  };

  const onSubmit = data => {
    const stateFields = getStateFields(fields);
    const stateTruthFields = pickBy(stateFields, identity);
    props.onFilter && props.onFilter(stateTruthFields);
  };

  // for Parent call onClear
  React.useImperativeHandle(ref, () => ({
    onClear() {
      const stateFields = getStateFields(fieldArray);
      const stateTruthFields = pickBy(stateFields, identity);
      props.onClearFilter(stateTruthFields);
      setFields(fieldArray);
    },
  }));

  const onClear = () => {
    const stateFields = getStateFields(fieldArray);
    const stateTruthFields = pickBy(stateFields, identity);
    props.onClearFilter(stateTruthFields);
    setFields(fieldArray);
  };

  return (
    <Grid>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={showDialog}>
        <Container style={FilterStyles.container}>
          <Row style={FilterStyles.row}>
            <View style={FilterStyles.modalHeader}>
              <Text>{headerTitle ? t(headerTitle) : t('Filter')}</Text>
            </View>
            <View style={FilterStyles.modalHeaderIcon}>
              <TouchableOpacity onPress={showDialog}>
                <Icon
                  name="md-close"
                  size={24}
                  style={FilterStyles.titleIcon}
                />
              </TouchableOpacity>
            </View>
          </Row>
          <Content>
            <View style={FilterStyles.modalView}>
              <Field
                conditionalArray={fields}
                onChange={e => onValueChange(e)}
                isPortTrait={isPortTrait}
              />
            </View>
          </Content>
          <View style={FilterStyles.modalBottomView}>
            <MasterButton
              name={buttonConstant.BUTTON_RESET}
              handleClick={onClear}
            />
            <MasterButton
              name={buttonConstant.BUTTON_SEARCH}
              handleClick={handleSubmit(onSubmit)}
            />
          </View>
        </Container>
      </Modal>
    </Grid>
  );
});

export default Filter;
