import React, { useCallback, useMemo, useEffect } from 'react';
import { useCachedAssetPrice } from 'app/hooks/trading/useCachedAssetPrice';
import { useAccount } from 'app/hooks/useAccount';
import { useTranslation } from 'react-i18next';
import { getContract } from 'utils/blockchain/contract-helpers';
import { Tooltip } from '@blueprintjs/core';
import { weiTo18, weiTo4 } from 'utils/blockchain/math-helpers';
import { useStaking_getLegacyVestingFees } from 'app/hooks/staking/useStaking_getLegacyVestingFees';
import { translations } from 'locales/i18n';
import { LoadableValue } from 'app/components/LoadableValue';
import { bignumber } from 'mathjs';
import { Asset } from 'types';
import { weiToUSD } from 'utils/display-text/format';
import { useSendToContractAddressTx } from 'app/hooks/useSendToContractAddressTx';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { Button, ButtonSize, ButtonStyle } from 'app/components/Button';
import { IBaseFeeBlockProps } from './FeeBlock';
import VestingABI from 'utils/blockchain/abi/Vesting.json';
import { AbiItem } from 'web3-utils';

interface ILegacySovFeeBlock extends IBaseFeeBlockProps {
  vestingContract: string;
}

export const LegacySovFeeBlock: React.FC<ILegacySovFeeBlock> = ({
  contractToken,
  updateUsdTotal,
  title,
  frozen,
  vestingContract,
}) => {
  const account = useAccount();
  const { asset } = contractToken;
  const { t } = useTranslation();
  const token = useMemo(() => contractToken.getTokenContractName(), [
    contractToken,
  ]);
  const dollars = useCachedAssetPrice(asset, Asset.USDT);
  const tokenAddress = getContract(token)?.address;

  const currency = useStaking_getLegacyVestingFees(
    vestingContract,
    tokenAddress,
  );

  const dollarValue = useMemo(() => {
    if (currency.value === null) {
      return '';
    }
    return bignumber(currency.value)
      .mul(dollars.value)
      .div(10 ** contractToken.decimals)
      .toFixed(0);
  }, [dollars.value, currency.value, contractToken.decimals]);

  const { send, ...tx } = useSendToContractAddressTx(
    vestingContract,
    VestingABI as AbiItem[],
    'collectDividends',
  );
  const handleWithdrawFee = useCallback(
    async e => {
      e.preventDefault();
      try {
        send([tokenAddress, 100, account]);
      } catch (e) {
        console.error(e);
      }
    },
    [tokenAddress, send, account],
  );

  useEffect(() => updateUsdTotal(contractToken, Number(weiTo4(dollarValue))), [
    contractToken,
    dollarValue,
    updateUsdTotal,
  ]);

  return (
    <>
      {
        <div className="tw-flex tw-justify-between tw-items-center tw-mb-1 tw-mt-1 tw-leading-6">
          <div className="tw-w-2/5">
            <Tooltip content={<>{t(translations.stake.vestingFeesTooltip)}</>}>
              {<>{title || asset} (?)</>}
            </Tooltip>
          </div>
          <div className="tw-w-1/2 tw-mx-4 tw-flex tw-flex-row tw-space-x-2">
            <div>
              <Tooltip content={`${weiTo18(currency.value)}`}>
                <LoadableValue
                  value={weiTo4(currency.value)}
                  loading={currency.loading && currency.value === '0'}
                  loaderContent="0.0000"
                />
              </Tooltip>{' '}
              ≈{' '}
            </div>
            <div>
              <Tooltip content={`${weiToUSD(dollarValue, 6)}`}>
                <LoadableValue
                  value={weiToUSD(dollarValue)}
                  loading={
                    (dollars.loading && currency.value !== '0') ||
                    (currency.loading && currency.value === '0')
                  }
                  loaderContent="0.0000"
                />
              </Tooltip>
            </div>
          </div>
          <Button
            text={t(translations.userAssets.actions.withdraw)}
            disabled={frozen || currency.value === '0'}
            onClick={handleWithdrawFee}
            className="tw-lowercase"
            dataActionId={`staking-withdrawalButton-${asset}`}
            style={ButtonStyle.link}
            size={ButtonSize.sm}
          />
        </div>
      }
      <TransactionDialog tx={tx} />
    </>
  );
};
