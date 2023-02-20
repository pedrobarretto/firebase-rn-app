import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';

interface Props {
  setIsOpen: (x: boolean) => void;
}

export function AddBudget({ setIsOpen }: Props) {
  return (
    <View>
      <Pressable
        style={styles.floatingMenuButtonStyle}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.btnText}>+</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  floatingMenuButtonStyle: {
    position: 'absolute',
    // bottom: 0,
    // top: 170,
    right: 10,
    elevation: 3,
    backgroundColor: 'rgb(227, 94, 0)',
    padding: 10,
    borderRadius: 50,
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 32,
  }
});