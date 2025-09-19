import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShotService } from './shotService';

const DEBUG_DATE_OFFSET_KEY = 'debug_date_offset';
const DEBUG_MODE_KEY = 'debug_mode_enabled';

export class DebugService {
  private static instance: DebugService;

  private constructor() {}

  static getInstance(): DebugService {
    if (!DebugService.instance) {
      DebugService.instance = new DebugService();
    }
    return DebugService.instance;
  }

  async isDebugModeEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(DEBUG_MODE_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Erreur lors de la vérification du mode debug:', error);
      return false;
    }
  }

  async enableDebugMode(): Promise<void> {
    try {
      await AsyncStorage.setItem(DEBUG_MODE_KEY, 'true');
    } catch (error) {
      console.error('Erreur lors de l\'activation du mode debug:', error);
      throw error;
    }
  }

  async disableDebugMode(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([DEBUG_MODE_KEY, DEBUG_DATE_OFFSET_KEY]);
    } catch (error) {
      console.error('Erreur lors de la désactivation du mode debug:', error);
      throw error;
    }
  }

  async getDebugDateOffset(): Promise<number> {
    try {
      const offset = await AsyncStorage.getItem(DEBUG_DATE_OFFSET_KEY);
      return offset ? parseInt(offset, 10) : 0;
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'offset de date:', error);
      return 0;
    }
  }

  async setDebugDateOffset(offset: number): Promise<void> {
    try {
      await AsyncStorage.setItem(DEBUG_DATE_OFFSET_KEY, offset.toString());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'offset de date:', error);
      throw error;
    }
  }

  async simulateNextDay(): Promise<void> {
    try {
      const isDebugEnabled = await this.isDebugModeEnabled();
      if (!isDebugEnabled) {
        throw new Error('Mode debug non activé');
      }

      const currentOffset = await this.getDebugDateOffset();
      await this.setDebugDateOffset(currentOffset + 1);

      await this.clearDailyShotCache();
    } catch (error) {
      console.error('Erreur lors de la simulation du jour suivant:', error);
      throw error;
    }
  }

  async resetDebugDate(): Promise<void> {
    try {
      await this.setDebugDateOffset(0);
      await this.clearDailyShotCache();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation de la date debug:', error);
      throw error;
    }
  }

  private async clearDailyShotCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const dailyShotKeys = keys.filter(key => key.startsWith('daily_shot_'));
      if (dailyShotKeys.length > 0) {
        await AsyncStorage.multiRemove(dailyShotKeys);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du cache des shots quotidiens:', error);
    }
  }

  getDebugDate(): Date {
    return new Date();
  }

  async getDebugDateKey(): Promise<string> {
    const isDebugEnabled = await this.isDebugModeEnabled();
    if (!isDebugEnabled) {
      const today = new Date();
      return `daily_shot_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
    }

    const offset = await this.getDebugDateOffset();
    const debugDate = new Date();
    debugDate.setDate(debugDate.getDate() + offset);

    return `daily_shot_${debugDate.getFullYear()}_${debugDate.getMonth()}_${debugDate.getDate()}`;
  }

  async getCurrentDebugInfo(): Promise<{
    isDebugMode: boolean;
    dayOffset: number;
    simulatedDate: string;
    remainingShots: number;
  }> {
    const isDebugMode = await this.isDebugModeEnabled();
    const dayOffset = await this.getDebugDateOffset();
    const shotService = ShotService.getInstance();
    const remainingShots = await shotService.getRemainingShots();

    const debugDate = new Date();
    debugDate.setDate(debugDate.getDate() + dayOffset);

    return {
      isDebugMode,
      dayOffset,
      simulatedDate: debugDate.toLocaleDateString('fr-FR'),
      remainingShots
    };
  }
}