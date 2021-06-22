import { AmountInput } from 'app/components/Form/AmountInput';
import { translations } from 'locales/i18n';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Asset } from 'types';
import { BuyWrapper, BuyButton } from './styled';
import { useTranslation } from 'react-i18next';
import imgArrowDown from 'assets/images/arrow-down.svg';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { TxDialog } from '../TxDialog';
import { noop } from 'app/constants';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useApproveAndBuyToken } from 'app/pages/OriginsLaunchpad/hooks/useApproveAndBuyToken';

interface IBuySectionProps {
  saleName: string;
  depositRate: number;
}

export const BuySection: React.FC<IBuySectionProps> = ({
  saleName,
  depositRate,
}) => {
  const { t } = useTranslation();
  const connected = useCanInteract(true);

  const [amount, setAmount] = useState('');
  const weiAmount = useWeiAmount(amount);

  const [tokenAmount, setTokenAmount] = useState(amount);
  const weiTokenAmount = useWeiAmount(tokenAmount);

  const { value: balance } = useAssetBalanceOf(Asset.RBTC);

  const isValidAmount = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiTokenAmount).greaterThan(0)
    );
  }, [weiAmount, weiTokenAmount]);

  useEffect(() => setTokenAmount(`${Number(amount) * depositRate}`), [
    amount,
    depositRate,
  ]);

  const { buy, ...buyTx } = useApproveAndBuyToken();

  const onBuyClick = useCallback(
    () => buy(1, weiTokenAmount, 'FISH', weiAmount, Asset.RBTC),
    [buy, weiAmount, weiTokenAmount],
  );

  console.log(buyTx);

  return (
    <BuyWrapper>
      <div className="tw-max-w-xs tw-mx-auto">
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
              { token: saleName },
            )}
            :
          </div>
          <AmountInput
            value={tokenAmount}
            assetString={saleName}
            readonly={true}
            onChange={noop}
          />
        </div>

        <BuyButton
          disabled={buyTx.loading || !isValidAmount || !connected}
          onClick={onBuyClick}
        >
          <span>
            {t(
              translations.originsLaunchpad.saleDay.buyStep.buyDialog.buyButton,
              { token: saleName },
            )}
          </span>
        </BuyButton>

        <TxDialog tx={buyTx} />
      </div>
    </BuyWrapper>
  );
};
