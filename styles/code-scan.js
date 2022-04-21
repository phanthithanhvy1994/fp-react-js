import {defaultColor} from '../styles/theme/variables/platform';

const getStyles = (SCREEN_HEIGHT, SCREEN_WIDTH, isPortrait) => {
  const overlayColor = defaultColor.gray;
  const rectDimensions = SCREEN_WIDTH * 0.65;
  return {
    rectangleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    cameraStyle: {
      height: rectDimensions,
      width: rectDimensions,
      overflow: 'hidden',
    },
    text: {
      width: isPortrait ? '30%' : '50%',
      marginTop: -60,
      textAlign: 'center',
    },
    rectangleCover: {
      flexDirection: 'row',
    },
    rectangle: {
      height: rectDimensions,
      width: rectDimensions,
      // alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    topOverlay: {
      flex: 1,
      height: SCREEN_WIDTH,
      width: SCREEN_WIDTH,
      backgroundColor: overlayColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomOverlay: {
      flex: isPortrait ? 0 : 1,
      height: isPortrait ? SCREEN_WIDTH * 0.42 : SCREEN_WIDTH,
      width: SCREEN_WIDTH,
      backgroundColor: overlayColor,
      paddingBottom: SCREEN_WIDTH * 0.25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    leftAndRightOverlay: {
      height: SCREEN_WIDTH * 0.65,
      width: SCREEN_WIDTH,
      backgroundColor: overlayColor,
    },
  };
};
export default getStyles;
