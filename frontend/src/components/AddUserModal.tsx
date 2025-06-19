import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, UserPlus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const addUserSchema = yup.object().shape({
  ime: yup.string()
    .min(2, 'Ime mora imati najmanje 2 karaktera')
    .max(50, 'Ime može imati maksimalno 50 karaktera')
    .required('Ime je obavezno'),
  prezime: yup.string()
    .optional()
    .min(2, 'Prezime mora imati najmanje 2 karaktera')
    .max(50, 'Prezime može imati maksimalno 50 karaktera'),
  email: yup.string()
    .email('Neispravna email adresa')
    .required('Email je obavezan'),
  password: yup.string()
    .min(6, 'Lozinka mora imati najmanje 6 karaktera')
    .required('Lozinka je obavezna'),
  datumRodjenja: yup.string()
    .required('Datum rođenja je obavezan'),
  spol: yup.string()
    .optional()
    .oneOf(['', 'muški', 'ženski', 'ostalo'], 'Spol mora biti: muški, ženski ili ostalo'),
  tip: yup.string()
    .oneOf(['admin', 'user'], 'Tip mora biti admin ili user')
    .required('Tip korisnika je obavezan')
});

interface AddUserFormData {
  ime: string;
  prezime?: string;
  email: string;
  password: string;
  datumRodjenja: string;
  spol?: string;
  tip: 'admin' | 'user';
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onUserAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AddUserFormData>({
    resolver: yupResolver(addUserSchema),
    defaultValues: {
      tip: 'user'
    }
  });

  const onSubmit = async (data: AddUserFormData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/users', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Korisnik uspješno dodan! 🎉');
        reset();
        onUserAdded();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Greška pri dodavanju korisnika');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserPlus className="text-blue-600" size={24} />
            Dodaj novog korisnika
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ime <span className="text-red-500">*</span>
              </label>
              <input
                {...register('ime')}
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ime ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Unesite ime"
              />
              {errors.ime && (
                <p className="text-red-500 text-sm mt-1">{errors.ime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prezime <span className="text-gray-400">(opcionalno)</span>
              </label>
              <input
                {...register('prezime')}
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email adresa <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ime@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lozinka <span className="text-red-500">*</span>
            </label>
            <input
              {...register('password')}
              type="password"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Unesite lozinku"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Datum rođenja <span className="text-red-500">*</span>
              </label>
              <input
                {...register('datumRodjenja')}
                type="date"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.datumRodjenja ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.datumRodjenja && (
                <p className="text-red-500 text-sm mt-1">{errors.datumRodjenja.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spol <span className="text-gray-400">(opcionalno)</span>
              </label>
              <select
                {...register('spol')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip korisnika <span className="text-red-500">*</span>
            </label>
            <select
              {...register('tip')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.tip ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="user">Adventurer</option>
              <option value="admin">Dungeon Master</option>
            </select>
            {errors.tip && (
              <p className="text-red-500 text-sm mt-1">{errors.tip.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Dodavanje...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Dodaj korisnika
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Odustani
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal; 