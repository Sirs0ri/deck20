/** Return a promise that resolves after a given time
 * @param {Number} time Time in ms to sleep
 */
export async function sleep (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}
