import React, { useCallback, useMemo, useState } from 'react';
import { Dialog } from 'app/containers/Dialog';
import { FormGroup } from '../Form/FormGroup';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AmountInput } from '../Form/AmountInput';
import { Asset } from 'types';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useSwapNetwork_rateByPath } from 'app/hooks/swap-network/useSwapNetwork_rateByPath';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { useSwapNetwork_approveAndConvertByPath } from 'app/hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { useSwapNetwork_conversionPath } from 'app/hooks/swap-network/useSwapNetwork_conversionPath';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { TxDialog } from '../Dialogs/TxDialog';
import { noop } from 'app/constants';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { maxMinusFee } from 'utils/helpers';
import { BuyButton, Img } from './styled';
import styles from 'app/components/Dialogs/dialog.module.css';
import image from 'assets/images/arrow-down.svg';
import { AssetSymbolRenderer } from '../AssetSymbolRenderer';

const tokenAddress = (asset: Asset) => {
  return AssetsDictionary.get(asset).getTokenContractAddress();
};

const gasLimit = 340000;

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

  const weiAmount = useWeiAmount(amount);

  const { value: balance } = useAssetBalanceOf(Asset.USDT);

  // IMPORTANT: Just a temporary solution until the design is ready, will be swapped for the bridge conversion
  const { value: path } = useSwapNetwork_conversionPath(
    tokenAddress(Asset.USDT),
    tokenAddress(Asset.SOV),
  );
  const { value: rateByPath } = useSwapNetwork_rateByPath(path, weiAmount);
  const { minReturn } = useSlippage(rateByPath, 0.5);
  const { send, ...tx } = useSwapNetwork_approveAndConvertByPath(
    path,
    weiAmount,
    minReturn,
  );

  const isValidAmount = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(minReturn).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(
        maxMinusFee(balance, Asset.USDT, gasLimit),
      )
    );
  }, [balance, minReturn, weiAmount]);

  const onBuySubmit = useCallback(() => {
    send();
    onClose();
  }, [onClose, send]);

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
              value={weiToFixed(rateByPath, 6)}
              onChange={noop}
              asset={Asset.XUSD}
              readonly={true}
            />
          </FormGroup>

          <div className="tw-text-sm tw-font-thin tw-mt-8">
            {t(translations.userAssets.convertDialog.txFee)}: 0.0006{' '}
            <AssetSymbolRenderer asset={Asset.RBTC} />
          </div>

          <BuyButton
            disabled={tx.loading || !isValidAmount || !connected}
            onClick={onBuySubmit}
          >
            {t(translations.userAssets.convertDialog.cta)}
          </BuyButton>
        </div>
      </Dialog>
      <TxDialog tx={tx} />
    </>
  );
};
