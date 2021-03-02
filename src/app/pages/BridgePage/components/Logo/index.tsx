import React from 'react';
import cn from 'classnames';
import styles from './index.module.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

export function Logo() {
  const { t } = useTranslation();
  return (
    <div className="tw-mb-12">
      <Link to="/" className={cn('tw-mx-auto tw-block tw-mb-2', styles.logo)}>
        <span className="tw-sr-only">Sovryn</span>
      </Link>
      <h1
        className={cn(
          'tw-mx-auto tw-my-0 tw-block tw-uppercase tw-text-center tw-text-xl tw-font-extrabold tw-leading-1',
          styles.title,
        )}
      >
        {t(translations.bridgePage.title)}
      </h1>
    </div>
  );
}
