import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User, ShieldCheck, Save, Pen, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { profileSchema, ProfileFormData } from '../validators/profileValidator';

const ProfilePage = () => {
  const { user, updateUser, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bs-BA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <User className="text-amber-600" size={36} />
            Profil Avanturista
          </h1>
          <p className="text-gray-600">Upravljaj svojim podacima u GuildKeeper sistemu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-white" size={40} />
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

          {/* Profile Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-amber-200">
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
                  // View Mode
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
                  // Edit Mode
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
      </div>
    </div>
  );
};

export default ProfilePage;