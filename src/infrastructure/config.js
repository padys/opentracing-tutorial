export const APP_PORT = Number(process.env.PORT)

// API allways on port greater by one
export const API_ROOT = `http://127.0.0.1:${APP_PORT + 1}`