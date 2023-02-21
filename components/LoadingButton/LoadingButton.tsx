import React from 'react';
import { Text,
  ButtonProps,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ActivityIndicator
} from 'react-native';

interface Props extends ButtonProps {
  onPress: () => Promise<void>;
  title: string;
  isDisabled?: boolean;
  icon?: any;
  btnStyle?: any;
  textStyle?: TextStyle;
  isLoading: boolean;
  onlyPropsStyle?: boolean;
}

export function LoadingButton(
  {
    onPress,
    title,
    isDisabled,
    icon,
    btnStyle,
    textStyle,
    isLoading,
    onlyPropsStyle
  }: Props) {
  const handlePress = async () => {
    await onPress();
  }

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={
        isDisabled ?
        [styles.button, styles.disabled] :
        [onlyPropsStyle ? btnStyle : styles.button, btnStyle]
      }
      onPress={handlePress}
    >
      {
        isLoading ? (
          <ActivityIndicator size='large' color='#fff' />
        ) : (
          <>
            {icon}
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          </>
        )
      }
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  }
});