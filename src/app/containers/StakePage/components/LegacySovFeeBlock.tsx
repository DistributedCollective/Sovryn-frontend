import React, { useCallback, useMemo, useEffect } from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { useTranslation } from 'react-i18next';
import { getContract } from 'utils/blockchain/contract-helpers';
import { Tooltip } from '@blueprintjs/core';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { useStaking_getLegacyVestingFees } from 'app/hooks/staking/useStaking_getLegacyVestingFees';
import { translations } from 'locales/i18n';
import { useSendToContractAddressTx } from 'app/hooks/useSendToContractAddressTx';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { Button, ButtonSize, ButtonStyle } from 'app/components/Button';
import { IBaseFeeBlockProps } from './FeeBlock';
import VestingABI from 'utils/blockchain/abi/Vesting.json';
import { AbiItem } from 'web3-utils';
import { useDollarValue } from 'app/hooks/useDollarValue';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';

const MAX_CHECKPOINTS = 100;

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
  const tokenAddress = getContract(token)?.address;

  const currency = useStaking_getLegacyVestingFees(
    vestingContract,
    tokenAddress,
  );

  const dollarValue = useDollarValue(asset, currency.value);

  const { send, ...tx } = useSendToContractAddressTx(
    vestingContract,
    VestingABI as AbiItem[],
    'collectDividends',
  );
  const handleWithdrawFee = useCallback(
    async e => {
      e.preventDefault();
      try {
        send([tokenAddress, MAX_CHECKPOINTS, account.toLowerCase()]);
      } catch (e) {
        console.error(e);
      }
    },
    [tokenAddress, send, account],
  );

  useEffect(
    () => updateUsdTotal(contractToken, Number(weiTo18(dollarValue.value))),
    [contractToken, dollarValue.value, updateUsdTotal],
  );

  return (
    <>
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-1 tw-mt-1 tw-leading-6">
        <div className="tw-w-2/5">
          <Tooltip content={t(translations.stake.vestingFeesTooltip)}>
            {
              <>
                {(title && title.charAt(0).toUpperCase() + title.slice(1)) ||
                  asset}{' '}
                (?)
              </>
            }
          </Tooltip>
        </div>
        <div className="tw-w-1/2 tw-mx-4 tw-flex tw-flex-row tw-space-x-2">
          <div>
            <AssetValue
              value={currency.value || '0.0000'}
              mode={AssetValueMode.auto}
              useTooltip={true}
              minDecimals={4}
              maxDecimals={4}
            />{' '}
            ≈{' '}
          </div>
          <div>
            USD{' '}
            <AssetValue
              value={dollarValue.value || '0.0000'}
              mode={AssetValueMode.auto}
              useTooltip={true}
              minDecimals={4}
              maxDecimals={4}
            />
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
      <TransactionDialog tx={tx} />
    </>
  );
};
