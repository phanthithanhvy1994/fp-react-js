import {StyleSheet} from 'react-native';
import {defaultColor} from '../../../styles/theme/variables/platform';
import {Dimensions} from 'react-native';

const EditableStyles = StyleSheet.create({
  height: -Dimensions.get('window').height,
  container: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  cell: {
    minHeight: 28,
    flex: 1,
    borderColor: defaultColor.gray,
    width: 100,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: defaultColor.gray,
    paddingLeft: 2,
    paddingRight: 2,
    margin: 1,
    justifyContent: 'center',
  },
  flexOne: {
    flex: 1,
  },
  cellText: {
    color: defaultColor.black,
    padding: 0,
  },
  cellHeader: {
    backgroundColor: defaultColor.primary,
    alignItems: 'center',
    minHeight: 30,
  },
  headerText: {
    color: defaultColor.white,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    justifyContent: 'center',
    margin: 0,
  },
  cellInput: {
    width: '100%',
    fontSize: 12,
    padding: 0,
    textAlign: 'right',
  },
  inputPaddingLeft: {
    paddingLeft: 24,
  },
  table: {
    height: '100%',
  },
  tableFooter: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },

  closeIcon: {
    color: defaultColor.primary,
  },
  cellEditable: {
    minHeight: 26,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  flexEditable: {
    flexDirection: 'row',
    flex: 1,
  },
  cellHighLight: {
    backgroundColor: '#FFD3D3',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  // scaleX: {transform: [{scaleX: -1}]},
  alignItemsRight: {
    alignItems: 'flex-end',
  },
  alignItemsLeft: {
    alignItems: 'flex-start',
  },
  flexView: {
    flex: 2,
  },
  cellBlue: {
    backgroundColor: '#ffd1a9',
  },
});

export default EditableStyles;
