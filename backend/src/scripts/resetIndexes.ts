import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import Post from '../models/Post';

dotenv.config();

const resetPostIndexes = async () => {
  try {
    await connectDB();
    
    console.log('Brišem postojeće indexe...');
    
    // Obriši sve indexe osim _id (koji se ne može obrisati)
    await Post.collection.dropIndexes();
    
    console.log('Postojeći indexi obrisani.');
    
    // Kreiraj nove indexe
    console.log('Kreiram nove indexe...');
    
    await Post.collection.createIndex({ naslov: 'text', tekst: 'text' });
    await Post.collection.createIndex({ kategorije: 1 });
    await Post.collection.createIndex({ tagovi: 1 });
    await Post.collection.createIndex({ autor: 1 });
    await Post.collection.createIndex({ createdAt: -1 });
    await Post.collection.createIndex({ tip: 1 });
    await Post.collection.createIndex({ status: 1 });
    
    console.log('Novi indexi kreirani uspješno!');
    console.log('Možete sada da testirate kreiranje kampanja.');
    
    process.exit(0);
  } catch (error) {
    console.error('Greška pri resetovanju indexa:', error);
    process.exit(1);
  }
};

resetPostIndexes(); 