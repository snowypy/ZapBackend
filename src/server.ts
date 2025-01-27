import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import courseRoutes from './routes/courseRoutes';
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

interface CustomConnectOptions extends ConnectOptions {
  useUnifiedTopology?: boolean;
}

const app = express();
const PORT = process.env.PORT || 3000;

const mongoUri = process.env.MONGO_URI || '';

mongoose.connect(mongoUri, {
  useUnifiedTopology: true,
} as CustomConnectOptions).then(() => {
  console.log('db connected');
}).catch(err => {
  console.error('couldn\'t connect to db', err);
});

app.use(bodyParser.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/courses', courseRoutes);

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
