import { bignumber } from 'mathjs';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { numberFromWei } from '../../../../../utils/blockchain/math-helpers';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { AssetValue } from '../../../../components/AssetValue';
import { AssetValueMode } from '../../../../components/AssetValue/types';
import { usePerpetual_accountBalance } from '../../hooks/usePerpetual_accountBalance';
import { actions } from '../../slice';
import { PerpetualPageModals } from '../../types';
import {
  BarCompositionChart,
  BarCompositionChartEntry,
} from '../BarCompositionChart';

type AccountBalanceFormProps = {
  pairType: PerpetualPairType;
  onOpenTransactionHistory: () => void;
};

export const AccountBalanceForm: React.FC<AccountBalanceFormProps> = ({
  pairType,
  onOpenTransactionHistory,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onOpenDeposit = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.FASTBTC_DEPOSIT));
  }, [dispatch]);

  const onOpenWithdraw = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.FASTBTC_WITHDRAW));
  }, [dispatch]);

  const onOpenTransfer = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.FASTBTC_TRANSFER));
  }, [dispatch]);

  const {
    total,
    available,
    inPositions,
    unrealized,
  } = usePerpetual_accountBalance(pairType);

  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  const chartEntries: BarCompositionChartEntry[] = useMemo(() => {
    const isUnrealizedNegative = bignumber(unrealized || '0').isNegative();
    const unrealizedValue = Math.abs(numberFromWei(unrealized));

    return [
      {
        key: 'available',
        value: numberFromWei(available),
        valueLabel: (
          <AssetValue
            value={available}
            assetString={pair.baseAsset}
            mode={AssetValueMode.auto}
            minDecimals={8}
            maxDecimals={8}
          />
        ),
        label: t(translations.perpetualPage.accountBalance.availableBalance),
        color: '#F7931A',
      },
      {
        key: 'inPositions',
        value:
          numberFromWei(inPositions) -
          (isUnrealizedNegative ? unrealizedValue : 0),
        valueLabel: (
          <AssetValue
            value={inPositions}
            assetString={pair.baseAsset}
            mode={AssetValueMode.auto}
            minDecimals={3}
            maxDecimals={3}
          />
        ),
        label: t(translations.perpetualPage.accountBalance.inPositions),
        color: '#1D7FF7',
      },
      {
        key: 'unrealized',
        value: unrealizedValue,
        valueLabel: (
          <span
            className={
              isUnrealizedNegative
                ? 'tw-text-trade-short'
                : 'tw-text-trade-long'
            }
          >
            {isUnrealizedNegative ? '- ' : '+ '}
            <AssetValue
              value={bignumber(unrealized || '0')
                .abs()
                .toString()}
              assetString={pair.baseAsset}
              mode={AssetValueMode.auto}
              minDecimals={8}
              maxDecimals={8}
            />
          </span>
        ),
        label: t(translations.perpetualPage.accountBalance.unrealized),
        colorClassName: isUnrealizedNegative ? undefined : 'tw-bg-trade-long',
        color: isUnrealizedNegative ? 'rgba(29, 127, 247, 0.25)' : undefined,
      },
    ];
  }, [unrealized, available, t, inPositions, pair.baseAsset]);

  const totalLabel = useMemo(
    () => (
      <div className="tw-flex tw-flex-row tw-items-center">
        <AssetValue
          value={total.baseValue}
          assetString={pair.baseAsset}
          mode={AssetValueMode.auto}
          minDecimals={2}
          maxDecimals={8}
        />
        <span className="tw-ml-2 tw-text-xs">
          ≈{' '}
          <AssetValue
            value={total.quoteValue}
            assetString={pair.quoteAsset}
            mode={AssetValueMode.auto}
            minDecimals={2}
            maxDecimals={2}
          />
        </span>
      </div>
    ),
    [pair.baseAsset, pair.quoteAsset, total.baseValue, total.quoteValue],
  );

  // TODO: add pending transfer value to available balance

  return (
    <div className="tw-w-full tw-max-w-4xl tw-px-2 sm:tw-px-12 tw-mx-auto">
      <BarCompositionChart
        className="tw-px-8 tw-pt-8 tw-pb-6 tw-bg-gray-3 tw-rounded-xl tw-mt-12"
        totalLabel={t(translations.perpetualPage.accountBalance.total)}
        totalValueLabel={totalLabel}
        entries={chartEntries}
      />
      <div className="tw-mt-2 tw-text-right">
        <button
          className="tw-text-xs tw-font-medium tw-text-secondary tw-underline"
          onClick={onOpenTransactionHistory}
        >
          {t(translations.perpetualPage.accountBalance.viewHistory)}
        </button>
      </div>
      <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-mx-auto tw-mt-16 tw-space-y-4 md:tw-space-y-0 md:tw-space-x-10">
        <ActionButton onClick={onOpenDeposit}>
          {t(translations.perpetualPage.accountBalance.deposit)}
        </ActionButton>

        <ActionButton onClick={onOpenWithdraw}>
          {t(translations.perpetualPage.accountBalance.withdraw)}
        </ActionButton>

        <ActionButton onClick={onOpenTransfer}>
          {t(translations.perpetualPage.accountBalance.transfer)}
        </ActionButton>
      </div>
    </div>
  );
};

type ActionButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children }) => (
  <button
    className="tw-min-w-40 tw-min-h-10 tw-p-2 tw-text-base tw-text-primary tw-border tw-border-primary tw-bg-primary-10 tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-25"
    onClick={onClick}
  >
    {children}
  </button>
);
