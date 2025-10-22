// Fix: Add .ts extension to local module import.
import { Job, JobStatus, PlacementSetting, AdSettings } from '../types.ts';

/**
 * Determines the effective status of a job.
 * If the last date to apply is in the past, it's considered 'expired',
 * otherwise it returns the job's stored status.
 */
export const getEffectiveJobStatus = (job: Job): JobStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
  const lastDate = new Date(job.lastDate);

  if (lastDate < today) {
    return 'expired';
  }
  
  return job.status;
};

/**
 * Resolves the final ad code for a given placement setting.
 * @param placement - The PlacementSetting object for a specific ad slot.
 * @param adNetworks - The library of all saved ad network codes.
 * @returns The ad code string if enabled and configured, otherwise an empty string.
 */
export const getAdCodeForPlacement = (placement: PlacementSetting, adNetworks: AdSettings['adNetworks']): string => {
    if (!placement || !placement.enabled) {
        return '';
    }

    if (placement.type === 'network' && placement.networkKey && adNetworks[placement.networkKey]) {
        return adNetworks[placement.networkKey].code || '';
    }
    
    if (placement.type === 'custom') {
        return placement.customCode || '';
    }

    return '';
};