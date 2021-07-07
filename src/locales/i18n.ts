import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

import moment from 'moment';
// moment locale en is not needed, it's the default.
import 'moment/locale/es';
import 'moment/locale/pt-br';
import 'moment/locale/fr';

import en from './en/translation.json';
import es from './es/translation.json';
import pt_br from './pt_br/translation.json';
import fr from './fr/translation.json';
import { ConvertedToObjectType } from './types';

const translationsJson = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  'pt-BR': {
    translation: pt_br,
  },
  fr: {
    translation: fr,
  },
};

export const languages = Object.keys(translationsJson);

export const languageLocalStorageKey = 'i18nextLng_dapp';

export type TranslationResource = typeof en;
export type LanguageKey = keyof TranslationResource;

export const translations: ConvertedToObjectType<TranslationResource> = {} as any;

/*
 * Converts the static JSON file into an object where keys are identical
 * but values are strings concatenated according to syntax.
 * This is helpful when using the JSON file keys and still have the intellisense support
 * along with type-safety
 */
const convertLanguageJsonToObject = (obj: any, dict: {}, current?: string) => {
  Object.keys(obj).forEach(key => {
    const currentLookupKey = current ? `${current}.${key}` : key;
    if (typeof obj[key] === 'object') {
      dict[key] = {};
      convertLanguageJsonToObject(obj[key], dict[key], currentLookupKey);
    } else {
      dict[key] = currentLookupKey;
    }
  });
};

i18next.on('languageChanged', (lng: string) => {
  moment.locale(lng);
});

export const i18n = i18next
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init(
    {
      resources: translationsJson,
      react: {
        useSuspense: true,
      },
      fallbackLng: 'en',
      supportedLngs: languages, // available languages for browser detector to pick from
      load: 'currentOnly', // do not load pt when pt-BR is active
      debug:
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',

      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      detection: {
        order: ['localStorage', 'navigator'],
        // needs to be different from default to prevent overwrite by @sovryn/react-wallet
        lookupLocalStorage: languageLocalStorageKey,
        // don't cache automatically into localStrorage only on manual language change
        caches: [],
        excludeCacheFor: ['cimode'],
      },
    },
    err => {
      if (err) {
        console.error(err);
      }
      convertLanguageJsonToObject(en, translations);
    },
  );
