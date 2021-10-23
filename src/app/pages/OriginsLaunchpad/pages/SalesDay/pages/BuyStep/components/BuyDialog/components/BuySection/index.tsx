import { AmountInput } from 'app/components/Form/AmountInput';
import { translations } from 'locales/i18n';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';

import { Asset } from 'types';
import { TxStatus } from 'store/global/transactions-store/types';
import { BuyWrapper, BuyButton } from './styled';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useAccount } from 'app/hooks/useAccount';
import { usePrevious } from 'app/hooks/usePrevious';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { useSwapsExternal_approveAndSwapExternal } from 'app/hooks/swap-network/useSwapsExternal_approveAndSwapExternal';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
// import { useApproveAndBuyToken } from 'app/pages/OriginsLaunchpad/hooks/useApproveAndBuyToken';
import { useApproveAndContribute } from 'app/pages/OriginsLaunchpad/hooks/useApproveAndContribute';
import { TxDialog } from '../TxDialog';
import { TxDialog as SwapTxDialog } from 'app/components/Dialogs/TxDialog';
// import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { BalanceOfAsset } from './components/BalanceOfAsset';

interface IBuySectionProps {
  saleName: string;
  depositRate: number;
  sourceToken: Asset;
  tierId: number;
  maxAmount: string;
}

export const BuySection: React.FC<IBuySectionProps> = ({
  saleName,
  depositRate,
  sourceToken: defaultSourceToken,
  maxAmount,
}) => {
  const { t } = useTranslation();
  const connected = useCanInteract(true);

  const [sourceToken, setSourceToken] = useState<Asset>(Asset.SOV);
  const [amount, setAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState(amount);
  const [slippage] = useState(0.5);
  // const [isOverMaxLimit, setIsOverMaxLimit] = useState(false);

  const account = useAccount();
  const weiAmount = useWeiAmount(amount);
  const weiTokenAmount = useWeiAmount(tokenAmount);

  const isValidAmount = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiTokenAmount).greaterThan(0)
      // && !isOverMaxLimit
    );
  }, [weiAmount, weiTokenAmount]);

  const { value: totalDeposit } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    Asset.SOV,
    weiAmount,
  );
  const { minReturn } = useSlippage(totalDeposit, slippage);
  const { send: sendSwap, ...txSwap } = useSwapsExternal_approveAndSwapExternal(
    sourceToken,
    Asset.SOV,
    account,
    account,
    weiAmount,
    '0',
    minReturn,
    '0x',
  );
  const oldSwapStatus = usePrevious(txSwap.status);

  useEffect(() => setTokenAmount(`${Number(amount) * depositRate}`), [
    amount,
    depositRate,
  ]);

  // useEffect(
  //   () => setIsOverMaxLimit(bignumber(weiAmount).greaterThan(maxAmount)),
  //   [weiAmount, maxAmount],
  // );

  const { contribute, ...buyTx } = useApproveAndContribute();

  useEffect(() => {
    if (
      sourceToken !== Asset.SOV &&
      txSwap?.status === TxStatus.CONFIRMED &&
      oldSwapStatus !== TxStatus.CONFIRMED
    ) {
      contribute(
        bignumber(totalDeposit).mul(100).toString(),
        Asset.ZERO,
        totalDeposit,
        Asset.SOV,
      );
    }
  }, [sourceToken, txSwap, contribute, totalDeposit, oldSwapStatus]);

  const getAmountOfZERO = () => {
    const amountOfSOV = sourceToken === Asset.SOV ? weiAmount : totalDeposit;
    return bignumber(amountOfSOV).mul(100);
  };

  const onBuyClick = useCallback(() => {
    if (sourceToken === Asset.SOV) {
      contribute(
        bignumber(weiAmount).mul(100).toString(),
        Asset.ZERO,
        weiAmount,
        Asset.SOV,
      );
    } else {
      sendSwap();
    }
  }, [sourceToken, contribute, weiAmount, sendSwap]);

  return (
    <BuyWrapper>
      <div className="tw-max-w-sm tw-mx-auto tw-flex tw-flex-col tw-justify-between tw-h-full">
        <div>
          <BalanceOfAsset className="" asset={sourceToken} />
          <div className="tw-mt-12">
            <div className="tw-text-sm tw-text-left tw-font-extralight tw-mb-2 tw-text-gray-9">
              {t(
                translations.originsLaunchpad.saleDay.buyStep.buyDialog
                  .enterAmount,
              )}
            </div>
            <AmountInput
              value={amount}
              onChange={value => setAmount(value)}
              asset={sourceToken}
              assetSelectable={true}
              onSelectAsset={(asset: Asset) => setSourceToken(asset)}
            />
          </div>

          <div className="tw-mt-7 tw-text-sm tw-border tw-rounded-lg tw-border-gray-7 tw-py-2">
            Equivalent ZERO Token : {weiToFixed(getAmountOfZERO(), 4)}{' '}
            <AssetRenderer asset={Asset.ZERO} />
          </div>

          <BuyButton
            disabled={buyTx.loading || !isValidAmount || !connected}
            onClick={onBuyClick}
          >
            <span>
              {t(
                translations.originsLaunchpad.saleDay.buyStep.buyDialog
                  .buyButton,
                { token: saleName },
              )}
            </span>
          </BuyButton>
        </div>

        <div className="tw-text-sm tw-text-center tw-font-extralight tw-text-gray-9 tw-mt-14">
          {t(
            translations.originsLaunchpad.saleDay.buyStep.buyDialog
              .yourTotalDeposit,
          )}{' '}
          :
          <span className="tw-px-2">
            {weiToFixed(
              sourceToken === Asset.SOV ? weiAmount : totalDeposit,
              4,
            )}
          </span>
          <AssetRenderer asset={Asset.SOV} />
        </div>
      </div>
      <TxDialog tx={buyTx} />
      {txSwap && txSwap?.status !== TxStatus.CONFIRMED && (
        <SwapTxDialog tx={txSwap} />
      )}
    </BuyWrapper>
  );
};
