import { config } from 'dotenv';
import mongoose from 'mongoose';

if (process.env.NODE_ENV !== 'production') config();

const { MongoURI } = process.env;

if (!MongoURI ) {
  throw new Error('MongoDB URI not found in environment variable!');
}

const options: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// CONNECT TO DATABASE
export const connectToDatabase = async () => {
  try {
    await mongoose.connect( MongoURI, options );
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

// DISCONNECT FROM DATABASE
export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB!');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB:', error);
  }
};