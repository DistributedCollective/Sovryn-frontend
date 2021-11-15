import React, { useCallback, useContext } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Asset } from '../../../../../types';
import { WithdrawDetails } from './WithdrawDetails';
import { WithdrawInstructions } from './WithdrawInstructions';
import { FastBtcButton } from '../FastBtcButton';

export const MainScreen: React.FC = () => {
  const { set } = useContext(WithdrawContext);
  const { t } = useTranslation();

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: WithdrawStep.AMOUNT })),
    [set],
  );

  return (
    <>
      <div className="tw-mb-6 tw-text-2xl tw-text-center tw-font-semibold">
        <Trans
          i18nKey={translations.fastBtcPage.withdraw.mainScreen.title}
          components={[<AssetSymbolRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div className="tw-w-full">
        <div className="tw-py-4 tw-px-8 tw-bg-gray-5 tw-text-white tw-rounded tw-mb-4">
          {t(translations.fastBtcPage.withdraw.mainScreen.description)}
        </div>
        <WithdrawDetails />
        <WithdrawInstructions />
        <div className="tw-px-8">
          <FastBtcButton
            text={t(translations.common.continue)}
            onClick={onContinueClick}
          />
        </div>
      </div>
    </>
  );
};
