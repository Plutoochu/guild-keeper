import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/users/${id}`);
      
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Greška pri učitavanju korisnika:', error);
      setError('Greška pri učitavanju korisnika');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  
  const toggleRole = async () => {
    if (!user) return;
    
    try {
      const response = await axios.put(`/users/${user._id}/toggle-role`);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Greška pri mijenjanju uloge:', error);
    }
  };

  
  const toggleStatus = async () => {
    if (!user) return;
    
    try {
      const response = await axios.put(`/users/${user._id}/toggle-status`);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Greška pri mijenjanju statusa:', error);
    }
  };

  
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('bs-BA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  
  const calculateAge = (birthDate: Date | string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Učitavanje korisnika...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Korisnik nije pronađen'}</div>
          <button
            onClick={() => navigate('/users')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Nazad na listu
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser?.tip === 'admin';
  const canEdit = isAdmin || currentUser?._id === user._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(isAdmin ? '/users' : '/')}
            className="flex items-center text-white hover:text-purple-200"
          >
            ← Nazad na {isAdmin ? 'listu korisnika' : 'početnu'}
          </button>
          
          {isAdmin && (
            <div className="flex space-x-2">
              <button
                onClick={toggleRole}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                {user.tip === 'admin' ? 'Ukloni Admin' : 'Napravi Admin'}
              </button>
              <button
                onClick={toggleStatus}
                className={`px-4 py-2 rounded-lg text-white ${
                  user.aktivan 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {user.aktivan ? 'Deaktiviraj' : 'Aktiviraj'}
              </button>
            </div>
          )}
        </div>

        {}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8">
          <div className="flex items-start space-x-6 mb-8">
            {}
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user.ime.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-3xl font-bold text-white">
                  {user.ime} {user.prezime}
                </h1>
                
                {}
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user.tip === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.tip === 'admin' ? '👑 Administrator' : '👤 Korisnik'}
                </span>
                
                {}
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user.aktivan 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.aktivan ? '✅ Aktivan' : '❌ Neaktivan'}
                </span>
              </div>
              
              <p className="text-purple-200 text-lg mb-2">
                📧 {user.email}
              </p>
              
              {user.datumRodjenja && (
                <p className="text-purple-200">
                  🎂 {calculateAge(user.datumRodjenja)} godina ({formatDate(user.datumRodjenja).split(',')[0]})
                </p>
              )}
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                📋 Lični podaci
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-purple-200">Ime</label>
                  <div className="text-white font-medium">{user.ime}</div>
                </div>
                
                <div>
                  <label className="text-sm text-purple-200">Prezime</label>
                  <div className="text-white font-medium">{user.prezime || 'N/A'}</div>
                </div>
                
                <div>
                  <label className="text-sm text-purple-200">Spol</label>
                  <div className="text-white font-medium">
                    {user.spol ? (
                      user.spol === 'muški' ? '♂️ Muški' :
                      user.spol === 'ženski' ? '♀️ Ženski' : '⚧️ Ostalo'
                    ) : 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-purple-200">Datum rođenja</label>
                  <div className="text-white font-medium">
                    {user.datumRodjenja ? formatDate(user.datumRodjenja).split(',')[0] : 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-purple-200">Godine</label>
                  <div className="text-white font-medium">
                    {user.datumRodjenja ? calculateAge(user.datumRodjenja) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                🔐 Informacije o računu
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-purple-200">Email adresa</label>
                  <div className="text-white font-medium">{user.email}</div>
                </div>
                
                <div>
                  <label className="text-sm text-purple-200">Tip računa</label>
                  <div className="text-white font-medium">
                    {user.tip === 'admin' ? '👑 Administrator' : '👤 Obični korisnik'}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-purple-200">Status računa</label>
                  <div className="text-white font-medium">
                    {user.aktivan ? '✅ Aktivan' : '❌ Neaktivan'}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-purple-200">Registrovan</label>
                  <div className="text-white font-medium">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-purple-200">Poslednja ažuriranost</label>
                  <div className="text-white font-medium">
                    {formatDate(user.updatedAt)}
                  </div>
                </div>
                
                {user.poslednjaPrijava && (
                  <div>
                    <label className="text-sm text-purple-200">Poslednja prijava</label>
                    <div className="text-white font-medium">
                      {formatDate(user.poslednjaPrijava)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {}
          {canEdit && (
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate(currentUser?._id === user._id ? `/profile` : `/users/${user._id}/edit`)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                ✏️ Uredi profil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage; 