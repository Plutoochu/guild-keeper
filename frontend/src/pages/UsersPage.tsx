import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, UsersResponse, UserFilters, BulkAction } from '../types';

const UsersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    tip: '',
    aktivan: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  
  const [stats, setStats] = useState({
    ukupno: 0,
    aktivni: 0,
    admini: 0,
    obicniKorisnici: 0
  });

  
  useEffect(() => {
    if (!user || user.tip !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.search && { search: filters.search }),
        ...(filters.tip && { tip: filters.tip }),
        ...(filters.aktivan !== '' && filters.aktivan !== undefined && { aktivan: filters.aktivan.toString() }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder })
      });

      const response = await axios.get<UsersResponse>(`/users?${params}`);
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setCurrentPage(response.data.data.pagination.currentPage);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalUsers(response.data.data.pagination.totalUsers);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Greška pri učitavanju korisnika:', error);
      setError('Greška pri učitavanju korisnika');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [filters, currentPage]);

  
  const toggleRole = async (userId: string) => {
    try {
      const response = await axios.put(`/users/${userId}/toggle-role`);
      if (response.data.success) {
        fetchUsers(currentPage);
      }
    } catch (error) {
      console.error('Greška pri mijenjanju uloge:', error);
    }
  };

  
  const toggleStatus = async (userId: string) => {
    try {
      const response = await axios.put(`/users/${userId}/toggle-status`);
      if (response.data.success) {
        fetchUsers(currentPage);
      }
    } catch (error) {
      console.error('Greška pri mijenjanju statusa:', error);
    }
  };

  
  const handleBulkAction = async (action: BulkAction['action']) => {
    if (selectedUsers.size === 0) return;

    const confirmMessages = {
      activate: 'Aktivirati označene korisnike?',
      deactivate: 'Deaktivirati označene korisnike?',
      delete: 'OBRISATI označene korisnike? Ova akcija se ne može poništiti!',
      makeAdmin: 'Promijenit označene korisnike u administratore?',
      makeUser: 'Promijenit označene korisnike u obične korisnike?'
    };

    if (!window.confirm(confirmMessages[action])) return;

    try {
      setBulkLoading(true);
      const bulkData: BulkAction = {
        userIds: Array.from(selectedUsers),
        action
      };

      const response = await axios.post('/users/bulk-actions', bulkData);
      
      if (response.data.success) {
        setSelectedUsers(new Set());
        fetchUsers(currentPage);
      }
    } catch (error) {
      console.error('Greška pri bulk operaciji:', error);
    } finally {
      setBulkLoading(false);
    }
  };

  
  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user._id)));
    }
  };

  
  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('bs-BA');
  };

  if (!user || user.tip !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Naslov stranice za upravljanje korisnicima */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            ⚔️ Upravljanje Korisnicima
          </h1>
          <p className="text-xl text-purple-200">
            Administracija korisnika - Upravlja svojim carstvom
          </p>
        </div>

        {/* Statistike korisnika */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.ukupno}</div>
              <div className="text-purple-200">Ukupno korisnika</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{stats.aktivni}</div>
              <div className="text-purple-200">Aktivni</div>
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
              <div className="text-3xl font-bold text-blue-400">{stats.obicniKorisnici}</div>
              <div className="text-purple-200">Obični korisnici</div>
            </div>
          </div>
        </div>

        {/* Filteri za pretraživanje korisnika */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Pretraži
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Ime, prezime ili email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tip korisnika
              </label>
              <select
                value={filters.tip || ''}
                onChange={(e) => handleFilterChange('tip', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Svi tipovi</option>
                <option value="admin">Administratori</option>
                <option value="user">Obični korisnici</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Status
              </label>
              <select
                value={filters.aktivan?.toString() || ''}
                onChange={(e) => handleFilterChange('aktivan', e.target.value === '' ? '' : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Svi statusi</option>
                <option value="true">Aktivni</option>
                <option value="false">Neaktivni</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Sortiraj po
              </label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="createdAt">Datum kreiranja</option>
                <option value="ime">Ime</option>
                <option value="email">Email</option>
                <option value="poslednjaPrijava">Poslednja prijava</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk akcije za označene korisnike */}
        {selectedUsers.size > 0 && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-white">
                Označeno: {selectedUsers.size} korisnika
              </span>
              <button
                onClick={() => handleBulkAction('activate')}
                disabled={bulkLoading}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Aktiviraj
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                disabled={bulkLoading}
                className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
              >
                Deaktiviraj
              </button>
              <button
                onClick={() => handleBulkAction('makeAdmin')}
                disabled={bulkLoading}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Napravi Admin
              </button>
              <button
                onClick={() => handleBulkAction('makeUser')}
                disabled={bulkLoading}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Napravi User
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={bulkLoading}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Obriši
              </button>
            </div>
          </div>
        )}

        {/* Tabela sa korisnicima */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center p-8">
              <div className="text-white">Učitavanje korisnika...</div>
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <div className="text-red-400">{error}</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/20">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.size === users.length && users.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Korisnik
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Kreiran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Akcije
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user._id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedUsers);
                            if (e.target.checked) {
                              newSelected.add(user._id);
                            } else {
                              newSelected.delete(user._id);
                            }
                            setSelectedUsers(newSelected);
                          }}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                              <span className="text-white font-bold">
                                {user.ime.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {user.ime} {user.prezime}
                            </div>
                            <div className="text-sm text-gray-300">
                              {user.spol && user.spol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.tip === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.tip === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.aktivan 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.aktivan ? 'Aktivan' : 'Neaktivan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/users/${user._id}`)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => toggleRole(user._id)}
                            className="text-purple-400 hover:text-purple-300"
                            title="Promijeni ulogu"
                          >
                            ⚡
                          </button>
                          <button
                            onClick={() => toggleStatus(user._id)}
                            className={user.aktivan ? "text-orange-400 hover:text-orange-300" : "text-green-400 hover:text-green-300"}
                            title={user.aktivan ? "Deaktiviraj" : "Aktiviraj"}
                          >
                            {user.aktivan ? '🔒' : '🔓'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50"
              >
                Prethodna
              </button>
              <span className="px-4 py-2 text-white">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50"
              >
                Sljedeća
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage; 