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
  Zap,
  MessageCircle,
  Megaphone,
  FileText
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
    kategorijaObjave: '', 
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
      if (filters.kategorijaObjave) params.append('kategorijaObjave', filters.kategorijaObjave);
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
      case 'discussion': return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'announcement': return <Megaphone className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
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
      'tavern-tale': 'Tavern Priča',
      quest: 'Quest',
      discussion: 'Diskusija',
      announcement: 'Objava'
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
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-800">Učitavaju se kampanje...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-blue-600" />
              Objave i Kampanje
            </h1>
            <p className="text-gray-600">Istražite diskusije, objave i epske D&D avanture</p>
          </div>
          
          {user?.tip === 'admin' && (
            <Link
              to="/create-post"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
            >
              <Crown className="w-5 h-5 mr-2" />
              Nova Objava
            </Link>
          )}
        </div>

        {/* Pretraga i filteri */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Pretražite objave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dropdown za kategoriju objave */}
            <select
              value={filters.kategorijaObjave}
              onChange={(e) => handleFilterChange('kategorijaObjave', e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-white text-gray-900">Sve objave</option>
              <option value="general" className="bg-white text-gray-900">Općenite objave</option>
              <option value="dnd" className="bg-white text-gray-900">D&D sadržaj</option>
            </select>

            {/* Tip objave */}
            <select
              value={filters.tip}
              onChange={(e) => handleFilterChange('tip', e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-white text-gray-900">Svi tipovi</option>
              <option value="discussion" className="bg-white text-gray-900">Diskusija</option>
              <option value="announcement" className="bg-white text-gray-900">Objava</option>
              <option value="campaign" className="bg-white text-gray-900">Campaign</option>
              <option value="adventure" className="bg-white text-gray-900">Adventure</option>
              <option value="tavern-tale" className="bg-white text-gray-900">Tavern Priča</option>
              <option value="quest" className="bg-white text-gray-900">Quest</option>
            </select>

            {/* Status kampanje (samo za D&D sadržaj) */}
            {(filters.kategorijaObjave === 'dnd' || filters.kategorijaObjave === '') && (
                              <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" className="bg-white text-gray-900">Svi statusi</option>
                  <option value="planning" className="bg-white text-gray-900">Planiranje</option>
                  <option value="active" className="bg-white text-gray-900">Aktivno</option>
                  <option value="completed" className="bg-white text-gray-900">Završeno</option>
                  <option value="on-hold" className="bg-white text-gray-900">Pauzirano</option>
                </select>
            )}

            {/* Opseg nivoa za D&D kampanje */}
            {(filters.kategorijaObjave === 'dnd' || filters.kategorijaObjave === '') && (
              <>
                <input
                  type="number"
                  placeholder="Min Level"
                  value={filters.minLevel}
                  onChange={(e) => handleFilterChange('minLevel', e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="20"
                />

                <input
                  type="number"
                  placeholder="Max Level"
                  value={filters.maxLevel}
                  onChange={(e) => handleFilterChange('maxLevel', e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="20"
                />
              </>
            )}
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getTypeIcon(post.tip)}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {getTypeLabel(post.tip)}
                  </span>
                </div>
                {/* Status badge za D&D kampanje */}
                {post.status && ['campaign', 'adventure', 'tavern-tale', 'quest'].includes(post.tip) && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(post.status)}`}>
                    {getStatusLabel(post.status)}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {post.naslov}
              </h3>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.tekst}
              </p>

              {/* Informacije o nivou i broju igrača */}
              {post.level && post.igraci && ['campaign', 'adventure', 'tavern-tale', 'quest'].includes(post.tip) && (
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Nivo {post.level.min}-{post.level.max}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {post.igraci.min}-{post.igraci.max} igrača
                  </span>
                </div>
              )}

              {post.lokacija && (
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {post.lokacija}
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-4">
                {post.kategorije && post.kategorije.slice(0, 3).map((kategorija, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                  >
                    {typeof kategorija === 'string' ? kategorija : kategorija.naziv}
                  </span>
                ))}
                {post.kategorije && post.kategorije.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{post.kategorije.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
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

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <span>
                    {['campaign', 'adventure', 'tavern-tale', 'quest'].includes(post.tip) ? 'DM' : 'Autor'}: {post.autor.ime} {post.autor.prezime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Scroll className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-800 text-lg mb-2">Nema objava za prikazati</p>
            <p className="text-gray-600">Pokušajte s drugim filterima ili pretragom</p>
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
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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