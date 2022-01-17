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

const DYNAMIC_FEE_DIVISOR = 10000;

export const WithdrawDetails: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { t } = useTranslation();
  const { limits } = useContext(WithdrawContext);
  const asset = getBTCAssetForNetwork(network);

  const renderFee = useMemo(() => {
    if (!limits.dynamicFee) {
      return (
        <>
          {toNumberFormat(limits.baseFee / btcInSatoshis, 5)}{' '}
          <AssetSymbolRenderer asset={asset} />
        </>
      );
    }

    if (!limits.baseFee) {
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
  }, [limits, asset]);

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
                {toNumberFormat(limits.min / btcInSatoshis, 5)}{' '}
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
