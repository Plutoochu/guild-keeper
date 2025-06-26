import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from '../models/Category';
import Tag from '../models/Tag';
import { connectDB } from '../config/database';

dotenv.config();

const dndCategories = [
  {
    naziv: 'Kampanje',
    opis: 'Dugotrajne D&D kampanje sa više sesija',
    boja: '#8B5CF6'
  },
  {
    naziv: 'One-Shots',
    opis: 'Kratke avanture koje se završavaju u jednoj sesiji',
    boja: '#10B981'
  },
  {
    naziv: 'Homebrew',
    opis: 'Prilagođeni sadržaj kreiran od strane zajednice',
    boja: '#F59E0B'
  },
  {
    naziv: 'Oficijalni Moduli',
    opis: 'Oficijalni D&D moduli i avanture',
    boja: '#EF4444'
  },
  {
    naziv: 'Karakteri',
    opis: 'Kreiranje i razvoj karaktera',
    boja: '#3B82F6'
  },
  {
    naziv: 'Pravila',
    opis: 'Diskusije o pravilima i mehanikama',
    boja: '#6B7280'
  },
  {
    naziv: 'Resursi',
    opis: 'Korisni resursi za DM-ove i igrače',
    boja: '#06B6D4'
  }
];

const dndTags = [
  { naziv: 'Nivo 1-5', opis: 'Za početnike', boja: '#10B981' },
  { naziv: 'Nivo 6-10', opis: 'Srednji nivo', boja: '#F59E0B' },
  { naziv: 'Nivo 11-15', opis: 'Visoki nivo', boja: '#EF4444' },
  { naziv: 'Nivo 16-20', opis: 'Epski nivo', boja: '#8B5CF6' },
  
  
  { naziv: 'Fantasy', opis: 'Tradicionalni fantasy', boja: '#8B5CF6' },
  { naziv: 'Horror', opis: 'Strašni elementi', boja: '#000000' },
  { naziv: 'Mystery', opis: 'Misterija i istraga', boja: '#4B5563' },
  { naziv: 'Avantura', opis: 'Akcija i istraživanje', boja: '#10B981' },
  { naziv: 'Politika', opis: 'Politički intriga', boja: '#DC2626' },
  { naziv: 'Dungeon Crawl', opis: 'Istraživanje tamnica', boja: '#92400E' },
  
  
  { naziv: 'Roleplay Heavy', opis: 'Fokus na ulogu', boja: '#3B82F6' },
  { naziv: 'Combat Heavy', opis: 'Fokus na borbu', boja: '#DC2626' },
  { naziv: 'Exploration', opis: 'Fokus na istraživanje', boja: '#059669' },
  { naziv: 'Social', opis: 'Društvena interakcija', boja: '#7C3AED' },
  
  
  { naziv: 'Lagano', opis: 'Opuštena atmosfera', boja: '#10B981' },
  { naziv: 'Umjereno', opis: 'Balansirana težina', boja: '#F59E0B' },
  { naziv: 'Teško', opis: 'Visoka težina', boja: '#EF4444' },
  { naziv: 'Smrtonosno', opis: 'Ekstremno teško', boja: '#7F1D1D' },
  
  
  { naziv: 'Forgotten Realms', opis: 'Klasični D&D svet', boja: '#3B82F6' },
  { naziv: 'Eberron', opis: 'Magitech fantasy', boja: '#7C2D12' },
  { naziv: 'Ravenloft', opis: 'Gothic horror', boja: '#1F2937' },
  { naziv: 'Homebrew Setting', opis: 'Prilagođeni svet', boja: '#F59E0B' },
  
  
  { naziv: 'Newbie Friendly', opis: 'Pogodno za početnike', boja: '#10B981' },
  { naziv: 'Experienced Only', opis: 'Samo za iskusne', boja: '#DC2626' },
  { naziv: 'Mature Content', opis: 'Sadržaj za odrasle', boja: '#7F1D1D' }
];

const seedCategoriesAndTags = async () => {
  try {
    await connectDB();
    console.log('Povezan sa bazom podataka...');

    
    await Category.deleteMany({});
    await Tag.deleteMany({});
    console.log('Obrisane postojeće kategorije i tagovi...');

    
    const categories = await Category.insertMany(dndCategories);
    console.log(`Dodano ${categories.length} kategorija`);

    
    const tags = await Tag.insertMany(dndTags);
    console.log(`Dodano ${tags.length} tagova`);

    console.log('Seed završen uspješno!');
    process.exit(0);
  } catch (error) {
    console.error('Greška pri seed-u:', error);
    process.exit(1);
  }
};


if (require.main === module) {
  seedCategoriesAndTags();
}

export default seedCategoriesAndTags; 