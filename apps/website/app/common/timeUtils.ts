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

  const dayOfTheWeek: string = days[date.getDay()];
  const dayOfTheMonth: string = date.getDate().toString().padStart(2, "0");
  const month: string = months[date.getMonth()];
  const year: number = date.getFullYear();

  return `${dayOfTheWeek}, ${dayOfTheMonth} ${month} ${year}`;
}
