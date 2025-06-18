import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';
import { 
  Shield, 
  Users, 
  MapPin, 
  Calendar, 
  Search, 
  Filter,
  Sword,
  Crown,
  BookOpen,
  Scroll,
  Zap
} from 'lucide-react';

const PostsPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    tip: '',
    status: '',
    kategorije: '',
    minLevel: '',
    maxLevel: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    postsPerPage: 10
  });

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filters.tip) params.append('tip', filters.tip);
      if (filters.status) params.append('status', filters.status);
      if (filters.kategorije) params.append('kategorije', filters.kategorije);
      if (filters.minLevel) params.append('minLevel', filters.minLevel);
      if (filters.maxLevel) params.append('maxLevel', filters.maxLevel);

      const response = await axios.get(`/posts?${params}`);
      setPosts(response.data.data.posts);
      setPagination(response.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška pri učitavanju kampanja');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getTypeIcon = (tip: string) => {
    switch (tip) {
      case 'campaign': return <Crown className="w-5 h-5 text-yellow-600" />;
      case 'adventure': return <Sword className="w-5 h-5 text-red-600" />;
      case 'tavern-tale': return <Users className="w-5 h-5 text-green-600" />;
      case 'quest': return <Zap className="w-5 h-5 text-purple-600" />;
      default: return <Scroll className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      planning: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      'on-hold': 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (tip: string) => {
    const labels = {
      campaign: 'Campaign',
      adventure: 'Adventure',
      'tavern-tale': 'Tavern Story',
      quest: 'Quest'
    };
    return labels[tip as keyof typeof labels] || tip;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      planning: 'Planiranje',
      active: 'Aktivno',
      completed: 'Završeno',
      'on-hold': 'Pauzirano'
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-white">Učitavaju se kampanje...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-yellow-400" />
              Campaign Chronicles
            </h1>
            <p className="text-blue-200">Istražite epske avanture i pridružite se legendama</p>
          </div>
          
          {user?.tip === 'admin' && (
            <Link
              to="/admin/posts/new"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
            >
              <Crown className="w-5 h-5 mr-2" />
              Nova Kampanja
            </Link>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Pretražite kampanje..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            <select
              value={filters.tip}
              onChange={(e) => handleFilterChange('tip', e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="" className="bg-gray-800 text-white">Svi tipovi</option>
              <option value="campaign" className="bg-gray-800 text-white">Campaign</option>
              <option value="adventure" className="bg-gray-800 text-white">Adventure</option>
              <option value="tavern-tale" className="bg-gray-800 text-white">Tavern Story</option>
              <option value="quest" className="bg-gray-800 text-white">Quest</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="" className="bg-gray-800 text-white">Svi statusi</option>
              <option value="planning" className="bg-gray-800 text-white">Planiranje</option>
              <option value="active" className="bg-gray-800 text-white">Aktivno</option>
              <option value="completed" className="bg-gray-800 text-white">Završeno</option>
              <option value="on-hold" className="bg-gray-800 text-white">Pauzirano</option>
            </select>

            <input
              type="number"
              placeholder="Min Level"
              value={filters.minLevel}
              onChange={(e) => handleFilterChange('minLevel', e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              min="1"
              max="20"
            />

            <input
              type="number"
              placeholder="Max Level"
              value={filters.maxLevel}
              onChange={(e) => handleFilterChange('maxLevel', e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              min="1"
              max="20"
            />
          </form>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getTypeIcon(post.tip)}
                  <span className="ml-2 text-sm font-medium text-gray-300">
                    {getTypeLabel(post.tip)}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(post.status)}`}>
                  {getStatusLabel(post.status)}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                {post.naslov}
              </h3>

              <p className="text-gray-300 mb-4 line-clamp-3">
                {post.tekst}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Nivo {post.level.min}-{post.level.max}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {post.igraci.min}-{post.igraci.max} igrača
                </span>
              </div>

              {post.lokacija && (
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {post.lokacija}
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-4">
                {post.kategorije.slice(0, 3).map((kategorija, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full"
                  >
                    {kategorija}
                  </span>
                ))}
                {post.kategorije.length > 3 && (
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                    +{post.kategorije.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.createdAt).toLocaleDateString('bs-BA')}
                </div>
                <Link
                  to={`/posts/${post._id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Detalji
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center text-sm text-gray-400">
                  <span>DM: {post.autor.ime} {post.autor.prezime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Scroll className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg mb-2">Nema kampanja za prikazati</p>
            <p className="text-gray-400">Pokušajte s drugim filterima ili pretragom</p>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchPosts(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    page === pagination.currentPage
                      ? 'bg-yellow-500 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage; 