import fetch from 'node-fetch'

import { API_ROOT } from './config.js'

export const externalAPI = async (endpoint, options) => {
  const external = await fetch(`${API_ROOT}${endpoint}`, options)
  return external.text()
}
