import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    ukupniKorisnici: 0,
    aktivniKorisnici: 0,
    admini: 0,
    ukupniPostovi: 0,
    aktivniPostovi: 0
  });
  const [loading, setLoading] = useState(true);

  
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      
      const usersResponse = await axios.get('/users?limit=1');
      if (usersResponse.data.success) {
        const userStats = usersResponse.data.data.stats;
        setStats(prev => ({
          ...prev,
          ukupniKorisnici: userStats.ukupno,
          aktivniKorisnici: userStats.aktivni,
          admini: userStats.admini
        }));
      }

      
      const postsResponse = await axios.get('/posts?limit=1');
      if (postsResponse.data.success) {
        setStats(prev => ({
          ...prev,
          ukupniPostovi: postsResponse.data.data.pagination.totalPosts || 0,
          aktivniPostovi: postsResponse.data.data.posts?.length || 0
        }));
      }
    } catch (error) {
      console.error('Greška pri učitavanju statistika:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const adminActions = [
    {
      title: '👥 Upravljanje Korisnicima',
      description: 'Pregled, uređivanje i upravljanje korisnicima',
      link: '/users',
      color: 'from-purple-500 to-pink-500',
      stats: `${stats.ukupniKorisnici} korisnika (${stats.admini} admina)`
    },
    {
      title: '📜 Upravljanje Postovima',
      description: 'Moderiraj kampanje i postove',
      link: '/posts',
      color: 'from-blue-500 to-cyan-500',
      stats: `${stats.ukupniPostovi} postova`
    },
    {
      title: '➕ Kreiraj Post',
      description: 'Dodaj novu kampanju ili post',
      link: '/create-post',
      color: 'from-green-500 to-emerald-500',
      stats: 'Kreiranje sadržaja'
    },
    {
      title: '📊 Sistem Statistike',
      description: 'Pregled analitike i izvještaja',
      link: '#',
      color: 'from-orange-500 to-red-500',
      stats: 'Uskoro dostupno',
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            👑 Admin Dashboard
          </h1>
          <p className="text-xl text-purple-200">
            Vladajte svojim digitalnim carstvom
          </p>
        </div>

        {}
        {loading ? (
          <div className="text-center mb-12">
            <div className="text-white text-lg">Učitavanje statistika...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.ukupniKorisnici}</div>
                <div className="text-purple-200">Ukupno korisnika</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{stats.aktivniKorisnici}</div>
                <div className="text-purple-200">Aktivni korisnici</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{stats.admini}</div>
                <div className="text-purple-200">Administratori</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.ukupniPostovi}</div>
                <div className="text-purple-200">Ukupno postova</div>
              </div>
            </div>
          </div>
        )}

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adminActions.map((action, index) => (
            action.disabled ? (
              <div key={index} className="opacity-50 cursor-not-allowed">
                <div className={`bg-gradient-to-r ${action.color} p-8 rounded-lg shadow-lg text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">{action.title}</h3>
                    <span className="text-3xl opacity-50">🚧</span>
                  </div>
                  <p className="text-lg mb-4 opacity-75">{action.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-75">{action.stats}</span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      Uskoro
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <Link key={index} to={action.link} className="transform hover:scale-105 transition-transform duration-200">
                <div className={`bg-gradient-to-r ${action.color} p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">{action.title}</h3>
                    <span className="text-3xl">→</span>
                  </div>
                  <p className="text-lg mb-4">{action.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">{action.stats}</span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">
                      Otvori
                    </span>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>




      </div>
    </div>
  );
};

export default AdminDashboard; 