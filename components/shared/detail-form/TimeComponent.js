import React from 'react';
import {Text, View} from 'react-native';
import {detailStyle} from './detail-form.style';

const TimeComponent = React.forwardRef((props, ref) => {
  const {isBranchPOType, configTime, showRemainingTime} = props;

  const [time, setTime] = React.useState({minute: '60', second: '00'});
  const [checkConfig, setCheckConfig] = React.useState(false);

  const [curTime, setCurTime] = React.useState(new Date().toLocaleTimeString());

  React.useEffect(() => {
    if (!checkConfig && configTime) {
      setCheckConfig(!checkConfig);
      setTime(configTime);
    }
    const intervalId = setInterval(() => {
      !showRemainingTime && setCurTime(new Date().toLocaleTimeString());
      setTime({
        minute: +time.second > 0 ? time.minute : time.minute - 1,
        second:
          +time.second > 0
            ? `${+time.second <= 10 ? '0' : ''}${+time.second - 1}`
            : 59,
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time, curTime]);

  React.useImperativeHandle(ref, () => ({
    getTime(step) {
      props.handleGetTime(curTime, `00:${time.minute}:${time.second}`, step);
    },
  }));
  return (
    <View>
      {showRemainingTime ? (
        <Text style={detailStyle.remainingTime}>
          {time.minute}:{time.second}
        </Text>
      ) : (
        <View>
          <View style={detailStyle.viewTime}>
            <Text>Time:</Text>
            <Text style={detailStyle.countTime}>{curTime}</Text>
          </View>
          {!isBranchPOType ? (
            <View style={detailStyle.viewTime}>
              <Text>Remaining Time:</Text>
              <Text style={detailStyle.remainingTime}>
                {time.minute}:{time.second}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
});

export default TimeComponent;
