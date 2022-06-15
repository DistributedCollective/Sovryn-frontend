import { Asset } from 'types';
import { SendTxResponse } from 'app/hooks/useSendContractTx';
import React, { useCallback, useMemo, useState } from 'react';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useTranslation } from 'react-i18next';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useAccount } from 'app/hooks/useAccount';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { bignumber } from 'mathjs';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';
import { translations } from 'locales/i18n';
import { FormGroup } from '../../Form/FormGroup';
import { AmountInput } from '../../Form/AmountInput';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { noop } from 'app/constants';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { Button, ButtonColor, ButtonSize, ButtonStyle } from '../../Button';
import { Icon } from '../../Icon';

interface IConversionDialogContentProps {
  asset: Asset;
  onClose: () => void;
  onConversionSubmit: (value: string) => void;
  convertTx: SendTxResponse;
}

export const ConversionDialogContent: React.FC<IConversionDialogContentProps> = ({
  asset,
  onConversionSubmit,
  convertTx,
}) => {
  const contract = getTokenContract(asset);

  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>('');
  const connected = useCanInteract(true);
  const account = useAccount();

  const weiAmount = useWeiAmount(amount);

  const isSubmitEnabled = useMemo(
    () =>
      connected && bignumber(weiAmount).greaterThan(0) && !convertTx.loading,
    [connected, convertTx.loading, weiAmount],
  );

  const handleSubmit = useCallback(() => {
    onConversionSubmit(weiAmount);
  }, [onConversionSubmit, weiAmount]);

  const txArgs = useMemo(() => [contract.address, weiAmount, account], [
    account,
    weiAmount,
    contract,
  ]);

  const txConfig = useMemo(
    () => ({
      from: account,
      gas: gasLimit[TxType.CONVERT_RUSDT_TO_XUSD],
      nonce: 1, // it doesn't matter for the calculation
    }),
    [account],
  );

  return (
    <>
      <div className="tw-max-w-xs tw-mx-auto">
        <div className="tw-text-2xl tw-text-center tw-font-semibold tw-mb-8">
          {t(translations.userAssets.convertDialog.title)}
        </div>

        <FormGroup
          label={`${t(translations.userAssets.convertDialog.from)}:`}
          labelClassName="tw-text-sm"
        >
          <AmountInput value={amount} onChange={setAmount} asset={asset} />
        </FormGroup>

        <div className="tw-text-center tw-mx-auto">
          <Icon
            icon="arrow-down-wide"
            className="tw-mx-auto tw-m-5"
            size={50}
          />
        </div>

        <FormGroup
          label={`${t(translations.userAssets.convertDialog.to)}:`}
          labelClassName="tw-text-sm"
        >
          <AmountInput
            value={weiToFixed(weiAmount, 6)}
            onChange={noop}
            asset={Asset.XUSD}
            readonly={true}
          />
        </FormGroup>

        <div className="tw-mt-8">
          <TxFeeCalculator
            args={txArgs}
            txConfig={txConfig}
            contractName="babelfishAggregator"
            methodName="mintTo"
            textClassName="tw-text-sm"
          />
        </div>

        <Button
          disabled={!isSubmitEnabled}
          onClick={handleSubmit}
          text={t(translations.userAssets.convertDialog.cta)}
          size={ButtonSize.lg}
          style={ButtonStyle.normal}
          color={ButtonColor.primary}
          className="tw-w-full"
        />
      </div>
    </>
  );
};
