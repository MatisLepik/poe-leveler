const formatter = Intl.DateTimeFormat('default', {
  year: '2-digit',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDate(date: Date) {
  return formatter.format(date);
}
