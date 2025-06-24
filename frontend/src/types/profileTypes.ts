export interface ProfileFormData {
  ime: string;
  prezime?: string | undefined;
  email: string;
  datumRodjenja: string;
  spol?: 'muški' | 'ženski' | 'ostalo' | undefined;
} 