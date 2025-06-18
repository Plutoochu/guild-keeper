import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CreatePostData } from '../types';
import { 
  Shield, 
  Users, 
  MapPin, 
  Crown,
  BookOpen,
  Scroll,
  Zap,
  Sword,
  ArrowLeft,
  Plus,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePostData>({
    naslov: '',
    tekst: '',
    tip: 'campaign',
    kategorije: [],
    tagovi: [],
    level: { min: 1, max: 20 },
    igraci: { min: 2, max: 6 },
    lokacija: '',
    status: 'planning',
    javno: true,
  });
  const [newKategorija, setNewKategorija] = useState('');
  const [newTag, setNewTag] = useState('');

  if (!user || user.tip !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg mb-2">Pristup dozvoljen samo Dungeon Masterima</p>
            <button
              onClick={() => navigate('/posts')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Nazad na kampanje
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.naslov.trim() || !formData.tekst.trim()) {
      toast.error('Naslov i opis kampanje su obavezni');
      return;
    }

    if (formData.level.min > formData.level.max) {
      toast.error('Minimalni nivo ne može biti veći od maksimalnog');
      return;
    }

    if (formData.igraci.min > formData.igraci.max) {
      toast.error('Minimalni broj igrača ne može biti veći od maksimalnog');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/posts', formData);
      toast.success('Kampanja je uspješno kreirana');
      navigate(`/posts/${response.data.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Greška pri kreiranju kampanje');
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
      default: return <Scroll className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/posts')}
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Nazad na kampanje
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Crown className="w-8 h-8 mr-3 text-yellow-400" />
              Kreiraj Novu Kampanju
            </h1>
            <p className="text-blue-200">Stvori epsku avanturu za svoje igrače</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Naslov kampanje *
                  </label>
                  <input
                    type="text"
                    value={formData.naslov}
                    onChange={(e) => handleInputChange('naslov', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Unesite naslov kampanje..."
                    maxLength={50}
                    required
                  />
                  <p className="text-gray-400 text-sm mt-1">{formData.naslov.length}/50 karaktera</p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Tip kampanje
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'campaign', label: 'Campaign' },
                      { value: 'adventure', label: 'Adventure' },
                      { value: 'tavern-tale', label: 'Tavern Story' },
                      { value: 'quest', label: 'Quest' }
                    ].map((tip) => (
                      <label
                        key={tip.value}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
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
                          onChange={(e) => handleInputChange('tip', e.target.value as any)}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          {getTypeIcon(tip.value)}
                          <span className="ml-2 text-white">{tip.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Status kampanje
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as any)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="planning" className="bg-gray-800 text-white">Planiranje</option>
                    <option value="active" className="bg-gray-800 text-white">Aktivno</option>
                    <option value="completed" className="bg-gray-800 text-white">Završeno</option>
                    <option value="on-hold" className="bg-gray-800 text-white">Pauzirano</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Nivo (Min)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.level.min}
                      onChange={(e) => handleInputChange('level', { ...formData.level, min: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Nivo (Max)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.level.max}
                      onChange={(e) => handleInputChange('level', { ...formData.level, max: parseInt(e.target.value) || 20 })}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Igrači (Min)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.igraci.min}
                      onChange={(e) => handleInputChange('igraci', { ...formData.igraci, min: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Igrači (Max)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.igraci.max}
                      onChange={(e) => handleInputChange('igraci', { ...formData.igraci, max: parseInt(e.target.value) || 10 })}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Lokacija
                  </label>
                  <input
                    type="text"
                    value={formData.lokacija}
                    onChange={(e) => handleInputChange('lokacija', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Gdje se odvija kampanja..."
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={formData.javno}
                      onChange={(e) => handleInputChange('javno', e.target.checked)}
                      className="mr-3 w-4 h-4 text-yellow-400 bg-white/20 border-white/30 rounded focus:ring-yellow-400"
                    />
                    Javna kampanja (vidljiva svim korisnicima)
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Opis kampanje *
                  </label>
                  <textarea
                    value={formData.tekst}
                    onChange={(e) => handleInputChange('tekst', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Opišite svoju epsku kampanju..."
                    rows={8}
                    maxLength={10000}
                    required
                  />
                  <p className="text-gray-400 text-sm mt-1">{formData.tekst.length}/10000 karaktera</p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Kategorije
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newKategorija}
                      onChange={(e) => setNewKategorija(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Dodaj kategoriju..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKategorija())}
                    />
                    <button
                      type="button"
                      onClick={addKategorija}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.kategorije.map((kategorija, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm flex items-center"
                      >
                        {kategorija}
                        <button
                          type="button"
                          onClick={() => removeKategorija(index)}
                          className="ml-2 text-yellow-300 hover:text-yellow-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Maksimalno 5 kategorija</p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Tagovi
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Dodaj tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tagovi.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-blue-300 hover:text-blue-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Maksimalno 10 tagova</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-white/20">
              <button
                type="button"
                onClick={() => navigate('/posts')}
                className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
              >
                Otkaži
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black px-8 py-3 rounded-lg font-semibold transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Kreiranje...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Kreiraj Kampanju
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

export default CreatePostPage; 