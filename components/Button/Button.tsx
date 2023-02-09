import React, { ComponentPropsWithRef } from 'react';
import { Text, StyleSheet, Pressable, ButtonProps } from 'react-native';

interface Props extends ButtonProps {
  onPress: () => void;
  title: string;
  isDisabled?: boolean;
}

export function CustomButton({ onPress, title, isDisabled=false }: Props) {
  return (
    <Pressable style={isDisabled ? styles.disabledButton : styles.button} onPress={onPress} disabled={isDisabled}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'rgb(227, 94, 0)',
  },
  disabledButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'rgb(127, 127, 127)',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});