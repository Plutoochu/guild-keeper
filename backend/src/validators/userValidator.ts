import { body } from 'express-validator';

export const registerValidation = [
  body('ime')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ime mora imati između 2 i 50 karaktera'),
  body('prezime')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Prezime mora imati između 2 i 50 karaktera'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Neispravna email adresa'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Lozinka mora imati najmanje 6 karaktera'),
  body('datumRodjenja')
    .isISO8601()
    .toDate()
    .withMessage('Neispravni datum rođenja'),
  body('spol')
    .optional({ checkFalsy: true })
    .isIn(['muški', 'ženski', 'ostalo'])
    .withMessage('Spol mora biti: muški, ženski ili ostalo')
];

export const updateProfileValidation = [
  body('ime')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ime mora imati između 2 i 50 karaktera'),
  body('prezime')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Prezime mora imati između 2 i 50 karaktera'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Neispravna email adresa'),
  body('datumRodjenja')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Neispravni datum rođenja'),
  body('spol')
    .optional({ checkFalsy: true })
    .isIn(['muški', 'ženski', 'ostalo'])
    .withMessage('Spol mora biti: muški, ženski ili ostalo')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Neispravna email adresa'),
  body('password')
    .notEmpty()
    .withMessage('Lozinka je obavezna')
]; 