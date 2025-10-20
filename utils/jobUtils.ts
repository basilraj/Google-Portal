

// Fix: Add .ts extension to local module import.
import { Job, JobStatus } from '../types.ts';

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
