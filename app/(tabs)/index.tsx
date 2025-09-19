import { StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ShotService, BibleShot } from '@/services';

export default function HomeScreen() {
  const [dailyShot, setDailyShot] = useState<BibleShot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDailyShot();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDailyShot();
    }, [])
  );

  const loadDailyShot = async () => {
    try {
      setLoading(true);
      setError(null);
      const shotService = ShotService.getInstance();
      const shot = await shotService.getDailyShot();
      setDailyShot(shot);
    } catch (err) {
      setError('Erreur lors du chargement du shot quotidien');
      console.error('Erreur shot quotidien:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.shotContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>
            Chargement du shot quotidien...
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (error || !dailyShot) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.shotContainer}>
          <ThemedText style={styles.errorText}>
            {error || 'Aucun shot disponible'}
          </ThemedText>
          <ThemedText style={styles.hintText}>
            Réessayez plus tard
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.shotContainer}>
        <ThemedText style={styles.shotText}>
          {dailyShot.punchline}
        </ThemedText>
        <ThemedText style={styles.hintText}>
          Retrouvez le verset dans l&apos;onglet Quiz !
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shotContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  shotText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 36,
  },
  hintText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.8,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#FF3B30',
  },
});