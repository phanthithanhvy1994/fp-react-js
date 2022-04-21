import {StyleSheet} from 'react-native';
import {defaultColor} from '../../../styles/theme/variables/platform';

export const stepStyle = {
  // for bottom action button
  fullWidthBtnArea: {
    marginTop: -8,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  actionChildArea: {
    paddingBottom: 16,
    flex: 1,
  },
  stepActionBtn: {
    flexDirection: 'row',
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },

  stepActionBtnChild: {
    flex: 1,
  },

  disabledBtnStyle: {
    opacity: 0.4,
  },

  buttonBackStyle: {
    height: 36,
    marginRight: 3.25,
    alignItems: 'flex-start',
    backgroundColor: defaultColor.white,
    borderColor: defaultColor.lightGray,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  iconBack: {
    position: 'absolute',
    left: 13,
    bottom: 5,
  },

  iconNext: {
    position: 'absolute',
    right: 13,
    bottom: 5,
  },

  whiteArrowNextIcon: {
    position: 'absolute',
    right: 13,
    bottom: 5,
    color: defaultColor.white,
  },

  buttonNextTextStyle: {
    color: defaultColor.text
  },

  buttonWhiteTextStyle: {
    color: defaultColor.white
  },

  buttonNextStyle: {
    height: 36,
    marginLeft: 3.25,
    marginRight: 0,
    backgroundColor: defaultColor.white,
    borderColor: defaultColor.lightGray,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  buttonSaveStyle: {
    height: 36,
    marginLeft: 3.25,
    marginRight: 0,
    backgroundColor: defaultColor.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  buttonSubmitStyle: {
    height: 36,
    marginLeft: 3.25,
    marginRight: 0,
    backgroundColor: defaultColor.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  /////
  buttonStyle: {
    backgroundColor: defaultColor.white,
    borderWidth: 1,
    bottom: -30,
    borderColor: defaultColor.lightGray,
    width: 168,
    height: 36,
  },
  buttonTextStyle: {
    color: defaultColor.neutral,
    position: 'absolute',
    top: '25%',
    transform: [{translate: [50, 0]}],
    fontSize: 16,
  },
  activeStepIconColor: defaultColor.white,
  activeStepIconBorderColor: defaultColor.primary,
  activeLabelColor: defaultColor.black,
  completedStepIconColor: defaultColor.primary,
  completedProgressBarColor: defaultColor.primary,
  progressBarColor: defaultColor.lightGray,
  borderWidth: 1,
};

export const detailStyle = StyleSheet.create({
  normalViewCtn: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  viewTime: {
    bottom: 0,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
  },
  remainingTime: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  countTime: {
    marginLeft: 50,
    fontWeight: 'bold',
  },
  viewCenter: {
    alignItems: 'center',
  },
  viewFlex: {flex: 1, width: '100%'},
  lineStepBarCover: {
    position: 'absolute',
    top: 48,
    left: -16,
    right: -16,
    borderTopWidth: 1,
    borderTopColor: defaultColor.lightGray,
  },
  // Last View
  lastViewFieldsCtn: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lastViewFieldsLeft: {
    width: '70%', // is 70% of container width
  },

  lastViewFieldsRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastViewFieldsRightText1: {
    marginVertical: 10,
  },
  lastViewFieldsRightText2: {
    marginTop: 20,
  },
});
