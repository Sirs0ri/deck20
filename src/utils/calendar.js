// ========== DEFINITIONS ==========
export const months = [
  { index: 1, name: "Praios", days: 30 },
  { index: 2, name: "Rondra", days: 30 },
  { index: 3, name: "Efferd", days: 30 },
  { index: 4, name: "Travia", days: 30 },
  { index: 5, name: "Boron", days: 30 },
  { index: 6, name: "Hesinde", days: 30 },
  { index: 7, name: "Firun", days: 30 },
  { index: 8, name: "Tsa", days: 30 },
  { index: 9, name: "Phex", days: 30 },
  { index: 10, name: "Peraine", days: 30 },
  { index: 11, name: "Ingerimm", days: 30 },
  { index: 12, name: "Rahja", days: 30 },
  { index: 13, name: "Namenlose Tage", days: 5 },
]
export const days = [
  { index: 4, name: "Praiostag", isMoonpasePeak: false },
  { index: 5, name: "Rohalstag", isMoonpasePeak: false },
  { index: 6, name: "Feuertag", isMoonpasePeak: false },
  { index: 7, name: "Wassertag", isMoonpasePeak: false },
  { index: 1, name: "Windstag", isMoonpasePeak: false },
  { index: 2, name: "Erdstag", isMoonpasePeak: true }, // Special moon "peak" events (full / new / half) are always this day
  { index: 3, name: "Markttag", isMoonpasePeak: false },
]
export const moonPhases = [
  { index: 1, name: "Tote Mada", symbol: "🌘", symbolPeak: "🌑" },
  { index: 2, name: "Kelch", symbol: "🌒", symbolPeak: "🌓" },
  { index: 3, name: "Rad", symbol: "🌔", symbolPeak: "🌝" },
  { index: 4, name: "Helm", symbol: "🌖", symbolPeak: "🌗" },
]

// ========== DATE MANIPULATION HELPERS ==========
export function isDateInvalid ({ day, month, year }) {
  // day fo the month, [1,30], or [1,5] for Namenlose Tage
  // month, 1=Praios, 13=Namenlose Tage [1,13]
  // year, in BF
  if (month < 1) return "Falscher Monat (<1)"
  if (day < 1) return "Falscher Tag (<1)"
  if (month > 13) return "Falscher Monat (>13)"
  if (day > 30) return "Falscher Tag (>30)"
  if (month === 13 && day > 5) return "Es gibt nur 5 Namenlose Tage"
  // Years are always valid I guess

  return false
}

export function getWeekday ({ day, month, year }) {
  const dateError = isDateInvalid({ day, month, year })
  if (dateError) return dateError

  const weekday = (((year - 1) * 365) + ((month - 1) * 30) + day) % 7

  return days[weekday]
}

export function getMoonphase ({ day, month, year }) {
  const dateError = isDateInvalid({ day, month, year })
  if (dateError) return dateError

  const weekday = (((year - 1) * 365) + ((month - 1) * 30) + day + 22) % 28
  return moonPhases[Math.floor(weekday / 7)]
}

export function getMonth ({ day, month, year }) {
  return months.find(m => m.index === month)
}

export function substractDays ({ day, month, year }, difference) {
  let newDays = day - difference
  let newMonth = month
  let newYear = year
  while (newDays <= 0) {
    newMonth--
    if (newMonth <= 0) {
      newMonth = months.length
      newYear--
    }
    newDays += months.find(m => m.index === newMonth).days
  }
  return { day: newDays, month: newMonth, year: newYear }
}

export function addDays ({ day, month, year }, difference) {
  let currentMonth = getMonth({ day, month, year })
  let newDays = day + difference
  let newMonth = month
  let newYear = year
  while (newDays > currentMonth.days) {
    // increase month
    newMonth++
    newDays -= currentMonth.days
    // roll over to new year if necessary
    if (newMonth > months.length) {
      newMonth = 1
      newYear++
    }
    currentMonth = getMonth({ day: 1, month: newMonth, year: newYear })
  }
  return { day: newDays, month: newMonth, year: newYear }
}

export function dateEquals (a, b) {
  return a.day === b.day &&
   a.month === b.month &&
   a.year === b.year
}

// ========== FORMATTERS ==========
export function getDateStrings ({ day, month, year }) {
  const dateError = isDateInvalid({ day, month, year })
  if (dateError) return dateError

  const weekDay = getWeekday({ day, month, year })
  const moonPhase = getMoonphase({ day, month, year })
  const moonSymbol = weekDay.isMoonpasePeak ? moonPhase.symbolPeak : moonPhase.symbol

  return {
    dayName: weekDay.name,
    monthName: months.find(m => m.index === month).name,
    moonPhase: moonPhase.name,
    moonSymbol,
  }
}
export function getFormattedDate ({ day, month, year }, mode = "full") {
  const dateError = isDateInvalid({ day, month, year })
  if (dateError) return dateError

  const {
    dayName,
    monthName,
    moonPhase,
    moonSymbol,
  } = getDateStrings({ day, month, year })

  switch (mode) {
    case "short":
      return `${day}. ${monthName} ${year}, ein ${dayName}.`

    case "full":
    default:
      return `${day}. ${monthName} ${year}, ein ${dayName}. Mondphase: ${moonPhase} ${moonSymbol}`
  }
}

export function getDayPopupString ({ day, month, year }) {
  const {
    dayName,
    monthName,
    moonPhase,
    moonSymbol,
  } = getDateStrings({ day, month, year })

  return `${day}. ${monthName} ${year} <br> ${dayName} <br> ${moonPhase} ${moonSymbol}`
}
