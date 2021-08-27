import { useWalletContext } from '@sovryn/react-wallet';
import { isWeb3Wallet } from '@sovryn/wallet';
import React, { Dispatch, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

import WhiteAlert from '../../../../assets/images/error_white.svg';
import { translations } from '../../../../locales/i18n';
import { Asset } from '../../../../types';
import { currentChainId } from '../../../../utils/classifiers';
import { AssetRenderer } from '../../../components/AssetRenderer';
import styles from '../index.module.scss';
import { actions } from '../slice';
import { FastBtcDialogState, Step } from '../types';
import { FiatButton } from './FiatButton';
import { OpenTransak } from './transak';

interface TransackScreenProps {
  state: FastBtcDialogState;
  dispatch: Dispatch<any>;
}

export function TransackScreen({ state, dispatch }: TransackScreenProps) {
  const { t } = useTranslation();
  const { connected, wallet } = useWalletContext();

  const isWrongChainId = useMemo(() => {
    return (
      connected &&
      isWeb3Wallet(wallet.providerType!) &&
      wallet.chainId !== currentChainId
    );
  }, [connected, wallet.chainId, wallet.providerType]);

  return (
    <>
      <h2 className={styles.title}>
        {' '}
        <Trans
          i18nKey={translations.fastBtcDialog.fiatDialog.title}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </h2>
      <div className={styles.alertBlock}>
        <img alt="white alert" src={WhiteAlert} />
      </div>
      <div className={styles.subexp1}>
        <Trans
          i18nKey={translations.fastBtcDialog.fiatDialog.explanation1}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div className={styles.subexp2}>
        <Trans
          i18nKey={translations.fastBtcDialog.fiatDialog.explanation2}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div>
        <div className={styles.limitsTitle}>
          {t(translations.fastBtcDialog.limits.title)}
        </div>
        <div className={styles.limitsValue}>
          <div>
            •{' '}
            {t(translations.fastBtcDialog.limits.min, {
              amount: parseFloat(state.limits.min.toFixed(4)),
            })}{' '}
          </div>
          <div> {t(translations.fastBtcDialog.limits.btc)} </div>
        </div>
        <div className={styles.limitsValue}>
          <div>
            •{' '}
            {t(translations.fastBtcDialog.limits.max, {
              amount: parseFloat(state.limits.max.toFixed(4)),
            })}{' '}
          </div>
          <div>{t(translations.fastBtcDialog.limits.btc)} </div>
        </div>
      </div>

      <div>
        <div className={styles.instructionsTitle}>
          {t(translations.fastBtcDialog.instructions.title)}
        </div>
        <div className={styles.instructionsValue}>
          • {t(translations.fastBtcDialog.fiatDialog.instructions.point1)}
          <br />• {t(translations.fastBtcDialog.fiatDialog.instructions.point2)}
        </div>
      </div>

      {state.step === Step.TRANSAK && (
        <OpenTransak
          address={state.deposit.address}
          onClose={() => dispatch(actions.reset())}
        />
      )}

      {isWrongChainId && (
        <p className="tw-text-center">
          {t(translations.fastBtcDialog.instructions.chainId)}
        </p>
      )}

      <div className={styles.buttons}>
        <FiatButton
          loading={state.deposit.loading}
          ready={state.ready}
          disabled={isWrongChainId}
          onClick={() => {
            dispatch(actions.generateFiatDepositAddress());
          }}
        />
      </div>
    </>
  );
}
