import { CorsOptions } from 'cors';
import dotenv from 'dotenv';
dotenv.config();
 
export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [process.env.FRONTEND_URL];
    console.log(">>",process.env.FRONTEND_URL); 
    if (process.argv[2] == '--api') {
      whiteList.push(undefined);
    }
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Error de CORS -> origin: ${origin} - whitelist: ${process.env.FRONTEND_URL}`));
    }
  },
};