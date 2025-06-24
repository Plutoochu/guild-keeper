import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User, ShieldCheck, Save, Pen, Eye, EyeOff, Camera, Trash2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { profileSchema } from '../validators/profileValidator';
import { ProfileFormData } from '../types/profileTypes';

const ProfilePage = () => {
  const { user, updateUser, logout, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema) as any,
    defaultValues: {
      ime: user?.ime || '',
      prezime: user?.prezime || undefined,
      email: user?.email || '',
      datumRodjenja: user?.datumRodjenja ? new Date(user.datumRodjenja).toISOString().split('T')[0] : '',
      spol: (user?.spol as 'muški' | 'ženski' | 'ostalo' | undefined) || undefined
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await updateUser(data);
      
      setIsEditing(false);
      toast.success('Profil je uspješno ažuriran! 🎉');
    } catch (error: any) {
      toast.error(error.message || 'Greška pri ažuriranju profila');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset({
      ime: user?.ime || '',
      prezime: user?.prezime || undefined,
      email: user?.email || '',
      datumRodjenja: user?.datumRodjenja ? new Date(user.datumRodjenja).toISOString().split('T')[0] : '',
      spol: (user?.spol as 'muški' | 'ženski' | 'ostalo' | undefined) || undefined
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Molimo odaberite sliku fajl');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Slika ne može biti veća od 5MB');
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('slika', file);

    try {
      const response = await axios.post('/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        await updateUser(response.data.data);
        toast.success('Slika profila uspješno ažurirana! 📸');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Greška pri učitavanju slike');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageDelete = async () => {
    if (!user?.slika) return;

    setIsUploadingImage(true);
    try {
      const response = await axios.delete('/users/profile-image');

      if (response.data.success) {
        await updateUser(response.data.data);
        toast.success('Slika profila obrisana! 🗑️');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Greška pri brisanju slike');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('bs-BA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete('/users/me/account');
      if (response.data.success) {
        toast.success('Account je uspješno obrisan');
        logout();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Greška pri brisanju account-a');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
          <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Naslov profil stranice */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <User className="text-amber-600" size={36} />
            Profil
          </h1>
          <p className="text-gray-600">Upravljaj svojim podacima u GuildKeeper sistemu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Karta sa profilnom slikom */}
          <div className="lg:col-span-1">
                          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-fit">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {user.slika ? (
                    <img
                      src={`http://localhost:5000${user.slika}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-amber-300"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <User className="text-white" size={40} />
                    </div>
                  )}
                  
                  <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
                      title="Promijeni sliku"
                    >
                      {isUploadingImage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Camera size={16} />
                      )}
                    </button>
                    
                    {user.slika && (
                      <button
                        onClick={handleImageDelete}
                        disabled={isUploadingImage}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
                        title="Obriši sliku"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {user.ime} {user.prezime}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {user.tip === 'admin' ? (
                    <>
                      <ShieldCheck className="text-red-600" size={18} />
                      <span className="text-red-600 font-semibold">Dungeon Master</span>
                    </>
                  ) : (
                                         <>
                       <User className="text-blue-600" size={18} />
                       <span className="text-blue-600 font-semibold">Adventurer</span>
                     </>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  <p>Član od: {formatDate(user.createdAt)}</p>
                  {user.updatedAt !== user.createdAt && (
                    <p>Posljednji update: {formatDate(user.updatedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detalji profila i forma za uređivanje */}
          <div className="lg:col-span-2">
                          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Detalji Profila</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    <Pen size={16} />
                    Uredi
                  </button>
                )}
              </div>

              <div className="p-6">
                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ime
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user.ime}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prezime
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user.prezime || 'Nije uneseno'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email adresa
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        {user.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Datum rođenja
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {formatDate(user.datumRodjenja)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Spol
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user.spol ? user.spol.charAt(0).toUpperCase() + user.spol.slice(1) : 'Nije uneseno'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ime <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register('ime')}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                            errors.ime ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Unesite ime"
                        />
                        {errors.ime && (
                          <p className="text-red-500 text-sm mt-1">{errors.ime.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prezime <span className="text-gray-400">(opcionalno)</span>
                        </label>
                        <input
                          {...register('prezime')}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                            errors.prezime ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Unesite prezime"
                        />
                        {errors.prezime && (
                          <p className="text-red-500 text-sm mt-1">{errors.prezime.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email adresa <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="ime@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Datum rođenja <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register('datumRodjenja')}
                          type="date"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                            errors.datumRodjenja ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.datumRodjenja && (
                          <p className="text-red-500 text-sm mt-1">{errors.datumRodjenja.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Spol <span className="text-gray-400">(opcionalno)</span>
                        </label>
                        <select
                          {...register('spol')}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                            errors.spol ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Odaberite spol</option>
                          <option value="muški">Muški</option>
                          <option value="ženski">Ženski</option>
                          <option value="ostalo">Ostalo</option>
                        </select>
                        {errors.spol && (
                          <p className="text-red-500 text-sm mt-1">{errors.spol.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Save size={16} />
                        )}
                        {isSubmitting ? 'Spremam...' : 'Spremi'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Odustani
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Opasna zona - brisanje računa */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-600" size={24} />
            <h3 className="text-xl font-semibold text-red-800">Opasna zona</h3>
          </div>
          <p className="text-red-700 mb-4">
            Brisanje account-a je nepovratna akcija. Svi vaši podaci, postovi i komentari će biti trajno obrisani.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} />
            Obriši account
          </button>
        </div>

        {/* Modal za potvrdu brisanja računa */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-600" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Potvrdi brisanje</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Da li ste sigurni da želite da obrišete svoj account? Ova akcija je nepovratna i svi vaši podaci će biti trajno obrisani.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 size={16} />
                  )}
                  {isDeleting ? 'Brišem...' : 'Da, obriši'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Odustani
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;