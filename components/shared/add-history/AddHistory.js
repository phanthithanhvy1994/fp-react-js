import React from 'react';
import { View } from 'react-native';

import { formatDateString } from '../../../utils/date-util';
import Timeline from 'react-native-timeline-flatlist';

import { historyStyle } from './AddHistory.style';

class AddHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.formatData();
  }

  componentWillUnmount() {
    this.setState({ data: [] });
  }

  formatData() {
    const { data } = this.props;
    // sample data: [{title: '20210131000000', userName: 'user1', description: 'test1'}, {title: '20210131000000', userName: 'user1', description: 'test2'}]
    const isHasData = data && data.length;
    const newData = isHasData ? data.map(item => ({
      ...item,
      title: formatDateString(item.title, null, true),
      description: item.customContent ? item.customContent : `<${item.userName || 'Username'}> ${item.description}`,
    })) : [];
    this.setState({ data: newData });
  }

  render() {
    const { data } = this.state;
    return (
      <View style={historyStyle.container}>
        {data ? (
          <Timeline
            data={data}
            circleSize={historyStyle.circleSize}
            timeContainerStyle={historyStyle.time}
            titleStyle={historyStyle.title}
            descriptionStyle={historyStyle.description}
            renderFullLine={true}
            lineWidth={historyStyle.lineWidth}
            lineColor={historyStyle.lineColor}
            circleColor={historyStyle.primaryColor}
            separator={true}
            separatorStyle={historyStyle.separatorStyle}
          />
        ) : null}
      </View>
    );
  }
}

export default AddHistory;
