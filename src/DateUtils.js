export function getDaysInMonth(year, month) {
  return 32 - new Date(year, month, 32).getDate();
}

export function getDateString(date) {
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
}

export function getMonthName(date) {
  var month = new Array(12);
  month[0] = "Januar";
  month[1] = "Februar";
  month[2] = "März";
  month[3] = "April";
  month[4] = "May";
  month[5] = "Juni";
  month[6] = "Juli";
  month[7] = "August";
  month[8] = "September";
  month[9] = "Oktober";
  month[10] = "November";
  month[11] = "Dezember";
  return month[date.getMonth()];
}

export function getWeekday(date) {
  var weekday = new Array(7);
  weekday[0] = "Sonntag";
  weekday[1] = "Montag";
  weekday[2] = "Dienstag";
  weekday[3] = "Mittwoch";
  weekday[4] = "Donnerstag";
  weekday[5] = "Freitag";
  weekday[6] = "Samstag";
  return weekday[date.getDay()];
}
