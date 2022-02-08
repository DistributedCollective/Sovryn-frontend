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

export const AmountForm: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { amount, limits, set } = useContext(WithdrawContext);
  const { t } = useTranslation();

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
      <div className="tw-mb-6 tw-text-2xl tw-text-center tw-font-semibold">
        <Trans
          i18nKey={translations.fastBtcPage.withdraw.amountForm.title}
          components={[<AssetSymbolRenderer asset={asset} />]}
        />
      </div>

      <div className="tw-w-full">
        <WithdrawDetails network={network} />

        <FormGroup
          label={t(translations.fastBtcPage.withdraw.amountForm.withdrawAmount)}
        >
          <AmountInput
            value={value}
            onChange={setValue}
            asset={Asset.RBTC}
            maxAmount={balance.value}
            gasFee={gasLimit[TxType.FAST_BTC_WITHDRAW].toString()}
          />
          <div className="tw-mt-1 tw-text-right tw-text-xs tw-my-8">
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

        <div className="tw-px-8">
          <FastBtcButton
            text={t(translations.common.continue)}
            onClick={onContinueClick}
            disabled={invalid}
          />
        </div>
      </div>
    </>
  );
};
