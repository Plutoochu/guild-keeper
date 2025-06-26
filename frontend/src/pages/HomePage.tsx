import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Settings, BookOpen, LogIn, Swords } from 'lucide-react';

const HomePage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Swords className="h-8 w-8 text-slate-900" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Dobrodošli u GuildKeeper
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Vaš alat za upravljanje herojima i avanturama
          </p>
          
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Počnite sada
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Prijava
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upravljanje herojima</h3>
            <p className="text-gray-600">
              Organizirajte svoje članove i pratite njihove aktivnosti
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Kampanje & Avanture</h3>
            <p className="text-gray-600">
              Kreirajte i upravljajte epskim avanturama za vaš guild
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Admin kontrole</h3>
            <p className="text-gray-600">
              Potpuna kontrola nad guildom za Dungeon Mastera
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Dobrodošli nazad, {user?.ime}!
        </h1>
        <p className="text-gray-600">
          {isAdmin ? 'Upravljajte svojim guildom kao pravi Dungeon Master!' : 'Tvoja legenda počinje ovdje!'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAdmin && (
          <Link
            to="/admin"
            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <Shield className="h-8 w-8 mb-3 text-purple-500" />
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Admin Panel</h3>
            <p className="text-gray-600">
              Upravljanje guildom i članovima
            </p>
          </Link>
        )}

        <Link
          to="/posts"
          className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:border-orange-500 hover:bg-orange-50 transition-all"
        >
          <BookOpen className="h-8 w-8 mb-3 text-orange-500" />
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Objave i avanture</h3>
          <p className="text-gray-600">
            Pregledajte najnovije objave
          </p>
        </Link>

        <Link
          to="/profile"
          className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:border-green-500 hover:bg-green-50 transition-all"
        >
          <Settings className="h-8 w-8 mb-3 text-green-500" />
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Moj profil</h3>
          <p className="text-gray-600">
            Uredite svoje korisničke podatke
          </p>
        </Link>

        {!isAdmin && (
          <div className="bg-gray-100 p-6 rounded-lg shadow border-2 border-dashed border-gray-300">
            <LogIn className="h-8 w-8 mb-3 text-gray-400" />
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Dungeon Master</h3>
            <p className="text-gray-500">
              Kontaktirajte administratora za Dungeon Master prava
            </p>
          </div>
        )}
      </div>


    </div>
  );
};

export default HomePage; 