import fetch from 'node-fetch'

export const fetchBody = async (url, options) => {
  const external = await fetch(url, options)
  return external.text()
}
