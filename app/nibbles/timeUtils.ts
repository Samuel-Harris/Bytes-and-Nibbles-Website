export const getDisplayTime = (totalMinutes: number): string => {
  const hours: number = Math.floor(totalMinutes / 60);
  const minutes: number = totalMinutes % 60;

  return hours > 0
    ? `${hours} hours and ${minutes} minutes`
    : `${minutes} minutes`;
};
