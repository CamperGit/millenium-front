export function isValidEmail(val) {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val);
}

export function daysInMonth(year, month) {
  let date = new Date(year, month, 1);
  let daysCounter = 0;
  while (date.getMonth() === month) {
    daysCounter++;
    date.setDate(date.getDate() + 1);
  }
  return daysCounter;
}

export function getIndexOfObject(list, idName ,id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i][idName] === id) {
      return i;
    }
  }
  return -1;
}
