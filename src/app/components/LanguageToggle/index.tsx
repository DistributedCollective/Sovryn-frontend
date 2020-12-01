import React, { useState } from 'react';
import i18next from 'i18next';

export function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState(
    i18next.language || window.localStorage.i18nextLng,
  );
  const changeLanguage = lng => {
    i18next.changeLanguage(lng);
    setCurrentLang(lng);
  };

  const options = [
    { lang: 'EN', value: 'en' },
    { lang: 'ES', value: 'es' },
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
