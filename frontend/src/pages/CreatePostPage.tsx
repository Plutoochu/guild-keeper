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
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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

  if (!user || user.tip !== 'admin') {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">Pristup dozvoljen samo Dungeon Masterima</p>
            <button
              onClick={() => navigate('/posts')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Nazad na postove
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

      const response = await axios.post('/posts', submitData);
      toast.success('Post je uspješno kreiran');
      navigate(`/posts/${response.data.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Greška pri kreiranju posta');
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
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Nazad na admin dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
              <Crown className="w-8 h-8 mr-3 text-yellow-500" />
              Kreiraj Novi Post
            </h1>
            <p className="text-gray-600">Stvori kampanju, diskusiju ili objavu za zajednicu</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-gray-800 font-medium mb-4 text-lg">
                Tip posta *
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
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
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
                    <div className="flex items-center mb-2">
                      {getTypeIcon(tip.value)}
                      <span className="ml-2 text-gray-800 font-medium">{tip.label}</span>
                    </div>
                    <span className="text-gray-600 text-sm">{tip.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    Naslov *
                  </label>
                  <input
                    type="text"
                    value={formData.naslov}
                    onChange={(e) => handleInputChange('naslov', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Unesite naslov..."
                    maxLength={200}
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">{formData.naslov.length}/200 karaktera</p>
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    Sadržaj *
                  </label>
                  <textarea
                    value={formData.tekst}
                    onChange={(e) => handleInputChange('tekst', e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Napišite sadržaj..."
                    maxLength={10000}
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">{formData.tekst.length}/10000 karaktera</p>
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    Kategorije
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newKategorija}
                      onChange={(e) => setNewKategorija(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKategorija())}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Dodaj kategoriju..."
                      maxLength={30}
                    />
                    <button
                      type="button"
                      onClick={addKategorija}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.kategorije.map((kategorija, index) => (
                      <span key={index} className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {kategorija}
                        <button
                          type="button"
                          onClick={() => removeKategorija(index)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    Tagovi
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Dodaj tag..."
                      maxLength={20}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tagovi.map((tag, index) => (
                      <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {isCampaignType && (
                  <>
                    <div>
                      <label className="block text-gray-800 font-medium mb-2 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Nivo igrača
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-600 text-sm mb-1">Min</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={formData.level?.min || 1}
                            onChange={(e) => handleInputChange('level', { ...formData.level, min: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 text-sm mb-1">Max</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={formData.level?.max || 20}
                            onChange={(e) => handleInputChange('level', { ...formData.level, max: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Broj igrača
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-600 text-sm mb-1">Min</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.igraci?.min || 2}
                            onChange={(e) => handleInputChange('igraci', { ...formData.igraci, min: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 text-sm mb-1">Max</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.igraci?.max || 6}
                            onChange={(e) => handleInputChange('igraci', { ...formData.igraci, max: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Lokacija
                      </label>
                      <input
                        type="text"
                        value={formData.lokacija || ''}
                        onChange={(e) => handleInputChange('lokacija', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Gdje se odvija..."
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">Status</label>
                      <select
                        value={formData.status || 'planning'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="planning" className="bg-white text-gray-900">Planiranje</option>
                        <option value="active" className="bg-white text-gray-900">Aktivna</option>
                        <option value="completed" className="bg-white text-gray-900">Završena</option>
                        <option value="on-hold" className="bg-white text-gray-900">Na čekanju</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="space-y-4">
                  <h3 className="text-gray-800 font-medium text-lg border-b border-gray-200 pb-2">
                    Postavke
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-gray-800">
                      <Shield className="w-4 h-4 mr-2" />
                      Javni post
                    </label>
                    <button
                      type="button"
                      onClick={() => handleInputChange('javno', !formData.javno)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        formData.javno ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          formData.javno ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-gray-800">
                      {formData.zakljucaniKomentari ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                      Zaključaj komentare
                    </label>
                    <button
                      type="button"
                      onClick={() => handleInputChange('zakljucaniKomentari', !formData.zakljucaniKomentari)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        formData.zakljucaniKomentari ? 'bg-red-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          formData.zakljucaniKomentari ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-gray-800">
                      {formData.prikvacen ? <Pin className="w-4 h-4 mr-2" /> : <PinOff className="w-4 h-4 mr-2" />}
                      Pin
                    </label>
                    <button
                      type="button"
                      onClick={() => handleInputChange('prikvacen', !formData.prikvacen)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        formData.prikvacen ? 'bg-yellow-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          formData.prikvacen ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Otkaži
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Kreiranje...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Kreiraj Post
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