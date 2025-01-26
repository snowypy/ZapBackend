import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import coursesRoutes from './routes/coursesRoutes';
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

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/courses', coursesRoutes);

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
