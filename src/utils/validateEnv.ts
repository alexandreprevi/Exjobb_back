import { cleanEnv, port, str } from 'envalid'

export const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    SERVICE_ACCOUNT: str(),
    FIREBASE_WEB_API_KEY: str(),
  })
}
