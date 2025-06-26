import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';
import { 
  Shield, 
  Users, 
  MapPin, 
  Calendar, 
  Crown,
  BookOpen,
  Scroll,
  Zap,
  Sword,
  Edit,
  Trash2,
  ArrowLeft,
  User,
  MessageCircle,
  Megaphone,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import Comments from '../components/Comments';

const PostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/posts/${id}`);
      setPost(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška pri učitavanju objave');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${id}`);
      toast.success('Objava je uspješno obrisana');
      navigate('/posts');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Greška pri brisanju objave');
    }
  };

  const getTypeIcon = (tip: string) => {
    switch (tip) {
      case 'campaign': return <Crown className="w-6 h-6 text-yellow-400" />;
      case 'adventure': return <Sword className="w-6 h-6 text-red-400" />;
      case 'tavern-tale': return <Users className="w-6 h-6 text-green-400" />;
      case 'quest': return <Zap className="w-6 h-6 text-purple-400" />;
      case 'discussion': return <MessageCircle className="w-6 h-6 text-blue-400" />;
      case 'announcement': return <Megaphone className="w-6 h-6 text-orange-400" />;
      default: return <FileText className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      planning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      completed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'on-hold': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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

  const canEditOrDelete = user && (user.tip === 'admin' || (post && post.autor._id === user._id));

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-800">Učitava se objava...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Scroll className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-800 text-lg mb-2">Objava nije pronađena</p>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/posts"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Nazad na objave
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Link
            to="/posts"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Nazad na objave
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                {getTypeIcon(post.tip)}
                <div className="ml-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-600 font-medium">
                      {getTypeLabel(post.tip)}
                    </span>
                    {post.status && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(post.status)}`}>
                        {getStatusLabel(post.status)}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold text-gray-800">
                    {post.naslov}
                  </h1>
                </div>
              </div>

              {canEditOrDelete && (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Uredi
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Obriši
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {post.level && post.igraci && ['campaign', 'adventure', 'tavern-tale', 'quest'].includes(post.tip) ? 'Opis kampanje' : 'Sadržaj objave'}
                  </h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {post.tekst}
                  </div>
                </div>

                {post.kategorije && post.kategorije.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Kategorije</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.kategorije.map((kategorija, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                        >
                          {typeof kategorija === 'string' ? kategorija : kategorija.naziv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {post.tagovi && post.tagovi.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tagovi</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tagovi.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          #{typeof tag === 'string' ? tag : tag.naziv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {post.level && post.igraci && ['campaign', 'adventure', 'tavern-tale', 'quest'].includes(post.tip) ? 'Dungeon Master' : 'Autor'}
                  </h3>
                  <div className="text-gray-700">
                    <p className="font-medium">{post.autor.ime} {post.autor.prezime}</p>
                    <p className="text-sm text-gray-600">{post.autor.email}</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {post.level && post.igraci && ['campaign', 'adventure', 'tavern-tale', 'quest'].includes(post.tip) ? 'Detalji kampanje' : 'Detalji objave'}
                  </h3>
                  <div className="space-y-4">
                    {post.level && ['campaign', 'adventure', 'tavern-tale', 'quest'].includes(post.tip) && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          Nivo
                        </span>
                        <span className="text-gray-800 font-medium">
                          {post.level.min} - {post.level.max}
                        </span>
                      </div>
                    )}

                    {post.igraci && ['campaign', 'adventure', 'tavern-tale', 'quest'].includes(post.tip) && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Igrači
                        </span>
                        <span className="text-gray-800 font-medium">
                          {post.igraci.min} - {post.igraci.max}
                        </span>
                      </div>
                    )}

                    {post.lokacija && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Lokacija
                        </span>
                        <span className="text-gray-800 font-medium">
                          {post.lokacija}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Kreirana
                      </span>
                      <span className="text-gray-800 font-medium">
                        {new Date(post.createdAt).toLocaleDateString('bs-BA')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Javna</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        post.javno 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {post.javno ? 'Da' : 'Ne'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="mt-8">
            <Comments postId={post._id} commentsLocked={post.zakljucaniKomentari} />
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Potvrdite brisanje
              </h3>
              <p className="text-gray-600 mb-6">
                Da li ste sigurni da želite obrisati ovu objavu? Ova akcija se ne može poništiti.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Otkaži
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Obriši
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailsPage; 