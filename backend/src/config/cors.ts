import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: '*', // Allow all origins for now, restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
