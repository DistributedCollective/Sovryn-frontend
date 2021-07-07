import React, { useState } from 'react';

import i18next from 'i18next';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FormSelect } from '../../components/FormSelect';
import { languageLocalStorageKey, languages } from '../../../locales/i18n';

export function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState(
    i18next.language || reactLocalStorage.get('i18nextLng'),
  );

  const changeLanguage = lng => {
    i18next.changeLanguage(lng);
    reactLocalStorage.set(languageLocalStorageKey, lng);
    setCurrentLang(lng);
  };

  const options = languages.map(lng => ({
    lang: lng.toUpperCase(),
    value: lng,
  }));

  return (
    <FormSelect
      onChange={value => {
        changeLanguage(value.key);
      }}
      value={currentLang}
      items={options.map(item => ({ key: item.value, label: item.lang }))}
      innerClasses=""
    />
  );
}
