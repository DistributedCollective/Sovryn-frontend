import React from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export function Screen11() {
  return (
    <>
      <div className="tutorial-container position-absolute text-black">
        <div>First, you need to connect to the RSK Network.</div>
        <div>To learn how, click here.</div>
        <button>Engage Wallet</button>
      </div>
    </>
  );
}
