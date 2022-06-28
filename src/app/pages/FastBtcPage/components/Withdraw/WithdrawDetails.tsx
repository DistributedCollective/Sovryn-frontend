import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { translations } from 'locales/i18n';
import { WithdrawContext } from '../../contexts/withdraw-context';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { btcInSatoshis } from 'app/constants';
import { NetworkAwareComponentProps } from '../../types';
import { getBTCAssetForNetwork } from '../../helpers';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { DYNAMIC_FEE_DIVISOR } from '../../constants';

export const WithdrawDetails: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { t } = useTranslation();
  const { limits, aggregatorLimits } = useContext(WithdrawContext);
  const asset = getBTCAssetForNetwork(network);

  const renderFee = useMemo(() => {
    const aggregatorFee = Number(weiToFixed(aggregatorLimits.fee, 8));
    const baseFee = limits.baseFee / btcInSatoshis;

    if (!limits.dynamicFee) {
      return <>{toNumberFormat(baseFee + aggregatorFee, 6)} BTC</>;
    }

    if (!limits.baseFee) {
      if (aggregatorFee) {
        return (
          <>
            {toNumberFormat(aggregatorFee, 6)} BTC
            {toNumberFormat(
              (limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100,
              2,
            )}{' '}
            %
          </>
        );
      }

      return (
        <>
          {toNumberFormat((limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100, 2)} %
        </>
      );
    }

    return (
      <>
        {toNumberFormat(baseFee + aggregatorFee, 6)} BTC +{' '}
        {toNumberFormat((limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100, 2)} %
      </>
    );
  }, [limits, aggregatorLimits.fee]);

  const renderMinAmount = useMemo(() => {
    const min1 = limits.min / btcInSatoshis;
    const min2 = Number(weiToFixed(aggregatorLimits.min, 8));
    return Math.max(min1, min2);
  }, [limits.min, aggregatorLimits.min]);

  return (
    <section className="tw-py-4 tw-px-8 tw-bg-gray-3 tw-text-white tw-rounded tw-mb-4">
      <h4 className="tw-text-base tw-text-white tw-mb-4 tw-normal-case tw-font-semibold">
        {t(translations.fastBtcPage.withdraw.withdrawDetails.title)}
      </h4>
      <ul className="tw-pl-4 tw-list-disc">
        <li>
          {t(translations.fastBtcPage.withdraw.withdrawDetails.min)}{' '}
          <LoadableValue
            value={
              <>
                {toNumberFormat(renderMinAmount, 5)}{' '}
                <AssetSymbolRenderer asset={asset} />
              </>
            }
            loading={limits.loading}
          />
        </li>
        <li>
          {t(translations.fastBtcPage.withdraw.withdrawDetails.max)}{' '}
          <LoadableValue
            value={
              <>
                {toNumberFormat(limits.max / btcInSatoshis, 3)}{' '}
                <AssetSymbolRenderer asset={asset} />
              </>
            }
            loading={limits.loading}
          />
        </li>
        <li>
          {t(translations.fastBtcPage.withdraw.withdrawDetails.fee)}{' '}
          <LoadableValue value={<>{renderFee}</>} loading={limits.loading} />
        </li>
      </ul>
    </section>
  );
};
