import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface RegisterFormData {
  ime: string;
  prezime?: string;
  email: string;
  password: string;
  confirmPassword: string;
  datumRodjenja: string;
  spol?: string;
}

const registerSchema = yup.object({
  ime: yup
    .string()
    .required('Ime je obavezno')
    .min(2, 'Ime mora imati najmanje 2 karaktera')
    .max(50, 'Ime ne može biti duže od 50 karaktera'),
  prezime: yup
    .string()
    .test('min-length', 'Prezime mora imati najmanje 2 karaktera', function(value) {
      if (!value || value.length === 0) return true;
      return value.length >= 2;
    })
    .max(50, 'Prezime ne može biti duže od 50 karaktera'),
  email: yup
    .string()
    .email('Neispravna email adresa')
    .required('Email je obavezan'),
  password: yup
    .string()
    .required('Lozinka je obavezna')
    .min(6, 'Lozinka mora imati najmanje 6 karaktera'),
  confirmPassword: yup
    .string()
    .required('Potvrda lozinke je obavezna')
    .oneOf([yup.ref('password')], 'Lozinke se ne poklapaju'),
  datumRodjenja: yup
    .string()
    .required('Datum rođenja je obavezan'),
  spol: yup
    .string()
    .test('valid-gender', 'Neispravna vrijednost za spol', function(value) {
      if (!value || value === '') return true;
      return ['muški', 'ženski', 'ostalo'].includes(value);
    })
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const registerData = {
        ime: data.ime,
        prezime: data.prezime || '',
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        datumRodjenja: data.datumRodjenja,
        spol: (data.spol || 'ostalo') as 'muški' | 'ženski' | 'ostalo'
      };
      await registerUser(registerData);
      toast.success('Uspješno ste se registrovali!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Greška pri registraciji');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Registracija
          </h2>
          <p className="mt-2 text-gray-600">
            Kreiranje novog korisničkog računa
          </p>
        </div>

        <div className="bg-white py-8 px-6 rounded-lg shadow-sm border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ime" className="block text-sm font-medium text-gray-700">
                  Ime *
                </label>
                <input
                  {...register('ime')}
                  type="text"
                  id="ime"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ime ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Vaše ime"
                />
                {errors.ime && (
                  <p className="mt-1 text-sm text-red-600">{errors.ime.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="prezime" className="block text-sm font-medium text-gray-700">
                  Prezime <span className="text-gray-400 text-xs">(opcionalno)</span>
                </label>
                <input
                  {...register('prezime')}
                  type="text"
                  id="prezime"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.prezime ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Vaše prezime"
                />
                {errors.prezime && (
                  <p className="mt-1 text-sm text-red-600">{errors.prezime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email adresa *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="nekimail@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Lozinka *
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Minimum 6 karaktera"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Potvrda lozinke *
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                id="confirmPassword"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ponovite lozinku"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="datumRodjenja" className="block text-sm font-medium text-gray-700">
                Datum rođenja *
              </label>
              <input
                {...register('datumRodjenja')}
                type="date"
                id="datumRodjenja"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.datumRodjenja ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.datumRodjenja && (
                <p className="mt-1 text-sm text-red-600">{errors.datumRodjenja.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="spol" className="block text-sm font-medium text-gray-700">
                Spol <span className="text-gray-400 text-xs">(opcionalno)</span>
              </label>
              <select
                {...register('spol')}
                id="spol"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.spol ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Odaberite spol</option>
                <option value="muški">Muški</option>
                <option value="ženski">Ženski</option>
                <option value="ostalo">Ostalo</option>
              </select>
              {errors.spol && (
                <p className="mt-1 text-sm text-red-600">{errors.spol.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Registruju se...' : 'Registruj se'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Već imate račun?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Prijavite se
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 