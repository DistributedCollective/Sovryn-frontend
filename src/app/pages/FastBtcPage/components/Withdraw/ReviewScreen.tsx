import React, { useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { translations } from 'locales/i18n';
import { FastBtcButton } from '../FastBtcButton';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Asset } from '../../../../../types';
import { WithdrawContext } from '../../contexts/withdraw-context';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import { AddressBadge } from '../../../../components/AddressBadge';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { LoadableValue } from '../../../../components/LoadableValue';
import { NetworkAwareComponentProps } from '../../types';

type ReviewScreenProps = {
  onConfirm: () => void;
} & NetworkAwareComponentProps;

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  onConfirm,
  network,
}) => {
  const { amount, address } = useContext(WithdrawContext);
  const { t } = useTranslation();

  const weiAmount = useWeiAmount(amount);
  const { value: feesPaid, loading } = useCacheCallWithValue(
    'fastBtcBridge',
    'calculateCurrentFeeWei',
    '0',
    weiAmount,
  );

  const receiveAmount = useMemo(
    () => bignumber(weiAmount).minus(feesPaid).toString(),
    [weiAmount, feesPaid],
  );

  return (
    <>
      <div className="tw-mb-6 tw-text-2xl tw-text-center tw-font-semibold">
        <Trans
          i18nKey={translations.fastBtcPage.withdraw.reviewScreen.title}
          components={[<AssetSymbolRenderer asset={Asset.RBTC} />]}
        />
      </div>

      <div className="tw-w-full">
        <div className="tw-w-full tw-px-8 tw-py-4 tw-bg-gray-5 tw-text-center tw-mb-8 tw-rounded">
          <div className="tw-mb-2 tw-text-lg">
            {t(translations.fastBtcPage.withdraw.reviewScreen.amount)}
          </div>
          <div>
            {toNumberFormat(amount, 8)}{' '}
            <AssetSymbolRenderer asset={Asset.RBTC} />
          </div>
        </div>

        <div className="tw-w-full tw-px-8 tw-py-4 tw-bg-gray-6 tw-text-center tw-mb-8 tw-rounded">
          <div className="tw-mb-2">
            {t(translations.fastBtcPage.withdraw.reviewScreen.address)}
          </div>
          <div>
            <AddressBadge realBtc txHash={address} />
          </div>
        </div>

        <div className="tw-w-full tw-px-8 tw-py-4 tw-bg-gray-5 tw-mb-8 tw-rounded">
          <div className="tw-flex tw-flex-row tw-mb-2 tw-justify-start tw-items-center">
            <div className="tw-w-1/2">
              {t(translations.fastBtcPage.withdraw.reviewScreen.fees)}
            </div>
            <div className="tw-font-semibold">
              <LoadableValue
                value={<>{weiToNumberFormat(feesPaid, 8)} BTC</>}
                loading={loading}
              />
            </div>
          </div>
          <div className="tw-flex tw-flex-row tw-mb-2 tw-justify-start tw-items-center">
            <div className="tw-w-1/2">
              {t(translations.fastBtcPage.withdraw.reviewScreen.received)}
            </div>
            <div className="tw-font-semibold">
              <LoadableValue
                value={<>{weiToNumberFormat(receiveAmount, 8)} BTC</>}
                loading={loading}
              />
            </div>
          </div>
        </div>

        <div className="tw-px-8 tw-mt-8">
          <FastBtcButton
            text={t(translations.common.confirm)}
            onClick={onConfirm}
          />
        </div>
      </div>
    </>
  );
};
