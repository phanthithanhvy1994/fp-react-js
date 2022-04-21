import {defaultColor} from '../../../styles/theme/variables/platform';

export default {
  modalBottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    paddingBottom: 16,
    paddingRight: 10,
    paddingTop: 0,
  },
  textDialog: {
    fontSize: 14,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: defaultColor.white,
    borderRadius: 8,
    paddingTop: 30,
    alignItems: 'center',
    elevation: 5,
  },
  defaultWidth: {maxWidth: 300, minWidth: 200},
  flexWidth: {
    width: 'auto',
  },
};
