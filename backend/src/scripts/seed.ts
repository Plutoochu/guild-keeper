import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';
import Post from '../models/Post';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    console.log('Pokretanje seed proces...');
    
    await connectDB();
    
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Postojeći podaci obrisani');
    
    const adminUser = await User.create({
      ime: 'Admin',
      prezime: 'Administrator',
      email: 'admin@test.com',
      password: 'admin123',
      datumRodjenja: new Date('1990-01-01'),
      spol: 'muški',
      tip: 'admin'
    });
    
    const users = await User.create([
      {
        ime: 'Marko',
        prezime: 'Marković',
        email: 'marko@test.com',
        password: 'marko123',
        datumRodjenja: new Date('1995-05-15'),
        spol: 'muški',
        tip: 'user'
      },
      {
        ime: 'Ana',
        prezime: 'Anić',
        email: 'ana@test.com',
        password: 'ana123',
        datumRodjenja: new Date('1992-08-20'),
        spol: 'ženski',
        tip: 'user'
      },
      {
        ime: 'Petra',
        prezime: 'Petrović',
        email: 'petra@test.com',
        password: 'petra123',
        datumRodjenja: new Date('1988-12-10'),
        spol: 'ženski',
        tip: 'user'
      }
    ]);
    
    const posts = await Post.create([
      {
        naslov: 'Dobrodošli na našu platformu!',
        tekst: 'Ovo je prvi post na našoj novoj platformi za upravljanje korisnicima. Nadamo se da ćete uživati u korištenju naših funkcionalnosti.',
        autor: adminUser._id
      },
      {
        naslov: 'Nove funkcionalnosti uskoro!',
        tekst: 'Radimo na implementaciji novih funkcionalnosti koje će vam olakšati rad. Ostavite nam feedback!',
        autor: adminUser._id
      },
      {
        naslov: 'Pravila korištenja platforme',
        tekst: 'Molimo sve korisnike da se pridržavaju pravila korištenja naše platforme. Poštovanje i ljubaznost su ključni.',
        autor: adminUser._id
      }
    ]);
    
    console.log('Seed podaci uspješno dodani:');
    console.log(`Korisnici: ${users.length + 1}`);
    console.log(`Postovi: ${posts.length}`);
    console.log('\nTest korisnici:');
    console.log('Admin: admin@test.com / admin123');
    console.log('Marko: marko@test.com / marko123');
    console.log('Ana: ana@test.com / ana123');
    console.log('Petra: petra@test.com / petra123');
    
    process.exit(0);
  } catch (error) {
    console.error('Greška prilikom seed procesa:', error);
    process.exit(1);
  }
};

seedData(); 