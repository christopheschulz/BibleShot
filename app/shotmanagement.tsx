import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DebugService, ShotService } from '@/services';

export default function ShotManagementScreen() {
  const [debugInfo, setDebugInfo] = useState<{
    isDebugMode: boolean;
    dayOffset: number;
    simulatedDate: string;
    remainingShots: number;
  } | null>(null);

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      const debugService = DebugService.getInstance();
      const info = await debugService.getCurrentDebugInfo();
      setDebugInfo(info);
    } catch (error) {
      console.error('Erreur lors du chargement des infos debug:', error);
    }
  };

  const enableDebugMode = async () => {
    try {
      const debugService = DebugService.getInstance();
      await debugService.enableDebugMode();
      await loadDebugInfo();
      Alert.alert('Debug', 'Mode debug activé');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'activer le mode debug');
      console.error('Erreur activation debug:', error);
    }
  };

  const disableDebugMode = async () => {
    try {
      const debugService = DebugService.getInstance();
      await debugService.disableDebugMode();
      await loadDebugInfo();
      Alert.alert('Debug', 'Mode debug désactivé');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de désactiver le mode debug');
      console.error('Erreur désactivation debug:', error);
    }
  };

  const simulateNextDay = async () => {
    try {
      if (!debugInfo?.isDebugMode) {
        Alert.alert('Debug', 'Activez d\'abord le mode debug');
        return;
      }

      const debugService = DebugService.getInstance();
      await debugService.simulateNextDay();
      await loadDebugInfo();

      Alert.alert('Debug', 'Jour suivant simulé ! Le nouveau shot sera visible à l\'accueil.');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de simuler le jour suivant');
      console.error('Erreur simulation jour:', error);
    }
  };

  const resetDebugDate = async () => {
    try {
      if (!debugInfo?.isDebugMode) {
        Alert.alert('Debug', 'Activez d\'abord le mode debug');
        return;
      }

      const debugService = DebugService.getInstance();
      await debugService.resetDebugDate();
      await loadDebugInfo();

      Alert.alert('Debug', 'Date remise à aujourd\'hui');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de remettre à zéro la date');
      console.error('Erreur reset date:', error);
    }
  };

  const resetAllShots = async () => {
    Alert.alert(
      'Réinitialiser tous les shots',
      'Cette action va marquer tous les shots comme non utilisés. Êtes-vous sûr ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              const shotService = ShotService.getInstance();
              await shotService.resetUsedShots();
              await loadDebugInfo();
              Alert.alert('Debug', 'Tous les shots ont été réinitialisés');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de réinitialiser les shots');
              console.error('Erreur reset shots:', error);
            }
          },
        },
      ]
    );
  };

  const goBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ThemedText style={styles.backButtonText}>‹ Retour</ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🎯 Gestion des Shots</ThemedText>

          {debugInfo && (
            <ThemedView style={styles.infoCard}>
              <ThemedText style={styles.infoText}>
                Statut: {debugInfo.isDebugMode ? '✅ Activé' : '❌ Désactivé'}
              </ThemedText>
              {debugInfo.isDebugMode && (
                <>
                  <ThemedText style={styles.infoText}>
                    Décalage de jours: +{debugInfo.dayOffset}
                  </ThemedText>
                  <ThemedText style={styles.infoText}>
                    Date simulée: {debugInfo.simulatedDate}
                  </ThemedText>
                </>
              )}
              <ThemedText style={styles.infoText}>
                Shots restants: {debugInfo.remainingShots}/365
              </ThemedText>
            </ThemedView>
          )}

          <TouchableOpacity
            style={[styles.button, debugInfo?.isDebugMode ? styles.buttonDanger : styles.buttonPrimary]}
            onPress={debugInfo?.isDebugMode ? disableDebugMode : enableDebugMode}
          >
            <ThemedText style={styles.buttonText}>
              {debugInfo?.isDebugMode ? '❌ Désactiver Debug' : '✅ Activer Debug'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {debugInfo?.isDebugMode && (
          <>
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>📅 Simulation de dates</ThemedText>

              <TouchableOpacity style={styles.button} onPress={simulateNextDay}>
                <ThemedText style={styles.buttonText}>
                  ⏭️ Simuler le jour suivant
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={resetDebugDate}>
                <ThemedText style={styles.buttonText}>
                  🔄 Revenir à aujourd&apos;hui
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>🔧 Outils avancés</ThemedText>

              <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={resetAllShots}>
                <ThemedText style={styles.buttonText}>
                  🗑️ Réinitialiser tous les shots
                </ThemedText>
              </TouchableOpacity>

              <ThemedView style={styles.warningCard}>
                <ThemedText style={styles.warningText}>
                  ⚠️ Attention: Ces outils modifient les données de l&apos;application.
                  Utilisez-les uniquement en développement.
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </>
        )}

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>ℹ️ Informations</ThemedText>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonDanger: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  warningCard: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
});