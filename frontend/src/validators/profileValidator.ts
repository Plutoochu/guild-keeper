import * as yup from 'yup';

export const profileSchema = yup.object().shape({
  ime: yup.string()
    .min(2, 'Ime mora imati najmanje 2 karaktera')
    .max(50, 'Ime može imati maksimalno 50 karaktera')
    .required('Ime je obavezno'),
  prezime: yup.string()
    .notRequired()
    .nullable()
    .test('prezime-length', 'Prezime mora imati između 2 i 50 karaktera', function(value) {
      if (!value || value.trim() === '') return true;
      return value.length >= 2 && value.length <= 50;
    }),
  email: yup.string()
    .email('Neispravna email adresa')
    .required('Email je obavezan'),
  datumRodjenja: yup.string()
    .required('Datum rođenja je obavezan'),
  spol: yup.string()
    .notRequired()
    .nullable()
    .oneOf(['', 'muški', 'ženski', 'ostalo'], 'Spol mora biti: muški, ženski ili ostalo')
});

export interface ProfileFormData {
  ime: string;
  prezime?: string | undefined;
  email: string;
  datumRodjenja: string;
  spol?: 'muški' | 'ženski' | 'ostalo' | undefined;
} 