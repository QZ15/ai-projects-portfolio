import * as Health from 'expo-health';
import { addProgress } from './firebase';

export async function syncAppleHealth(uid: string) {
  try {
    const perms = {
      permissions: {
        read: [
          Health.HealthMetric.Weight,
          Health.HealthMetric.BodyFatPercentage,
          Health.HealthMetric.ActiveEnergyBurned,
          Health.HealthMetric.Sleep,
        ],
      },
    } as any;
    await Health.requestPermissionsAsync(perms);

    const weight = await Health.getLatestMeasurementAsync(
      Health.HealthMetric.Weight
    );
    const bodyFat = await Health.getLatestMeasurementAsync(
      Health.HealthMetric.BodyFatPercentage
    );
    const caloriesOut = await Health.getDailyAsync(
      Health.HealthMetric.ActiveEnergyBurned,
      new Date(Date.now() - 24 * 60 * 60 * 1000),
      new Date()
    );

    await addProgress(uid, {
      date: new Date().toISOString(),
      weight: weight?.value,
      bodyFat: bodyFat?.value,
      caloriesOut: caloriesOut?.value,
    });
  } catch (e) {
    console.log('Health sync failed', e);
  }
}
