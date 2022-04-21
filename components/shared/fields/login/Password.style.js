import {
  defaultColor,
  defaultSize,
} from '../../../../styles/theme/variables/platform';

export const passwordStyles = {
  fieldContainer: {
    top: -15,
    minHeight: 36,
    borderBottomWidth: 0,
    marginBottom: 16,
    marginLeft: 0,
    position: 'absolute',
  },
  fieldItem: {
    borderRadius: 4,
    backgroundColor: defaultColor.extraLightGray,
    marginLeft: 0,
    borderColor: 'transparent',
    width: 300,
  },
  iconPassword: {
    marginLeft: 8,
    color: defaultColor.primary,
  },
  input: {
    paddingBottom: 8,
    fontSize: 12,
    lineHeight: 18,
  },
  iconSize: {
    size: defaultSize.icon,
  },
  placeholder: {color: defaultColor.lightGray},
  iconShowPassword: {
    color: defaultColor.lightGray,
  },
};
