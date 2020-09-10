export function getDaysInMonth(year, month) {
  return 32 - new Date(year, month, 32).getDate();
}

// Get normalized date string (i.e. 2020-09-05) 
export function getNormalizedDateString(date) {
  let month = date.getMonth() + 1; // convert to realy month count (i.e 9 => September)
  month < 10 ? month = '0' + month : month = '' + month
  let day = date.getDate();
  day < 10 ? day = '0' + day : day = '' + day
  return date.getFullYear() + "-" + month + "-" + day;
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

  console.log(minutes);
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

export function WorktimeException(message) {
  this.message = message;
}

function isTimeStringOk(value) {
  if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value))
    return true;
  return false;
}

export function getWorkingTimeInMinutes(start, end, break_ = '00:00') {

  if (!isTimeStringOk(start) || !isTimeStringOk(end) || !isTimeStringOk(break_))
    throw new WorktimeException('Prüfen Sie Ihre Zeiteingaben');

  const startTime = start.split(':')
  const startTimeHours = Number.parseInt(startTime[0])
  const startTimeMinutes = Number.parseInt(startTime[1])
  const endTime = end.split(':')
  const endTimeHours = Number.parseInt(endTime[0])
  const endTimeMinutes = Number.parseInt(endTime[1])
  if (endTimeHours - startTimeHours < 0)
    throw new WorktimeException('Start-Zeit muss größer Ende-Zeit sein');
  else
    if (endTimeHours - startTimeHours === 0 && endTimeMinutes - startTimeMinutes < 1)
      throw new WorktimeException('Arbeitszeit muss mind. 1 min. betragen');

  const breakTime = break_.split(':')
  const breakTimeHours = Number.parseInt(breakTime[0])
  const breakTimeMinutes = Number.parseInt(breakTime[1])
  const workTime = (endTimeHours * 60 + endTimeMinutes) - (startTimeHours * 60 + startTimeMinutes) - (breakTimeHours * 60 + breakTimeMinutes);
  if (workTime < 1)
    throw new WorktimeException('Arbeitszeit muss mind. 1 min. betragen');

  return workTime;
}

