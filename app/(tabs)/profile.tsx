import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {

  const menuItems = [
    {
      title: 'Paramètres',
      icon: '⚙️',
      onPress: () => Alert.alert('Paramètres', 'Fonctionnalité à venir'),
      disabled: false,
    },
    {
      title: 'Statistiques',
      icon: '📊',
      onPress: () => Alert.alert('Statistiques', 'Fonctionnalité à venir'),
      disabled: false,
    },
    {
      title: 'À propos',
      icon: 'ℹ️',
      onPress: () => Alert.alert('À propos', 'BibleShot v1.0\nDéveloppé avec ❤️'),
      disabled: false,
    },
    {
      title: 'Support',
      icon: '💬',
      onPress: () => Alert.alert('Support', 'Fonctionnalité à venir'),
      disabled: false,
    },
    ...__DEV__ ? [{
      title: 'Debug',
      icon: '🐛',
      onPress: () => router.push('/debug'),
      disabled: false,
    }] : [],
  ];


  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, item.disabled && styles.menuItemDisabled]}
              onPress={item.onPress}
              disabled={item.disabled}
            >
              <ThemedText style={styles.menuIcon}>{item.icon}</ThemedText>
              <ThemedText style={[styles.menuText, item.disabled && styles.menuTextDisabled]}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.menuArrow}>›</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  menuContainer: {
    width: '100%',
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  menuTextDisabled: {
    opacity: 0.5,
  },
  menuArrow: {
    fontSize: 18,
    opacity: 0.5,
    fontWeight: 'bold',
  },
});