import { ShotService } from '../shotService';

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

describe('ShotService', () => {
  let shotService: ShotService;

  beforeEach(() => {
    shotService = ShotService.getInstance();
    mockAsyncStorage.getItem.mockClear();
    mockAsyncStorage.setItem.mockClear();
  });

  it('should return a shot when getting daily shot', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue(undefined);

    const shot = await shotService.getDailyShot();

    expect(shot).toBeTruthy();
    expect(shot?.id).toBeDefined();
    expect(shot?.punchline).toBeDefined();
    expect(shot?.reference).toBeDefined();
    expect(shot?.verset).toBeDefined();
  });

  it('should return same shot for same day', async () => {
    const mockShot = {
      id: 1,
      reference: "Test",
      verset: "Test verse",
      punchline: "Test punchline"
    };

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockShot));

    const shot = await shotService.getDailyShot();

    expect(shot).toEqual(mockShot);
  });

  it('should track used shots correctly', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue(undefined);

    const shot1 = await shotService.getRandomUnusedShot();
    const shot2 = await shotService.getRandomUnusedShot();

    expect(shot1?.id).not.toBe(shot2?.id);
  });

  it('should reset when all shots are used', async () => {
    const usedData = {
      year: new Date().getFullYear(),
      usedIds: Array.from({length: 365}, (_, i) => i + 1)
    };

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(usedData));
    mockAsyncStorage.setItem.mockResolvedValue(undefined);

    const shot = await shotService.getRandomUnusedShot();

    expect(shot).toBeTruthy();
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'used_shots',
      expect.stringContaining('"usedIds":[]')
    );
  });
});