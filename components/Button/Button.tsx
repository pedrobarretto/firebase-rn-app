import React from 'react';
import {
  Text,
  ButtonProps,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
  TextStyle
} from 'react-native';

interface Props extends ButtonProps {
  onPress: () => void;
  title: string;
  isDisabled?: boolean;
  icon?: any;
  btnStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export function CustomButton({
  onPress,
  title,
  isDisabled,
  icon,
  btnStyle,
  textStyle }: Props) {
  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={isDisabled ? [styles.button, styles.disabled] : [styles.button, btnStyle]}
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  }
});