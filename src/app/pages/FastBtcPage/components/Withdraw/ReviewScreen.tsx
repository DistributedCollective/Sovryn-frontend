import React, { useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { translations } from 'locales/i18n';
import { FastBtcButton } from '../FastBtcButton';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { WithdrawContext } from '../../contexts/withdraw-context';

import { AddressBadge } from '../../../../components/AddressBadge';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { LoadableValue } from '../../../../components/LoadableValue';
import { NetworkAwareComponentProps } from '../../types';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { getBTCAssetForNetwork } from '../../helpers';
import { AssetValue } from 'app/components/AssetValue';

type ReviewScreenProps = {
  onConfirm: () => void;
  loading?: boolean;
} & NetworkAwareComponentProps;

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  onConfirm,
  network,
}) => {
  const { amount, address, aggregatorLimits } = useContext(WithdrawContext);
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const weiAmount = useWeiAmount(amount);
  const { value: calculateCurrentFeeWei, loading } = useCacheCallWithValue(
    'fastBtcBridge',
    'calculateCurrentFeeWei',
    '0',
    weiAmount,
  );

  const feesPaid = useMemo(
    () =>
      bignumber(calculateCurrentFeeWei).add(aggregatorLimits.fee).toString(),
    [calculateCurrentFeeWei, aggregatorLimits.fee],
  );

  const receiveAmount = useMemo(
    () => bignumber(weiAmount).minus(feesPaid).toString(),
    [weiAmount, feesPaid],
  );

  const asset = getBTCAssetForNetwork(network);

  const items = [
    {
      label: t(translations.fastBtcPage.withdraw.reviewScreen.dateTime),
      value: new Date().toLocaleDateString(),
    },
    {
      label: t(translations.fastBtcPage.withdraw.reviewScreen.amount),
      value: (
        <>
          <AssetValue value={Number(amount)} minDecimals={8} asset={asset} />
        </>
      ),
    },
    {
      label: t(translations.fastBtcPage.withdraw.reviewScreen.address),
      value: (
        <AddressBadge realBtc txHash={address} className="tw-text-primary" />
      ),
    },
    {
      label: t(translations.fastBtcPage.withdraw.reviewScreen.fees),
      value: (
        <LoadableValue
          value={
            <AssetValue value={feesPaid} minDecimals={8} assetString="BTC" />
          }
          loading={loading}
        />
      ),
    },
    {
      label: t(translations.fastBtcPage.withdraw.reviewScreen.received),
      value: (
        <LoadableValue
          value={
            <AssetValue
              value={receiveAmount}
              minDecimals={8}
              assetString="BTC"
            />
          }
          loading={loading}
        />
      ),
    },
  ];

  return (
    <>
      <div className="tw-mb-6 tw-text-base tw-text-center tw-font-semibold">
        <Trans
          i18nKey={translations.fastBtcPage.withdraw.reviewScreen.title}
          components={[<AssetSymbolRenderer asset={asset} />]}
        />
      </div>

      <div className="tw-w-full tw-mb-20">
        <table className="tw-mx-auto tw-text-left tw-text-sm tw-font-medium tw-w-full">
          <tbody>
            {items.map(({ label, value }) => (
              <tr>
                <td className="tw-py-0.5">{label}:</td>
                <td className="tw-py-0.5 tw-text-right">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tw-px-8 tw-mt-8 tw-text-center">
          <FastBtcButton
            className="tw-absolute tw-right-0 tw-left-0 tw-bottom-8 tw-mx-auto"
            text={t(translations.common.confirm)}
            onClick={onConfirm}
            disabled={fastBtcLocked || loading}
          />
          {fastBtcLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.fastBTC}
                  components={[
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
};
