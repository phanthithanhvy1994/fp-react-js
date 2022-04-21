import React, { Component } from 'react';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  showDatepicker = () => {
    this.setState({ show: true });
  };

  closeDatePicker = () => {
    this.setState({ show: false });
  };

  handleClick = (event, selectedDate) => {
    this.setState({ show: false }, () => selectedDate && this.props.onDateChange(selectedDate));
  };

  render() {
    const { value, minimumDate, maximumDate } = this.props;
    let newValue = value;

    if (!value) {
      newValue = new Date();
    }

    return (
      <View>
        {this.state.show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={newValue}
            display={'default'}
            onChange={this.handleClick}
            timeZoneOffsetInMinutes={0}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )}
      </View>
    );
  }
}

export default DatePicker;
