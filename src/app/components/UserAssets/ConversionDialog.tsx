import React, { useCallback, useMemo, useState } from 'react';
import { Dialog } from 'app/containers/Dialog';
import { FormGroup } from '../Form/FormGroup';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AmountInput } from '../Form/AmountInput';
import { Asset } from 'types';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { TxDialog } from './TxDialog/index';
import { noop } from 'app/constants';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { bignumber } from 'mathjs';
import { BuyButton, Img } from './styled';
import styles from 'app/components/Dialogs/dialog.module.scss';
import image from 'assets/images/arrow-down.svg';
import { useConvertToXUSD } from 'app/hooks/portfolio/useConvertToXUSD';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { getContract } from 'utils/blockchain/contract-helpers';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';
import { useAccount } from 'app/hooks/useAccount';

interface IConversionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConversionDialog: React.FC<IConversionDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>('');
  const connected = useCanInteract(true);
  const account = useAccount();
  const { convert, ...convertTx } = useConvertToXUSD();

  const weiAmount = useWeiAmount(amount);

  const isSubmitEnabled = useMemo(
    () =>
      connected && bignumber(weiAmount).greaterThan(0) && !convertTx.loading,
    [connected, convertTx.loading, weiAmount],
  );

  const onConversionSubmit = useCallback(() => {
    convert(weiAmount);
    onClose();
  }, [convert, onClose, weiAmount]);

  const txArgs = useMemo(
    () => [getContract('USDT_token').address, weiAmount, account],
    [account, weiAmount],
  );

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
      <Dialog
        isOpen={isOpen}
        isCloseButtonShown={true}
        onClose={onClose}
        className={styles.dialog}
      >
        <div className="tw-max-w-xs tw-mx-auto">
          <div className="tw-text-2xl tw-text-center tw-font-semibold tw-mb-8">
            {t(translations.userAssets.convertDialog.title)}
          </div>

          <FormGroup
            label={`${t(translations.userAssets.convertDialog.from)}:`}
            labelClassName="tw-text-sm"
          >
            <AmountInput
              value={amount}
              onChange={value => setAmount(value)}
              asset={Asset.USDT}
            />
          </FormGroup>

          <Img src={image} alt="Arrow" />

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

          <BuyButton disabled={!isSubmitEnabled} onClick={onConversionSubmit}>
            {t(translations.userAssets.convertDialog.cta)}
          </BuyButton>
        </div>
      </Dialog>
      <TxDialog tx={convertTx} />
    </>
  );
};
