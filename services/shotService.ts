import AsyncStorage from '@react-native-async-storage/async-storage';
import { BibleShot, UsedShotsData } from './types';
import bibleShotsData from '@/assets/Data/Bibleshotdata.json';
import { DebugService } from './debugService';

const USED_SHOTS_KEY = 'used_shots';

export class ShotService {
  private static instance: ShotService;
  private shots: BibleShot[] = bibleShotsData as BibleShot[];

  private constructor() {}

  static getInstance(): ShotService {
    if (!ShotService.instance) {
      ShotService.instance = new ShotService();
    }
    return ShotService.instance;
  }

  async getUsedShotsData(): Promise<UsedShotsData> {
    try {
      const data = await AsyncStorage.getItem(USED_SHOTS_KEY);
      if (data) {
        const parsed: UsedShotsData = JSON.parse(data);
        const currentYear = new Date().getFullYear();

        if (parsed.year === currentYear) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la lecture des shots utilisés:', error);
    }

    return {
      year: new Date().getFullYear(),
      usedIds: []
    };
  }

  async saveUsedShotsData(data: UsedShotsData): Promise<void> {
    try {
      await AsyncStorage.setItem(USED_SHOTS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des shots utilisés:', error);
      throw error;
    }
  }

  async getRandomUnusedShot(): Promise<BibleShot | null> {
    const usedData = await this.getUsedShotsData();
    const availableShots = this.shots.filter(shot => !usedData.usedIds.includes(shot.id));

    if (availableShots.length === 0) {
      usedData.usedIds = [];
      await this.saveUsedShotsData(usedData);
      return this.getRandomUnusedShot();
    }

    const randomIndex = Math.floor(Math.random() * availableShots.length);
    const selectedShot = availableShots[randomIndex];

    usedData.usedIds.push(selectedShot.id);
    await this.saveUsedShotsData(usedData);

    return selectedShot;
  }

  async getDailyShot(): Promise<BibleShot | null> {
    try {
      const debugService = DebugService.getInstance();
      const dateKey = await debugService.getDebugDateKey();

      const cachedShot = await AsyncStorage.getItem(dateKey);
      if (cachedShot) {
        return JSON.parse(cachedShot) as BibleShot;
      }

      const shot = await this.getRandomUnusedShot();
      if (shot) {
        await AsyncStorage.setItem(dateKey, JSON.stringify(shot));
      }

      return shot;
    } catch (error) {
      console.error('Erreur lors de la récupération du shot quotidien:', error);
      return this.getRandomUnusedShot();
    }
  }

  async getRemainingShots(): Promise<number> {
    const usedData = await this.getUsedShotsData();
    return this.shots.length - usedData.usedIds.length;
  }

  async resetUsedShots(): Promise<void> {
    const currentYear = new Date().getFullYear();
    await this.saveUsedShotsData({
      year: currentYear,
      usedIds: []
    });
  }

  getAllShots(): BibleShot[] {
    return [...this.shots];
  }

  getShotById(id: number): BibleShot | undefined {
    return this.shots.find(shot => shot.id === id);
  }
}