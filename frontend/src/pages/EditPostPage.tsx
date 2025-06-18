import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CreatePostData, Post } from '../types';
import { 
  Shield, 
  Users, 
  MapPin, 
  Crown,
  ArrowLeft,
  Plus,
  X,
  MessageSquare,
  Megaphone,
  Lock,
  Unlock,
  Pin,
  PinOff,
  Sword,
  Zap,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';

const EditPostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<CreatePostData>({
    naslov: '',
    tekst: '',
    tip: 'discussion',
    kategorije: [],
    tagovi: [],
    level: { min: 1, max: 20 },
    igraci: { min: 2, max: 6 },
    lokacija: '',
    status: 'planning',
    javno: true,
    zakljucaniKomentari: false,
    prikvacen: false
  });
  const [newKategorija, setNewKategorija] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoadingPost(true);
      const response = await axios.get(`/posts/${id}`);
      const postData = response.data.data;
      setPost(postData);
      
      
      setFormData({
        naslov: postData.naslov || '',
        tekst: postData.tekst || '',
        tip: postData.tip || 'discussion',
        kategorije: postData.kategorije || [],
        tagovi: postData.tagovi || [],
        level: postData.level || { min: 1, max: 20 },
        igraci: postData.igraci || { min: 2, max: 6 },
        lokacija: postData.lokacija || '',
        status: postData.status || 'planning',
        javno: postData.javno !== undefined ? postData.javno : true,
        zakljucaniKomentari: postData.zakljucaniKomentari || false,
        prikvacen: postData.prikvacen || false
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Greška pri učitavanju objave');
      navigate('/posts');
    } finally {
      setLoadingPost(false);
    }
  };

  if (!user || user.tip !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg mb-2">Pristup dozvoljen samo adminima</p>
            <button
              onClick={() => navigate('/posts')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Nazad na objave
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-white">Učitava se objava...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-300 text-lg mb-2">Objava nije pronađena</p>
            <button
              onClick={() => navigate('/posts')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Nazad na objave
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCampaignType = ['campaign', 'adventure', 'tavern-tale', 'quest'].includes(formData.tip);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.naslov.trim() || !formData.tekst.trim()) {
      toast.error('Naslov i tekst su obavezni');
      return;
    }

    try {
      setLoading(true);
      const submitData = { ...formData };
      
      if (!isCampaignType) {
        delete submitData.level;
        delete submitData.igraci;
        delete submitData.lokacija;
        delete submitData.status;
      }

      await axios.put(`/posts/${id}`, submitData);
      toast.success('Objava je uspješno ažurirana');
      navigate(`/posts/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Greška pri ažuriranju objave');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreatePostData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addKategorija = () => {
    if (newKategorija.trim() && !formData.kategorije.includes(newKategorija.trim())) {
      setFormData(prev => ({
        ...prev,
        kategorije: [...prev.kategorije, newKategorija.trim()]
      }));
      setNewKategorija('');
    }
  };

  const removeKategorija = (index: number) => {
    setFormData(prev => ({
      ...prev,
      kategorije: prev.kategorije.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tagovi.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tagovi: [...prev.tagovi, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tagovi: prev.tagovi.filter((_, i) => i !== index)
    }));
  };

  const getTypeIcon = (tip: string) => {
    switch (tip) {
      case 'campaign': return <Crown className="w-5 h-5" />;
      case 'adventure': return <Sword className="w-5 h-5" />;
      case 'tavern-tale': return <Users className="w-5 h-5" />;
      case 'quest': return <Zap className="w-5 h-5" />;
      case 'discussion': return <MessageSquare className="w-5 h-5" />;
      case 'announcement': return <Megaphone className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/posts/${id}`)}
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Nazad na objavu
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Edit className="w-8 h-8 mr-3 text-yellow-400" />
              Uredi Objavu
            </h1>
            <p className="text-blue-200">Ažuriraj sadržaj i postavke objave</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-white font-medium mb-4 text-lg">
                Tip objave *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { value: 'discussion', label: 'Diskusija', desc: 'Otvori temu za diskusiju' },
                  { value: 'announcement', label: 'Objava', desc: 'Službena objava/vijest' },
                  { value: 'campaign', label: 'Kampanja', desc: 'D&D kampanja' },
                  { value: 'adventure', label: 'Avantura', desc: 'Jedna sesija' },
                                     { value: 'tavern-tale', label: 'Tavern Priča', desc: 'Kratka priča' },
                  { value: 'quest', label: 'Quest', desc: 'Poseban zadatak' }
                ].map((tip) => (
                  <label
                    key={tip.value}
                    className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.tip === tip.value
                        ? 'border-yellow-400 bg-yellow-400/20'
                        : 'border-white/30 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tip"
                      value={tip.value}
                      checked={formData.tip === tip.value}
                      onChange={(e) => handleInputChange('tip', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-white font-medium">
                        {getTypeIcon(tip.value)}
                        <span className="ml-2">{tip.label}</span>
                      </div>
                      {formData.tip === tip.value && (
                        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{tip.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-white font-medium mb-3">
                  Naslov *
                </label>
                <input
                  type="text"
                  value={formData.naslov}
                  onChange={(e) => handleInputChange('naslov', e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Unesite naslov objave..."
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-3">
                  Javnost
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="javno"
                      checked={formData.javno}
                      onChange={() => handleInputChange('javno', true)}
                      className="mr-2"
                    />
                    <span className="text-white">Javno</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="javno"
                      checked={!formData.javno}
                      onChange={() => handleInputChange('javno', false)}
                      className="mr-2"
                    />
                    <span className="text-white">Privatno</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-3">
                Sadržaj *
              </label>
              <textarea
                value={formData.tekst}
                onChange={(e) => handleInputChange('tekst', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-vertical"
                placeholder="Unesite sadržaj objave..."
                required
              />
            </div>

            {}
            {isCampaignType && (
              <div className="space-y-6 border-t border-white/20 pt-8">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-yellow-400" />
                  D&D Postavke
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Status kampanje
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="planning" className="bg-gray-800">Planiranje</option>
                      <option value="active" className="bg-gray-800">Aktivno</option>
                      <option value="completed" className="bg-gray-800">Završeno</option>
                      <option value="on-hold" className="bg-gray-800">Pauzirano</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      Lokacija
                    </label>
                    <input
                      type="text"
                      value={formData.lokacija}
                      onChange={(e) => handleInputChange('lokacija', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Npr. Waterdeep, Roll20, Discord..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Nivo igrača
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={formData.level?.min || 1}
                          onChange={(e) => handleInputChange('level', { 
                            ...formData.level, 
                            min: parseInt(e.target.value) 
                          })}
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Min"
                        />
                      </div>
                      <span className="text-white">do</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={formData.level?.max || 20}
                          onChange={(e) => handleInputChange('level', { 
                            ...formData.level, 
                            max: parseInt(e.target.value) 
                          })}
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      Broj igrača
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={formData.igraci?.min || 2}
                          onChange={(e) => handleInputChange('igraci', { 
                            ...formData.igraci, 
                            min: parseInt(e.target.value) 
                          })}
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Min"
                        />
                      </div>
                      <span className="text-white">do</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={formData.igraci?.max || 6}
                          onChange={(e) => handleInputChange('igraci', { 
                            ...formData.igraci, 
                            max: parseInt(e.target.value) 
                          })}
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {}
            <div>
              <label className="block text-white font-medium mb-3">
                Kategorije
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.kategorije.map((kategorija, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm flex items-center"
                  >
                    {kategorija}
                    <button
                      type="button"
                      onClick={() => removeKategorija(index)}
                      className="ml-2 text-yellow-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newKategorija}
                  onChange={(e) => setNewKategorija(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKategorija())}
                  className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-l-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Dodaj kategoriju..."
                />
                <button
                  type="button"
                  onClick={addKategorija}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-r-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {}
            <div>
              <label className="block text-white font-medium mb-3">
                Tagovi
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tagovi.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-blue-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-l-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Dodaj tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-white/20 pt-6">
              <div>
                <label className="flex items-center text-white font-medium">
                  <input
                    type="checkbox"
                    checked={formData.zakljucaniKomentari}
                    onChange={(e) => handleInputChange('zakljucaniKomentari', e.target.checked)}
                    className="mr-3"
                  />
                  {formData.zakljucaniKomentari ? (
                    <Lock className="w-5 h-5 mr-2 text-red-400" />
                  ) : (
                    <Unlock className="w-5 h-5 mr-2 text-green-400" />
                  )}
                  Zaključaj komentare
                </label>
                <p className="text-gray-400 text-sm mt-1 ml-8">
                  Sprečava nove komentare na ovoj objavi
                </p>
              </div>

              <div>
                <label className="flex items-center text-white font-medium">
                  <input
                    type="checkbox"
                    checked={formData.prikvacen}
                    onChange={(e) => handleInputChange('prikvacen', e.target.checked)}
                    className="mr-3"
                  />
                  {formData.prikvacen ? (
                    <Pin className="w-5 h-5 mr-2 text-yellow-400" />
                  ) : (
                    <PinOff className="w-5 h-5 mr-2 text-gray-400" />
                  )}
                  Pin
                </label>
                <p className="text-gray-400 text-sm mt-1 ml-8">
                  Prikazuje objavu na vrhu liste
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/posts/${id}`)}
                className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
              >
                Otkaži
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black px-8 py-3 rounded-lg font-semibold flex items-center transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Ažuriranje...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Ažuriraj Objavu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;