import { AmountInput } from 'form/AmountInput';
import { translations } from 'locales/i18n';
import React, { useMemo, useState } from 'react';
import { Asset } from 'types';
import { BuyWrapper, SlippageButton, BuyButton } from './styled';
import { useTranslation } from 'react-i18next';
import imgArrowDown from 'assets/images/arrow-down.svg';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { useSwapNetwork_conversionPath } from 'app/hooks/swap-network/useSwapNetwork_conversionPath';
import { useSwapNetwork_rateByPath } from 'app/hooks/swap-network/useSwapNetwork_rateByPath';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { useSwapNetwork_approveAndConvertByPath } from 'app/hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { bignumber } from 'mathjs';
import { maxMinusFee } from 'utils/helpers';
import { SlippageDialog } from 'app/pages/BuySovPage/components/BuyForm/Dialogs/SlippageDialog';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { LoadableValue } from 'app/components/LoadableValue';
import { weiToNumberFormat } from 'utils/display-text/format';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { noop } from 'app/constants';
import { useCanInteract } from 'app/hooks/useCanInteract';

const tokenAddress = (asset: Asset) =>
  AssetsDictionary.get(asset).getTokenContractAddress();

const gasLimit = 340000;

export const BuySection: React.FC = () => {
  const { t } = useTranslation();
  const connected = useCanInteract(true);

  const [amount, setAmount] = useState('');
  const [openSlippage, setOpenSlippage] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const weiAmount = useWeiAmount(amount);

  const { value: balance } = useAssetBalanceOf(Asset.RBTC);

  // The second asset needs to be changed
  const { value: path } = useSwapNetwork_conversionPath(
    tokenAddress(Asset.RBTC),
    tokenAddress(Asset.SOV),
  );

  const { value: rateByPath } = useSwapNetwork_rateByPath(path, weiAmount);

  const { minReturn } = useSlippage(rateByPath, slippage);

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
        maxMinusFee(balance, Asset.RBTC, gasLimit),
      )
    );
  }, [balance, minReturn, weiAmount]);

  return (
    <BuyWrapper>
      <div className="tw-max-w-xs">
        <div>
          <div className="tw-text-sm tw-text-left tw-font-extralight tw-mb-2 tw-text-white">
            {t(
              translations.originsLaunchpad.saleDay.buyStep.buyDialog
                .enterAmount,
            )}
            :
          </div>
          <AmountInput
            value={amount}
            onChange={value => setAmount(value)}
            asset={Asset.RBTC}
          />
        </div>

        <img
          src={imgArrowDown}
          alt="swap"
          className="tw-h-8 tw-mx-auto tw-mt-10 tw-mb-8"
        />

        <div>
          <div className="tw-text-sm tw-text-left tw-font-extralight tw-mb-2 tw-text-white">
            {t(
              translations.originsLaunchpad.saleDay.buyStep.buyDialog
                .tokenReceived,
              { token: 'FISH' },
            )}
            :
          </div>
          <AmountInput
            value={weiToNumberFormat(rateByPath, 4)}
            asset={Asset.SOV}
            readonly={true}
            onChange={noop}
          />
        </div>

        <div className="tw-flex tw-items-center tw-justify-between tw-mt-5">
          <div className="tw-text-xs tw-font-extralight">
            {t(
              translations.originsLaunchpad.saleDay.buyStep.buyDialog
                .minimumReceived,
            )}{' '}
            <LoadableValue
              loading={false}
              value={weiToNumberFormat(minReturn, 4)}
              tooltip={weiTo18(minReturn)}
            />{' '}
            SOV
          </div>
          <SlippageButton onClick={() => setOpenSlippage(true)}>
            <span className="sr-only">Slippage</span>
          </SlippageButton>
        </div>

        <BuyButton
          disabled={tx.loading || !isValidAmount || !connected}
          onClick={() => send()}
        >
          <span>
            {t(
              translations.originsLaunchpad.saleDay.buyStep.buyDialog.buyButton,
              { token: 'FISH' },
            )}
          </span>
        </BuyButton>

        <SlippageDialog
          isOpen={openSlippage}
          onClose={() => setOpenSlippage(false)}
          amount={rateByPath}
          value={slippage}
          onChange={value => setSlippage(value)}
        />

        <TxDialog tx={tx} />
      </div>
    </BuyWrapper>
  );
};
