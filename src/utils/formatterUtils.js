export function dateFormatterOfJs(dateOfRow) {
  if (dateOfRow != '' && dateOfRow != null) {
    var d = new Date(dateOfRow),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      seconds = '' + d.getSeconds()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    if (hours.length < 2) hours = '0' + hours
    if (minutes.length < 2) minutes = '0' + minutes
    if (seconds.length < 2) seconds = '0' + seconds
    return [year, month, day].join('-')
  }
}
export function dateFormatter(dateOfRow) {
  if (dateOfRow != '' && dateOfRow != null) {
    var d = new Date(dateOfRow),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      seconds = '' + d.getSeconds()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    if (hours.length < 2) hours = '0' + hours
    if (minutes.length < 2) minutes = '0' + minutes
    if (seconds.length < 2) seconds = '0' + seconds
    return [year, month, day].join('')
  }
}

export function monthDateFormatter(dateOfRow) {
  if (dateOfRow != '' && dateOfRow != null) {
    var d = new Date(dateOfRow),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      seconds = '' + d.getSeconds()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    if (hours.length < 2) hours = '0' + hours
    if (minutes.length < 2) minutes = '0' + minutes
    if (seconds.length < 2) seconds = '0' + seconds
    return [year, month].join('-')
  }
}

export function moneyFormatterOfJs(amount) {// 金额的格式化
  const money = parseFloat(amount)
  return money.toLocaleString(money)
}
