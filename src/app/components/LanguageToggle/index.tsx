import React, { useEffect, useState } from 'react';

import i18next from 'i18next';
import { reactLocalStorage } from 'reactjs-localstorage';

export function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState(
    i18next.language || reactLocalStorage.get('i18nextLng'),
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      'lang',
      i18next.language || reactLocalStorage.get('i18nextLng'),
    );
  }, []);

  const changeLanguage = lng => {
    i18next.changeLanguage(lng);
    reactLocalStorage.set('i18nextLng', lng);
    document.documentElement.setAttribute('lang', lng);
    setCurrentLang(lng);
  };

  const options = [
    { lang: 'EN', value: 'en' },
    { lang: 'ES', value: 'es' },
    { lang: 'PT-BR', value: 'pt_br' },
  ];

  return (
    <select
      value={currentLang}
      onChange={e => {
        changeLanguage(e.target.value);
      }}
    >
      {options.map((x, y) => (
        <option value={x.value} key={y}>
          {x.lang}
        </option>
      ))}
    </select>
  );
}
