# User Management System

## Tehnologije

**Frontend:**
- React 18 sa TypeScript
- Tailwind CSS
- React Router
- Axios
- React Hook Form

**Backend:**
- Node.js sa Express.js
- MongoDB sa Mongoose
- JWT autentifikacija
- bcrypt za hash-ovanje password-a
- TypeScript

## Implementirano

**Struktura projekta:**
- Kompletna folder struktura za frontend i backend
- Package.json fajlovi sa dependencies
- TypeScript konfiguracije
- Tailwind CSS setup

**Backend:**
- MongoDB modeli (User, Post)
- API routes struktura (auth, users, posts)
- Server setup sa middleware (helmet, cors, rate limiting)
- Database konekcija
- Seed script za test podatke

**Frontend:**
- React komponente i stranice (placeholder)
- AuthContext za upravljanje korisnicima
- Layout komponenta
- Routing setup
- Environment konfiguracija

**Database:**
- MongoDB Atlas konekcija
- User model sa validacijom
- Post model sa populacijom autora
- Seed podaci za testiranje




## Plan naredne implementacije

**Autentifikacija:**
- Registracija i login forme
- JWT token handling
- Protected routes
- Password validacija

**Admin panel:**
- CRUD operacije za korisnike
- Tabela sa pretragom i sortiranjem
- User management interface
- Admin dashboard

**Korisničke funkcionalnosti:**
- Profil stranica sa edit opcijama
- Upload profilnih slika
- Pregled javnih postova

**Bonus funkcionalnosti:**
- Postavljanje objava i uređivanje (admin)
- File upload sistem
- Email notifikacije
- Deployment na Vercel
- DnD Theme (ako bude vremena)