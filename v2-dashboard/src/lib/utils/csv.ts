import type { GuestProps } from '$lib/types';

export function downloadCSV(guests: GuestProps[]) {
  const headers = ['Name', 'Email', 'Status', 'Registration Date'];
  const rows = guests.map(guest => [guest.name, guest.email, guest.status, guest.registrationDate]);

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'guest_list.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}