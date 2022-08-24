import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { bignumber, max } from 'mathjs';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Asset } from '../../../../../types';
import { translations } from 'locales/i18n';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { FormGroup } from 'app/components/Form/FormGroup';
import { gasLimit } from '../../../../../utils/classifiers';
import { TxType } from '../../../../../store/global/transactions-store/types';
import { toWei } from '../../../../../utils/blockchain/math-helpers';
import { FastBtcButton } from '../FastBtcButton';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { NetworkAwareComponentProps } from '../../types';
import {
  getBTCAssetForNetwork,
  getFastBTCWithdrawalContract,
} from '../../helpers';
import { WithdrawDetails } from '../Withdraw/WithdrawDetails';
import { AmountInput } from './AmountInput';
import { useBridgeNetworkBalance } from 'app/hooks/useBridgeNetworkBalance';
import { btcInSatoshis } from 'app/constants';

export const AmountForm: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { amount, set, limits, aggregatorLimits } = useContext(WithdrawContext);
  const { t } = useTranslation();

  const balance = useBridgeNetworkBalance(
    network,
    getFastBTCWithdrawalContract(network, 'btcToken').address,
  );

  const [value, setValue] = useState(amount);

  const invalid = useMemo(() => {
    const weiAmount = toWei(value || '0');
    const weiMaxLimit = toWei(limits.max / btcInSatoshis);
    const weiMinLimit = toWei(limits.min / btcInSatoshis);

    if (bignumber(weiAmount).lessThanOrEqualTo(0)) {
      return true;
    }

    if (
      bignumber(weiAmount).lessThan(
        max(bignumber(aggregatorLimits.min), bignumber(weiMinLimit)),
      )
    ) {
      return true;
    }

    if (bignumber(weiAmount).greaterThan(weiMaxLimit)) {
      return true;
    }

    return bignumber(weiAmount).greaterThan(balance.value || '0');
  }, [value, balance.value, limits.min, limits.max, aggregatorLimits.min]);

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
            asset={Asset.BTCS}
            maxAmount={balance.value}
            gasFee={gasLimit[TxType.FAST_BTC_WITHDRAW].toString()}
            balance={balance.value}
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
            text={t(translations.common.continue)}
            onClick={onContinueClick}
            disabled={invalid}
          />
        </div>
      </div>
    </>
  );
};
