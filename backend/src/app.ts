import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import authRoutes from './routes/authRoutes';
import farmerRoutes from './routes/farmerRoutes';
import buyerRoutes from './routes/buyerRoutes';
import clusterRoutes from './routes/clusterRoutes';
import demandRoutes from './routes/demandRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import { env } from './config/env';

const app = express();

// Enable CORS so frontend can communicate
const allowedOrigins = [
  env.CLIENT_URL,            // Your Production URL from .env
  'http://localhost:8080',   // Local development
  'http://localhost:5173'    // Standard Vite port
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('StubbleStock API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/clusters', clusterRoutes);
app.use('/api/demands', demandRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
