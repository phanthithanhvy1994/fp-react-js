import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {usePromiseTracker} from 'react-promise-tracker';

import {notificationService} from '../../../services/notificationService';

import {NotificationType} from '../../../constants/constants';

import SpinnerStyles from './Spinner.style';

export const Spinner = props => {
  const {promiseInProgress} = usePromiseTracker();
  // [HONDAIPB-CR] - 16/07/2020 - Cancel previous request if HardwareBack press
  // Notify to update promiseInProgress value in Header
  if (promiseInProgress) {
    notificationService.notify(NotificationType.IS_PROMISE_IN_PROGRESS);
  } else {
    notificationService.notify(NotificationType.IS_NOT_PROMISE_IN_PROGRESS);
  }

  return (
    <View style={[promiseInProgress ? SpinnerStyles.container : '']}>
      {promiseInProgress && (
        <ActivityIndicator size="large" color={SpinnerStyles.spinner.color} />
      )}
    </View>
  );
};

export default Spinner;
