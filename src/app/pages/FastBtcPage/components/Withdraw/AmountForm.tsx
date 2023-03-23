import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Asset } from '../../../../../types';
import { translations } from 'locales/i18n';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { useBalance } from '../../../../hooks/useBalance';
import { AmountInput } from '../../../../components/Form/AmountInput';
import { FormGroup } from 'app/components/Form/FormGroup';
import { gasLimit } from '../../../../../utils/classifiers';
import { TxType } from '../../../../../store/global/transactions-store/types';
import { WithdrawDetails } from './WithdrawDetails';
import { FastBtcButton } from '../FastBtcButton';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { NetworkAwareComponentProps } from '../../types';
import { getBTCAssetForNetwork } from '../../helpers';
import { btcInSatoshis } from 'app/constants';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

export const AmountForm: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { amount, limits, set } = useContext(WithdrawContext);
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);

  const balance = useBalance();

  const [value, setValue] = useState(amount);

  const invalid = useMemo(() => {
    const amount = value;
    const satoshiAmount = Number(amount) * btcInSatoshis;
    if (
      bignumber(satoshiAmount).lessThanOrEqualTo(0) ||
      bignumber(satoshiAmount).lessThan(limits.min) ||
      bignumber(satoshiAmount).greaterThan(limits.max)
    ) {
      return true;
    }

    return bignumber(satoshiAmount)
      .add(gasLimit[TxType.FAST_BTC_WITHDRAW])
      .greaterThan(balance.value || '0');
  }, [value, balance.value, limits.min, limits.max]);

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        amount: value,
        step: WithdrawStep.ADDRESS,
      })),
    [set, value],
  );

  const asset = getBTCAssetForNetwork(network);

  return (
    <>
      <div className="tw-w-full tw-max-w-80 tw-mx-auto tw-mb-14">
        <FormGroup
          label={t(translations.fastBtcPage.withdraw.amountForm.withdrawAmount)}
          labelClassName="tw-text-sm tw-font-semibold"
        >
          <AmountInput
            value={value}
            onChange={setValue}
            asset={Asset.RBTC}
            maxAmount={balance.value}
            gasFee={gasLimit[TxType.FAST_BTC_WITHDRAW].toString()}
          />
          <div className="tw-mt-1 tw-text-left tw-text-sm tw-mb-8">
            <Trans
              i18nKey={
                translations.fastBtcPage.withdraw.amountForm.availableBalance
              }
              components={[
                <LoadableValue
                  value={<strong>{weiToNumberFormat(balance.value, 4)}</strong>}
                  loading={balance.loading}
                />,
                <AssetSymbolRenderer asset={asset} />,
              ]}
            />
          </div>
        </FormGroup>
        <WithdrawDetails className="tw-bg-transparent" network={network} />

        <div className="tw-px-8 tw-text-center">
          <FastBtcButton
            className="tw-absolute tw-right-0 tw-left-0 tw-bottom-8 tw-mx-auto"
            text={t(translations.common.next)}
            onClick={onContinueClick}
            disabled={invalid || fastBtcLocked}
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
