import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LoadableValue } from '../../../../components/LoadableValue';
import { DepositContext } from '../../contexts/deposit-context';
import { btcInSatoshis } from 'app/constants';
import { DYNAMIC_FEE_DIVISOR } from '../../constants';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';

export const DepositDetails: React.FC = () => {
  const { t } = useTranslation();
  const { limits } = useContext(DepositContext);

  return (
    <section className="tw-py-4 tw-px-8 tw-bg-gray-3 tw-text-white tw-rounded tw-mb-4">
      <h4 className="tw-text-base tw-text-white tw-mb-3 tw-normal-case tw-font-semibold">
        {t(translations.fastBtcPage.deposit.depositDetails.title)}
      </h4>
      <ul className="tw-pl-4 tw-list-disc tw-text-sm">
        <li>
          {t(translations.fastBtcPage.deposit.depositDetails.min)}{' '}
          <LoadableValue
            value={
              <AssetValue
                value={limits.min}
                minDecimals={5}
                mode={AssetValueMode.auto}
                assetString="BTC"
              />
            }
            loading={limits.loading}
          />
        </li>
        <li>
          {t(translations.fastBtcPage.deposit.depositDetails.max)}{' '}
          <LoadableValue
            value={
              <AssetValue
                value={limits.max}
                minDecimals={3}
                mode={AssetValueMode.auto}
                assetString="BTC"
              />
            }
            loading={limits.loading}
          />
        </li>
        <li>
          {t(translations.fastBtcPage.withdraw.withdrawDetails.fee)}{' '}
          <LoadableValue
            value={
              <>
                <AssetValue
                  value={limits.baseFee / btcInSatoshis}
                  minDecimals={8}
                  maxDecimals={8}
                  mode={AssetValueMode.auto}
                  assetString="BTC"
                />
                +{' '}
                <AssetValue
                  value={(limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100}
                  minDecimals={2}
                  mode={AssetValueMode.auto}
                />{' '}
                %
              </>
            }
            loading={limits.loading}
          />
        </li>
      </ul>
    </section>
  );
};
