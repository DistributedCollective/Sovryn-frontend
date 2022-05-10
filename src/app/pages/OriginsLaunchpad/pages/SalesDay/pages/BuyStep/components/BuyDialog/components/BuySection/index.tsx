import { AmountInput } from 'app/components/Form/AmountInput';
import { translations } from 'locales/i18n';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';

import { Asset } from 'types';
import { TxStatus } from 'store/global/transactions-store/types';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useAccount } from 'app/hooks/useAccount';
import { usePrevious } from 'app/hooks/usePrevious';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { useSwapsExternal_approveAndSwapExternal } from 'app/hooks/swap-network/useSwapsExternal_approveAndSwapExternal';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { useApproveAndContribute } from 'app/pages/OriginsLaunchpad/hooks/useApproveAndContribute';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { BalanceOfAsset } from './components/BalanceOfAsset';
import styles from './index.module.scss';
import { TransactionDialog } from 'app/components/TransactionDialog';

interface IBuySectionProps {
  saleName: string;
  depositRate: number;
  sourceToken: Asset;
  totalDeposit: string;
}

const slippage = 0.5;

export const BuySection: React.FC<IBuySectionProps> = ({
  saleName,
  depositRate,
  totalDeposit,
}) => {
  const { t } = useTranslation();
  const connected = useCanInteract(true);

  const [sourceToken, setSourceToken] = useState(Asset.SOV);
  const [amount, setAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState(amount);

  const account = useAccount();
  const balance = useAssetBalanceOf(sourceToken);
  const weiAmount = useWeiAmount(amount);
  const weiTokenAmount = useWeiAmount(tokenAmount);

  const isValidAmount = useMemo(
    () =>
      !balance.loading &&
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiTokenAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(balance.value),
    [weiAmount, weiTokenAmount, balance],
  );

  const { value: amountInSOV } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    Asset.SOV,
    weiAmount,
  );
  const { minReturn } = useSlippage(amountInSOV, slippage);
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

  const { contribute, ...buyTx } = useApproveAndContribute();

  useEffect(() => {
    if (
      sourceToken !== Asset.SOV &&
      txSwap?.status === TxStatus.CONFIRMED &&
      oldSwapStatus !== TxStatus.CONFIRMED
    ) {
      contribute(
        bignumber(amountInSOV).mul(100).toString(),
        Asset.MYNT,
        amountInSOV,
        Asset.SOV,
      );
    }
  }, [sourceToken, txSwap, contribute, amountInSOV, oldSwapStatus]);

  const getMyntAmount = useCallback(() => {
    const amount = sourceToken === Asset.SOV ? weiAmount : amountInSOV;
    return bignumber(amount).mul(100);
  }, [sourceToken, weiAmount, amountInSOV]);

  const onBuyClick = useCallback(() => {
    if (sourceToken === Asset.SOV) {
      contribute(
        bignumber(weiAmount).mul(100).toString(),
        Asset.MYNT,
        weiAmount,
        Asset.SOV,
      );
    } else {
      sendSwap();
    }
  }, [sourceToken, contribute, weiAmount, sendSwap]);

  return (
    <div className={styles.buyWrapper}>
      <div className="tw-max-w-sm tw-mx-auto tw-flex tw-flex-col tw-justify-between tw-h-full">
        <div>
          <BalanceOfAsset className="" asset={sourceToken} />
          <div className="tw-mt-12">
            <div className="tw-text-sm tw-text-left tw-font-light tw-mb-2 tw-text-gray-9">
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
            {t(
              translations.originsLaunchpad.saleDay.buyStep.buyDialog
                .estimatedTokenAmount,
              {
                token: saleName,
                amount: weiToFixed(getMyntAmount(), 4),
              },
            )}{' '}
            <AssetRenderer assetString={saleName} />
          </div>

          <button
            className={styles.buyButton}
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
          </button>
        </div>

        <div className="tw-text-sm tw-text-center tw-font-light tw-text-gray-9 tw-mt-14">
          {t(
            translations.originsLaunchpad.saleDay.buyStep.buyDialog
              .yourTotalDeposit,
          )}{' '}
          :<span className="tw-px-2">{weiToFixed(totalDeposit, 4)}</span>
          <AssetRenderer asset={Asset.SOV} />
        </div>
      </div>

      <TransactionDialog tx={buyTx} />
      {txSwap && txSwap?.status !== TxStatus.CONFIRMED && (
        <TransactionDialog tx={txSwap} />
      )}
    </div>
  );
};
