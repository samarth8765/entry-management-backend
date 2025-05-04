import mongoose from 'mongoose';

let isConnected = false;

export const Database = {
  async Loader() {
    if (isConnected) {
      console.info('Already connected to MongoDB');
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    try {
      await mongoose.connect(uri);

      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
        isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.info('MongoDB reconnected');
        isConnected = true;
      });

      console.info('🚀 Connected to MongoDB successfully');
      isConnected = true;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  },

  async Disconnect() {
    if (!isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      console.info('Disconnected from MongoDB');
      isConnected = false;
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
};
