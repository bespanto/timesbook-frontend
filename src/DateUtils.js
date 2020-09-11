export function getDaysInMonth(year, month) {
  return 32 - new Date(year, month, 32).getDate();
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


export function minutesToTimeString(minutes) {
  let h = Math.trunc(minutes / 60);
  if (h < 10 && h >= 0)
    h = '0' + h;
  else
    if (h < 0) {
      let arr = h.toString().split('');
      arr.splice(1, 0, '0');
      h = arr.join('')
    }

  let m = minutes % 60
  m= m<0 ? m*(-1) : m;
  if (m < 10 && m >= 0)
    m = '0' + m;
  else
    if (m < 0) {
      let arr = m.toString().split('');
      arr.splice(0, 1, '');
      m = arr.join('')
    }

  return h + ':' + m;
}

