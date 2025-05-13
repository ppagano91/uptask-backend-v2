import { CorsOptions } from 'cors';
import dotenv from 'dotenv';
dotenv.config();

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [process.env.FRONTEND_URL];
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Error de CORS -> origin: ${origin} - whitelist: ${whiteList}`));
    }
  },
  credentials: true,
};