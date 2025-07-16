import { JobApplication } from '@/types';
import { STORAGE_KEY } from '@/utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadApplications = async (): Promise<JobApplication[]> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error loading applications:', error);
    return [];
  }
};

export const saveApplications = async (applications: JobApplication[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error('Error saving applications:', error);
    throw error;
  }
};
