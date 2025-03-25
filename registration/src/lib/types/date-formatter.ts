export function formatEventDate(date: string, time: string): string {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }