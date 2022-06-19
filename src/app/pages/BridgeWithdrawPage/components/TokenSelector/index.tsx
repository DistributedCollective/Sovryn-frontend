import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chain } from 'types';
import { translations } from 'locales/i18n';
import { useTranslation, Trans } from 'react-i18next';

import { actions } from '../../slice';
import { selectBridgeWithdrawPage } from '../../selectors';
import erc20Abi from '../../../../../utils/blockchain/abi/erc20.json';
import { WithdrawStep } from '../../types';
import { CrossBridgeAsset } from 'app/pages/BridgeDepositPage/types/cross-bridge-asset';
import { BridgeDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-dictionary';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { BridgeNetworkDictionary } from 'app/pages/BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { AssetModel } from '../../../BridgeDepositPage/types/asset-model';
import { TokenItem } from './TokenItem';
import { useAccount } from '../../../../hooks/useAccount';
import { discordInvite } from 'utils/classifiers';
import { useIsBridgeWithdrawLocked } from 'app/pages/BridgeWithdrawPage/hooks/useIsBridgeWithdrawLocked';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

export const TokenSelector: React.FC = () => {
  const { t } = useTranslation();

  const account = useAccount();
  const { chain, targetChain, targetAsset, sourceAsset } = useSelector(
    selectBridgeWithdrawPage,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (chain === null) {
      dispatch(actions.setStep(WithdrawStep.CHAIN_SELECTOR));
    }
  }, [chain, dispatch]);

  const selectTargetAsset = useCallback(
    (asset: CrossBridgeAsset) => {
      dispatch(actions.selectTargetAsset(asset));
    },
    [dispatch],
  );
  const currentAsset = useMemo(
    () =>
      BridgeDictionary.get(chain as Chain, targetChain as Chain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, targetChain, sourceAsset],
  );

  const targetAssets = useMemo(
    () =>
      (
        BridgeDictionary.get(targetChain as Chain, chain as Chain)?.assets || []
      ).filter(item => currentAsset?.aggregatedTokens?.includes(item.asset)),
    [chain, currentAsset, targetChain],
  );

  const [balances, setBalances] = useState<
    { key: CrossBridgeAsset; value: string }[]
  >([]);
  // todo this will be used for withdrawals later.
  useEffect(() => {
    const callData = targetAssets.map(item => {
      return {
        address: (
          currentAsset.bridgeTokenAddresses.get(item.asset) ||
          currentAsset.tokenContractAddress
        ).toLowerCase(),
        abi: erc20Abi,
        fnName: 'balanceOf',
        args: [
          currentAsset.aggregatorContractAddress?.toLowerCase() || account,
        ],
        key: item.asset,
      };
    });

    if (callData.length) {
      bridgeNetwork
        .multiCall(chain as any, callData)
        .then(({ returnData }) => {
          // todo render these balance limits to respected asset (only when chain is RSK)
          setBalances(
            Object.entries(returnData).map(([key, value]) => ({
              key: key as CrossBridgeAsset,
              value: currentAsset.fromWei((value as any).toString()) || 'x',
            })),
          );
        })
        .catch(error => {
          console.error('what', error);
          setBalances([]);
        });
    }
  }, [chain, targetChain, targetAsset, targetAssets, currentAsset, account]);

  const network = useMemo(
    () => BridgeNetworkDictionary.get(targetChain as Chain),
    [targetChain],
  );

  const getBalance = useCallback(
    (asset: CrossBridgeAsset) =>
      balances.find(item => item.key === asset)?.value || '0',
    [balances],
  );

  const bridgeWithdrawLocked = useIsBridgeWithdrawLocked(
    sourceAsset,
    targetChain,
  );

  return (
    <div>
      <div className="tw-mb-7 tw-text-base tw-text-center tw-font-semibold">
        {t(translations.BridgeWithdrawPage.tokenSelector.title, {
          network: network?.name,
        })}
      </div>
      {targetAssets.length > 0 ? (
        <div className="tw-flex tw-px-2 tw-justify-center">
          {targetAssets.map(item => {
            return (
              <TokenItem
                key={item.asset}
                sourceAsset={item.asset}
                image={item.image}
                symbol={item.symbol}
                balance={getBalance(item.asset)}
                loading={!balances.length}
                onClick={() => selectTargetAsset(item.asset)}
                disabled={bridgeWithdrawLocked}
              />
            );
          })}
        </div>
      ) : (
        <p className="tw-w-80 tw-text-center">
          {t(translations.BridgeWithdrawPage.tokenSelector.notSupported, {
            sourceAsset,
            network: network?.name,
          })}
        </p>
      )}
      {bridgeWithdrawLocked && (
        <ErrorBadge
          content={
            <Trans
              i18nKey={translations.maintenance.bridgeSteps}
              components={[
                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                >
                  x
                </a>,
              ]}
            />
          }
        />
      )}
    </div>
  );
};
