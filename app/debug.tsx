import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function DebugScreen() {
  const debugMenuItems = [
    {
      title: 'Changement shot',
      icon: '🎯',
      onPress: () => router.push('/shotmanagement'),
      disabled: false,
    },
    {
      title: 'Logs système',
      icon: '📋',
      onPress: () => {},
      disabled: true,
    },
    {
      title: 'Reset données',
      icon: '🗑️',
      onPress: () => {},
      disabled: true,
    },
    {
      title: 'Cache management',
      icon: '💾',
      onPress: () => {},
      disabled: true,
    },
    {
      title: 'Performances',
      icon: '⚡',
      onPress: () => {},
      disabled: true,
    },
  ];

  const goBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ThemedText style={styles.backButtonText}>‹ Retour</ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.menuContainer}>
          {debugMenuItems.map((item, index) => (
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

        <ThemedView style={styles.infoSection}>
          <ThemedText style={styles.infoTitle}>Informations de développement</ThemedText>
          <ThemedView style={styles.infoCard}>
            <ThemedText style={styles.infoText}>
              Version: 1.0.0
            </ThemedText>
            <ThemedText style={styles.infoText}>
              Environnement: {__DEV__ ? 'Développement' : 'Production'}
            </ThemedText>
            <ThemedText style={styles.infoText}>
              Plateforme: {process.env.EXPO_OS || 'Non définie'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuContainer: {
    width: '100%',
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
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
  infoSection: {
    width: '100%',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'monospace',
  },
});