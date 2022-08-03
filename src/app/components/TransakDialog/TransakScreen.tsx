import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

import WhiteAlert from 'assets/images/error_white.svg';
import styles from './index.module.scss';
import { translations } from 'locales/i18n';
import { AssetRenderer } from '../AssetRenderer';
import { Asset } from 'types/asset';
import { FiatButton } from './FiatButton';
import { useTransak } from './useTransak';

export const TransakScreen: React.FC = () => {
  const { t } = useTranslation();

  const { handleClick, isWrongChainId } = useTransak();

  return (
    <>
      <h2 className={styles.title}>
        {' '}
        <Trans
          i18nKey={translations.transakDialog.title}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </h2>
      <div className={styles.alertBlock}>
        <img alt="white alert" src={WhiteAlert} />
      </div>
      <div className={styles.subexp1}>
        <Trans
          i18nKey={translations.transakDialog.explanation1}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div className={styles.subexp2}>
        <Trans
          i18nKey={translations.transakDialog.explanation2}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </div>

      {isWrongChainId && (
        <p className="tw-text-center">
          {t(translations.transakDialog.chainId)}
        </p>
      )}

      <div className={styles.buttons}>
        <FiatButton
          ready
          loading={false}
          disabled={isWrongChainId}
          onClick={handleClick}
        />
      </div>
    </>
  );
};
