export function getDateString(date: Date) {
  const days: { [key: number]: string } = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };

  const months: { [key: number]: string } = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };

  const dayOfTheWeek: string = days[date.getUTCDay()];
  const dayOfTheMonth: string = date.getUTCDate().toString().padStart(2, "0");
  const month: string = months[date.getUTCMonth()];
  const year: number = date.getUTCFullYear();

  return `${dayOfTheWeek}, ${dayOfTheMonth} ${month} ${year}`;
}

export const getDisplayTime = (timeTakenMinutes: number): string => {
  const timeTakenQuotientHours: number = Math.floor(timeTakenMinutes / 60);
  const timeTakenRemainderMinutes: number = timeTakenMinutes % 60;

  if (timeTakenQuotientHours > 0) {
    return `${timeTakenQuotientHours} hours and ${timeTakenRemainderMinutes} minutes`;
  } else {
    return `${timeTakenRemainderMinutes} minutes`;
  }
};
