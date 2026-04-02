import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { Theme } from '@/constants/theme';

interface HeaderProps {
  title?: string;
  onProfilePress?: () => void;
}

export function Header({ title = 'FORMCHECK', onProfilePress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable>
        <MaterialCommunityIcons name="menu" size={28} color={Theme.colors.onSurface} />
      </Pressable>
      
      <Typography variant="headlineLg" style={styles.logo}>
        {title}
      </Typography>

      <Pressable style={styles.profileBtn} onPress={onProfilePress}>
        <View style={styles.profileImageContainer}>
          <MaterialCommunityIcons name="account" size={24} color={Theme.colors.onSurface} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  logo: {
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 1.2,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: -1,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3D3D3D',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
