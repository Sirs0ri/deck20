/** Return a promise that resolves after a given time
 * @param {Number} time Time in ms to sleep
 */
export async function sleep (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

/** Format a timestamp into date and/or time
 * @param {number} timestamp Unix Timestamp in ms
 * @param {("date"|"time"|undefined)} format date, time, or nothing for date + time
 * @returns Formatted String
 */
export function formatDate (timestamp, format = undefined) {
  switch (format) {
    case "date":
      return new Date(timestamp).toLocaleDateString()
    case "time":
      return new Date(timestamp).toLocaleTimeString()
    default:
      return new Date(timestamp).toLocaleString()
  }
}
