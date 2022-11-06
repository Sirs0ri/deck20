export async function readFile (fileHandle) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = evt => {
      resolve(evt.target.result)
    }

    reader.onerror = evt => reject(evt)

    reader.readAsText(fileHandle)
  })
}

export function parseXML (stringContents) {
  const parser = new DOMParser()

  const doc = parser.parseFromString(stringContents, "application/xml")
  // print the name of the root element or error message
  const errorNode = doc.querySelector("parsererror")
  if (errorNode) {
    return null
  } else {
    return doc.documentElement
  }
}
