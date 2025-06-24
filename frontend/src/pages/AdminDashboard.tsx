import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Users, FileText, Plus, BarChart3, ArrowRight, Construction } from 'lucide-react';
import AddUserModal from '../components/AddUserModal';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    ukupniKorisnici: 0,
    aktivniKorisnici: 0,
    admini: 0,
    ukupniPostovi: 0,
    aktivniPostovi: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

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
      title: 'Upravljanje Korisnicima',
      description: 'Pregled, uređivanje i upravljanje korisnicima',
      link: '/users',
      color: 'from-purple-500 to-pink-500',
      stats: `${stats.ukupniKorisnici} korisnika (${stats.admini} admina)`,
      icon: Users
    },
    {
      title: 'Upravljanje Postovima',
      description: 'Moderiraj kampanje i postove',
      link: '/posts',
      color: 'from-blue-500 to-cyan-500',
      stats: `${stats.ukupniPostovi} postova`,
      icon: FileText
    },
    {
      title: 'Kreiraj Post',
      description: 'Dodaj novu kampanju ili post',
      link: '/create-post',
      color: 'from-green-500 to-emerald-500',
      stats: 'Kreiranje sadržaja',
      icon: Plus
    },
    {
      title: 'Sistem Statistike',
      description: 'Pregled analitike i izvještaja',
      link: '#',
      color: 'from-orange-500 to-red-500',
      stats: 'Uskoro dostupno',
      disabled: true,
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen bg-white p-6">
              <div className="max-w-7xl mx-auto">
          {/* Naslov stranice */}
          <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Vladajte svojim digitalnim carstvom
          </p>
          
          {/* Dugme za dodavanje korisnika */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <UserPlus size={20} />
              Dodaj novog korisnika
            </button>
          </div>
        </div>

        {/* Statistike sistema */}
        {loading ? (
          <div className="text-center mb-12">
            <div className="text-gray-800 text-lg">Učitavanje statistika...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{stats.ukupniKorisnici}</div>
                <div className="text-gray-600">Ukupno korisnika</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.aktivniKorisnici}</div>
                <div className="text-gray-600">Aktivni korisnici</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.admini}</div>
                <div className="text-gray-600">Administratori</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.ukupniPostovi}</div>
                <div className="text-gray-600">Ukupno postova</div>
              </div>
            </div>
          </div>
        )}

        {/* Admin opcije i navigacija */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adminActions.map((action, index) => {
            let hoverColorClass = '';
            switch(index) {
              case 0: hoverColorClass = 'hover:border-purple-500 hover:bg-purple-50'; break;
              case 1: hoverColorClass = 'hover:border-blue-500 hover:bg-blue-50'; break;
              case 2: hoverColorClass = 'hover:border-green-500 hover:bg-green-50'; break;
              case 3: hoverColorClass = 'hover:border-orange-500 hover:bg-orange-50'; break;
              default: hoverColorClass = 'hover:border-blue-500 hover:bg-blue-50'; break;
            }

            const IconComponent = action.icon;
            
            return action.disabled ? (
              <div key={index} className="opacity-50 cursor-not-allowed">
                <div className="bg-gray-100 border border-gray-200 p-8 rounded-lg shadow-sm text-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-8 h-8 text-gray-500" />
                      <h3 className="text-2xl font-bold">{action.title}</h3>
                    </div>
                    <Construction className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg mb-4">{action.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{action.stats}</span>
                    <span className="text-sm bg-gray-300 px-3 py-1 rounded-full">
                      Uskoro
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <Link key={index} to={action.link} className="transform hover:scale-105 transition-transform duration-200">
                <div className={`bg-white border border-gray-200 ${hoverColorClass} p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 text-gray-800`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-8 h-8 text-gray-600" />
                      <h3 className="text-2xl font-bold">{action.title}</h3>
                    </div>
                    <ArrowRight className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg mb-4">{action.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{action.stats}</span>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                      Otvori
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={fetchStats}
        />
      </div>
    </div>
  );
};

export default AdminDashboard; 