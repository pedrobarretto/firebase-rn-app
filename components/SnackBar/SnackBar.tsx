import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSnackBar } from '../../hooks';

export function SnackBar() {
  const { state, setState } = useSnackBar();

  useEffect(() => {
    if (state.isSnackBarOpen) {
      const timeoutId = setTimeout(() => {
        setState({ ...state, isSnackBarOpen: false });
        if (state.onDismiss) {
          state.onDismiss();
        }
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [state.isSnackBarOpen]);

  const handleDismiss = () => {
    setState({ ...state, isSnackBarOpen: false });
    if (state.onDismiss) {
      state.onDismiss();
    }
  };

  const renderIcon = () => {
    switch (state.type) {
      case 'success':
        return <MaterialIcons name='check-circle' size={24} color='white' />;
      case 'error':
        return <MaterialIcons name='error' size={24} color='white' />;
      case 'warning':
        return <MaterialIcons name='warning' size={24} color='white' />;
      default:
        return null;
    }
  };

  const chooseBackgroundColor = () => {
    switch (state.type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      default:
        return '#dc3545';
    }
  }

  const renderSnackbarContent = () => (
    <View style={{ ...styles.snackbarContainer, backgroundColor: chooseBackgroundColor() }}>
      {renderIcon()}
      <Text style={styles.message}>{state.message}</Text>
      <TouchableOpacity onPress={handleDismiss}>
        <MaterialIcons name='close' size={24} color='white' />
      </TouchableOpacity>
    </View>
  );

  return state.isSnackBarOpen ? renderSnackbarContent() : null;
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  success: {
    backgroundColor: '#28a745',
  },
  error: {
    backgroundColor: '#dc3545',
  },
  warning: {
    backgroundColor: '#ffc107',
  },
  message: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    lineHeight: 20,
  },
  closeIcon: {
    marginLeft: 'auto',
    color: '#fff',
  },
});