import { CorsOptions } from 'cors';
import dotenv from 'dotenv';
dotenv.config();
 
export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [process.env.FRONTEND_URL];
    const allowUndefined = process.env.NODE_ENV === 'production';
    if (whiteList.includes(origin) || (allowUndefined && origin === undefined)) {
      callback(null, true);
    } else {
      callback(new Error(`Error de CORS -> origin: ${origin} - whitelist: ${whiteList.join(', ')}`));
    }
  },
  credentials: true,
};