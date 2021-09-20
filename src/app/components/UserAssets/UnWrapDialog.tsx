import React, { useCallback, useMemo, useState } from 'react';
import { Dialog } from 'app/containers/Dialog';
import { FormGroup } from '../Form/FormGroup';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AmountInput } from '../Form/AmountInput';
import { Asset } from 'types';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { noop } from 'app/constants';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { bignumber } from 'mathjs';
import { BuyButton, Img } from './styled';
import styles from 'app/components/Dialogs/dialog.module.scss';
import image from 'assets/images/arrow-down.svg';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { useAccount } from 'app/hooks/useAccount';
import { useUnWrap } from '../../hooks/portfolio/useUnWrap';
import { TxDialog } from '../Dialogs/TxDialog';
import { gasLimit } from '../../../utils/classifiers';
import { TxType } from '../../../store/global/transactions-store/types';

interface IConversionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnWrapDialog: React.FC<IConversionDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>('');
  const connected = useCanInteract(true);
  const account = useAccount();
  const { convert, ...convertTx } = useUnWrap();

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

  const txArgs = useMemo(() => [weiAmount], [weiAmount]);

  const txConfig = useMemo(
    () => ({
      from: account,
      gas: gasLimit[TxType.UNWRAP_WRBTC],
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
            {t(translations.userAssets.unwrapDialog.title)}
          </div>

          <FormGroup
            label={`${t(translations.userAssets.unwrapDialog.from)}:`}
            labelClassName="tw-text-sm"
          >
            <AmountInput
              value={amount}
              onChange={value => setAmount(value)}
              asset={Asset.WRBTC}
            />
          </FormGroup>

          <Img src={image} alt="Arrow" />

          <FormGroup
            label={`${t(translations.userAssets.unwrapDialog.to)}:`}
            labelClassName="tw-text-sm"
          >
            <AmountInput
              value={weiToFixed(weiAmount, 6)}
              onChange={noop}
              asset={Asset.RBTC}
              readonly={true}
            />
          </FormGroup>

          <div className="tw-mt-8">
            <TxFeeCalculator
              args={txArgs}
              txConfig={txConfig}
              contractName="WRBTC_token"
              methodName="withdraw"
              textClassName="tw-text-sm"
            />
          </div>

          <BuyButton disabled={!isSubmitEnabled} onClick={onConversionSubmit}>
            {t(translations.userAssets.unwrapDialog.cta)}
          </BuyButton>
        </div>
      </Dialog>
      <TxDialog tx={convertTx} />
    </>
  );
};
