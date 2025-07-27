export enum HealthMetric {
  Weight = 'Weight',
  BodyFatPercentage = 'BodyFatPercentage',
  ActiveEnergyBurned = 'ActiveEnergyBurned',
  Sleep = 'Sleep',
}

export async function requestPermissionsAsync(_perms: any): Promise<void> {
  console.warn('expo-health mock: requestPermissionsAsync called');
}

export async function getLatestMeasurementAsync(_metric: HealthMetric): Promise<any> {
  console.warn('expo-health mock: getLatestMeasurementAsync called');
  return null;
}

export async function getDailyAsync(
  _metric: HealthMetric,
  _startDate: Date,
  _endDate: Date,
): Promise<any> {
  console.warn('expo-health mock: getDailyAsync called');
  return { value: 0 } as any;
}