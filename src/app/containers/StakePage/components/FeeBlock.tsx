import React, { useCallback, useMemo, useEffect } from 'react';
import { useCachedAssetPrice } from 'app/hooks/trading/useCachedAssetPrice';
import { useAccount } from 'app/hooks/useAccount';
import { useTranslation } from 'react-i18next';
import { AssetDetails } from 'utils/models/asset-details';
import { getContract } from 'utils/blockchain/contract-helpers';
import { Tooltip } from '@blueprintjs/core';
import { weiTo18, weiTo4 } from 'utils/blockchain/math-helpers';
import {
  staking_numTokenCheckpoints,
  getFeeSharingProxyContractName,
} from 'utils/blockchain/requests/staking';
import { useStaking_getAccumulatedFees } from 'app/hooks/staking/useStaking_getAccumulatedFees';
import { translations } from 'locales/i18n';
import { LoadableValue } from 'app/components/LoadableValue';
import { bignumber } from 'mathjs';
import { Asset } from 'types';
import { weiToUSD } from 'utils/display-text/format';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { Button, ButtonSize, ButtonStyle } from 'app/components/Button';
import { useGetNextPositiveCheckpoint } from 'app/pages/RewardPage/hooks/useGetNextPositiveCheckpoint';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { getMaxProcessableCheckpoints } from 'utils/helpers';

interface IFeeBlockProps {
  contractToken: AssetDetails;
  updateUsdTotal: (asset: AssetDetails, value: number) => void;
  useNewContract?: boolean;
  title?: string;
  frozen?: boolean;
  vestedFees?: boolean;
}

export const FeeBlock: React.FC<IFeeBlockProps> = ({
  contractToken,
  updateUsdTotal,
  useNewContract = false,
  title,
  frozen,
  vestedFees,
}) => {
  const account = useAccount();
  const { asset } = contractToken;
  const { t } = useTranslation();
  const isSovToken = useMemo(() => asset === Asset.SOV, [asset]);
  const token = useMemo(
    () =>
      isSovToken
        ? contractToken.getTokenContractName()
        : contractToken.getLendingContractName(),
    [contractToken, isSovToken],
  );

  const { value: maxCheckpoints } = useCacheCallWithValue(
    'feeSharingProxy',
    'totalTokenCheckpoints',
    -1,
    contractToken.getTokenContractAddress(),
  );

  const maxWithdrawCheckpoint = useMemo(
    () =>
      Number(maxCheckpoints) > getMaxProcessableCheckpoints(asset)
        ? String(getMaxProcessableCheckpoints(asset))
        : Number(maxCheckpoints),
    [maxCheckpoints, asset],
  );

  const { userCheckpoint } = useGetNextPositiveCheckpoint(
    contractToken.getTokenContractAddress(),
    Number(maxCheckpoints),
  );

  const dollars = useCachedAssetPrice(asset, Asset.USDT);
  const tokenAddress = getContract(token)?.address;
  const currency = useStaking_getAccumulatedFees(
    account,
    tokenAddress,
    useNewContract,
    Number(userCheckpoint?.checkpointNum),
    Number(maxWithdrawCheckpoint),
  );

  const dollarValue = useMemo(() => {
    if (!currency.value) {
      return '';
    }
    return bignumber(currency.value)
      .mul(dollars.value)
      .div(10 ** contractToken.decimals)
      .toFixed(0);
  }, [dollars.value, currency.value, contractToken.decimals]);

  const { send, ...tx } = useSendContractTx(
    getFeeSharingProxyContractName(useNewContract),
    'withdraw',
  );

  const handleWithdrawFee = useCallback(
    async e => {
      e.preventDefault();
      try {
        const numTokenCheckpoints = (await staking_numTokenCheckpoints(
          tokenAddress,
          useNewContract,
        )) as string;
        send([tokenAddress, numTokenCheckpoints, account]);
      } catch (e) {
        console.error(e);
      }
    },
    [tokenAddress, useNewContract, send, account],
  );

  useEffect(() => updateUsdTotal(contractToken, Number(weiTo4(dollarValue))), [
    contractToken,
    dollarValue,
    updateUsdTotal,
  ]);

  return (
    <>
      {(Number(currency.value) > 0 || isSovToken) && (
        <div className="tw-flex tw-justify-between tw-items-center tw-mb-1 tw-mt-1 tw-leading-6">
          <div className="tw-w-2/5">
            <Tooltip
              content={
                <>
                  {t(
                    translations.stake[
                      isSovToken ? 'convertedToRBTC' : 'sentLendingPool'
                    ],
                    { asset },
                  )}
                </>
              }
            >
              {isSovToken ? <>{title || asset} (?)</> : <>i{asset} (?)</>}
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
            disabled={
              frozen || currency.value === '0' || !userCheckpoint?.hasFees
            }
            onClick={handleWithdrawFee}
            className="tw-lowercase"
            dataActionId={`staking-withdrawalButton-${
              vestedFees ? 'vested' : ''
            }${asset}`}
            style={ButtonStyle.link}
            size={ButtonSize.sm}
          />
        </div>
      )}
      <TransactionDialog tx={tx} />
    </>
  );
};
