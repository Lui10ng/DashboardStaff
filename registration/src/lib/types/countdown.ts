import type { CountdownData } from '$lib/types/event';

export function calculateCountdown(startDate: string, startTime: string, endDate: string, endTime: string): CountdownData {
  try {
    const now = new Date();
    const eventStart = new Date(`${startDate}T${startTime}`);
    const eventEnd = new Date(`${endDate}T${endTime}`);

    console.log('Now:', now);
    console.log('Event Start:', eventStart);
    console.log('Event End:', eventEnd);

    // If event hasn't started yet
    if (now < eventStart) {
      const diff = eventStart.getTime() - now.getTime();
      return calculateTimeRemaining(diff);
    }

    // If event is ongoing
    if (now >= eventStart && now < eventEnd) {
      const diff = eventEnd.getTime() - now.getTime();
      return calculateTimeRemaining(diff);
    }

    // Event has ended
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  } catch (error) {
    console.error('Error calculating countdown:', error);
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }
}

function calculateTimeRemaining(diff: number): CountdownData {
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
}