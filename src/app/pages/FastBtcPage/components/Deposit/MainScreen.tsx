import React, { useCallback, useContext } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DepositContext, DepositStep } from '../../contexts/deposit-context';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Asset } from '../../../../../types';
import { DepositDetails } from './DepositDetails';
import { DepositInstructions } from './DepositInstructions';
import { FastBtcButton } from '../FastBtcButton';
import { useAccount } from 'app/hooks/useAccount';

export const MainScreen: React.FC = () => {
  const account = useAccount();
  const { ready, requestDepositAddress } = useContext(DepositContext);
  const { t } = useTranslation();

  const onContinueClick = useCallback(() => requestDepositAddress(account), [
    requestDepositAddress,
    account,
  ]);

  return (
    <>
      <div className="tw-mb-6 tw-text-2xl tw-text-center tw-font-semibold">
        <Trans
          i18nKey={translations.fastBtcPage.deposit.mainScreen.title}
          components={[<AssetSymbolRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div className="tw-w-full">
        <div className="tw-py-4 tw-px-8 tw-bg-gray-5 tw-text-white tw-rounded tw-mb-4">
          {t(translations.fastBtcPage.deposit.mainScreen.description)}
        </div>
        <DepositDetails />
        <DepositInstructions />
        <div className="tw-px-8">
          <FastBtcButton
            text={t(translations.fastBtcPage.deposit.mainScreen.cta)}
            disabled={!ready}
            onClick={onContinueClick}
          />
        </div>
      </div>
    </>
  );
};
