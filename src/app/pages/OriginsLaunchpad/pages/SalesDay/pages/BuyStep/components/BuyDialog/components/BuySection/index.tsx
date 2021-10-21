import { AmountInput } from 'app/components/Form/AmountInput';
import { translations } from 'locales/i18n';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Asset } from 'types';
import { BuyWrapper, BuyButton } from './styled';
import { useTranslation } from 'react-i18next';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { bignumber } from 'mathjs';
import { TxDialog } from '../TxDialog';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useApproveAndBuyToken } from 'app/pages/OriginsLaunchpad/hooks/useApproveAndBuyToken';
// import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { weiToFixed } from 'utils/blockchain/math-helpers';

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
  tierId,
  maxAmount,
}) => {
  const { t } = useTranslation();
  const connected = useCanInteract(true);

  const [sourceToken, setSourceToken] = useState<Asset>(Asset.SOV);
  const [amount, setAmount] = useState('');
  const [isOverMaxLimit, setIsOverMaxLimit] = useState(false);
  const weiAmount = useWeiAmount(amount);

  const [tokenAmount, setTokenAmount] = useState(amount);
  const weiTokenAmount = useWeiAmount(tokenAmount);

  const isValidAmount = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiTokenAmount).greaterThan(0)
      // && !isOverMaxLimit
    );
  }, [isOverMaxLimit, weiAmount, weiTokenAmount]);

  const { value: totalDeposit } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    Asset.SOV,
    weiAmount,
  );

  useEffect(() => setTokenAmount(`${Number(amount) * depositRate}`), [
    amount,
    depositRate,
  ]);

  useEffect(
    () => setIsOverMaxLimit(bignumber(weiAmount).greaterThan(maxAmount)),
    [weiAmount, maxAmount],
  );

  const { buy, ...buyTx } = useApproveAndBuyToken();

  const onBuyClick = useCallback(
    () => buy(tierId, weiTokenAmount, saleName, weiAmount, sourceToken),
    [buy, saleName, sourceToken, tierId, weiAmount, weiTokenAmount],
  );

  return (
    <BuyWrapper>
      <div className="tw-max-w-sm tw-mx-auto tw-flex tw-flex-col tw-justify-between tw-h-full">
        <div>
          <div>
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

        <div className="tw-text-sm tw-text-center tw-font-extralight tw-text-gray-9 tw-mt-28">
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
    </BuyWrapper>
  );
};
