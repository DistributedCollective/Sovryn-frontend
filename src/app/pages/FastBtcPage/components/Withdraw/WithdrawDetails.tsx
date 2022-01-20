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

const DYNAMIC_FEE_DIVISOR = 10000;

export const WithdrawDetails: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { t } = useTranslation();
  const { limits, aggregatorLimits } = useContext(WithdrawContext);
  const asset = getBTCAssetForNetwork(network);

  const renderFee = useMemo(() => {
    const aggregatorFee = weiToFixed(aggregatorLimits.fee, btcInSatoshis);

    if (!limits.dynamicFee) {
      return (
        <>
          {toNumberFormat(limits.baseFee / btcInSatoshis + aggregatorFee, 6)}{' '}
          <AssetSymbolRenderer asset={asset} />
        </>
      );
    }

    if (!limits.baseFee) {
      if (aggregatorFee) {
        return (
          <>
            {toNumberFormat(aggregatorFee, 6)}{' '}
            <AssetSymbolRenderer asset={asset} /> +{' '}
            {toNumberFormat(limits.dynamicFee / DYNAMIC_FEE_DIVISOR, 4)} %
          </>
        );
      }

      return (
        <>{toNumberFormat(limits.dynamicFee / DYNAMIC_FEE_DIVISOR, 5)} %</>
      );
    }

    return (
      <>
        {toNumberFormat(limits.baseFee / btcInSatoshis, 6)}{' '}
        <AssetSymbolRenderer asset={asset} /> +{' '}
        {toNumberFormat(limits.dynamicFee / DYNAMIC_FEE_DIVISOR, 4)} %
      </>
    );
  }, [limits, asset, aggregatorLimits.fee]);

  const renderMinAmount = useMemo(() => {
    return Math.max(
      limits.min / btcInSatoshis,
      Number(weiToFixed(aggregatorLimits.min, 5)),
    );
  }, [limits.min, aggregatorLimits.min]);

  return (
    <section className="tw-py-4 tw-px-8 tw-bg-gray-6 tw-text-white tw-rounded tw-mb-4">
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
