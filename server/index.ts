import express, { Request, Response } from 'express';
import twitterRoutes from './routes/twitterRoute';
import userRoutes from './routes/userRoutes';
import betRoutes from './routes/betRoutes';
import faucetRouets from "./routes/faucetRoutes";
import connectDB from './config/db';
import marketRoutes from './routes/marketRoute';
import cors from 'cors';
import dotenv from 'dotenv';
import { getOrCreateUser } from './services/userService';
dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(async (req, res, next) => {
  const userAddress = req.headers['x-user-address'] as string;
  
  if (!userAddress) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // In a real app, you would verify signatures here
  await getOrCreateUser(userAddress);
  req.body.userAddress = userAddress;
  next();
});



app.use('/api', twitterRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/users', userRoutes);
app.use('/api/faucet', faucetRouets);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

app.get('/', (_: Request, res: Response) => {
  res.send('gm gm! api is running');
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
