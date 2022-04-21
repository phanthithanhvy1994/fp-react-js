import { defaultColor } from '../../../styles/theme/variables/platform';

export const historyStyle = {
  description: {
    fontSize: 13,
    color: defaultColor.text,
    fontStyle: 'normal',
    fontWeight: 'normal',
    marginTop: -2,
    paddingBottom: 10,
  },
  title: {
    marginTop: -15,
    fontSize: 13,
    color: defaultColor.text,
    fontStyle: 'normal',
    fontWeight: 'normal',
  },
  time: {
    display: 'none',
  },
  separatorStyle: {
    opacity: 0,
  },
  primaryColor: defaultColor.primary,
  lineColor: defaultColor.lightGray,
  lineWidth: 1,
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: defaultColor.white,
  },
  circleSize: 9,
};
