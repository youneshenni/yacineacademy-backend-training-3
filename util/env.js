import {config} from 'dotenv';
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV.trim() === "development") config();