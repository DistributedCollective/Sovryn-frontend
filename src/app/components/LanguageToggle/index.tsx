import React, { useState } from 'react';

import i18next from 'i18next';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FormSelect } from '../../components/FormSelect';

export function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState(
    i18next.language || reactLocalStorage.get('i18nextLng'),
  );

  const changeLanguage = lng => {
    i18next.changeLanguage(lng);
    reactLocalStorage.set('i18nextLng', lng);
    setCurrentLang(lng);
  };

  const options = [
    { lang: 'EN', value: 'en' },
    { lang: 'ES', value: 'es' },
    { lang: 'PT-BR', value: 'pt_br' },
  ];

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
