import { exportFile } from "quasar"

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

/**
 * Wrap a string in quotes, and replace and quotes (`"`) it containes with doubled quotes (`""`), following the CSV specs. e.g.  `some "value"` becomes `"some ""value"""`.
 * @param {Sting} str Sting to be formatted
 * @returns Formatted string
 */
export const formatAsCsvField = (str) => `"${str.replace("\"", "\"\"")}"`

/**
 *
 * @param {String} fileName
 * @param {[Object]} items List of items - one per row
 * @param {[String]} attributes List of attributes to use as columns, can be recursive, e.g."name" or "postalAddress.country". Will resolve api IDs.
 */
export async function exportAsCsv (fileName, items, attributes) {
  const dataRows = [attributes.map((attr) => formatAsCsvField(attr)).join(";")]

  for (const item of items) {
    const strings = []
    for (const attr of attributes) {
      // Extra check for numbers, otherwise this throws an error
      let attributeValue = item[attr]
      if (typeof attributeValue === "number") {
        attributeValue = attributeValue.toString()
      }
      strings.push(formatAsCsvField(attributeValue))
    }
    dataRows.push(strings.join(";"))
  }

  exportFile(fileName, dataRows.join("\n"), {
    mimeType: "text/csv;charset=UTF-8",
  })
}
