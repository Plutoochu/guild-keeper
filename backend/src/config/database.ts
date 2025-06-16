import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI nije definisan u environment varijablama');
    }

    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB konekcija uspješna: ${conn.connection.host}`);
  } catch (error) {
    console.error('Greška pri konekciji sa MongoDB:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB konekcija zatvorena.');
  process.exit(0);
}); 