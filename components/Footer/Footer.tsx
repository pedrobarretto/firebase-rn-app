import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { BUDGETS, NEW_BUDGETS, SETTINGS } from '../../utils';
import * as rootNavigation from '../../utils';
import { useUser } from '../../hooks';

export function Footer() {
  const { user } = useUser();

  return (
    <>
      {
        user?.id && (
          <View style={[styles.container]}>
            <View>
              <Pressable onPress={() => rootNavigation.navigate(BUDGETS)}>
                <FontAwesome5 name='money-check' size={30} color='black' />
              </Pressable>
            </View>
            <View>
              <Pressable onPress={() => rootNavigation.navigate(NEW_BUDGETS)}>
                <Ionicons name='add-circle' size={30} color='black' />
              </Pressable>
            </View>
            <View>
              <Pressable onPress={() => rootNavigation.navigate(SETTINGS)}>
                <Ionicons name='settings' size={30} color='black' />
              </Pressable>
            </View>
          </View>
        )
      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    backgroundColor: '#fafafa',
    zIndex: 9,
    height: 60,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  }
});