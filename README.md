# GuildKeeper

## Setup

```bash
# Kloniraj repo
git clone <repo-url>
cd eldar-muratovic-praksa

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Portovi

- Backend: http://localhost:5000
- Frontend: http://localhost:3000 
- Promijeni u .env fajlovima ako je potrebno 

## Tehnologije

**Frontend:**
- React 18 sa TypeScript
- Vite - build tool i dev server
- Tailwind CSS - utility-first CSS framework
- React Router Dom - client-side routing
- Axios - HTTP client
- React Hook Form - form validation
- Yup - schema validation
- React Hot Toast - notifications
- Lucide React - icon library

**Backend:**
- Node.js sa Express.js
- TypeScript
- MongoDB sa Mongoose ODM
- JWT (jsonwebtoken) - autentifikacija
- bcryptjs - hash-ovanje password-a
- Multer - file upload middleware
- Helmet - security middleware
- CORS - cross-origin resource sharing
- Express Rate Limit - rate limiting
- Express Validator - request validation
- Dotenv - environment variables

**Development Tools:**
- ESLint - code linting
- Nodemon - auto-restart development server
- ts-node - TypeScript execution

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