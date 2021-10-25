import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';

import { actions } from '../../slice';
import { Chain } from '../../../../../types';
import { selectBridgeWithdrawPage } from '../../selectors';
import { currentChainId, discordInvite } from 'utils/classifiers';

import { BridgeDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-dictionary';
import { SelectBox } from '../../../BridgeDepositPage/components/SelectBox';
import { CrossBridgeAsset } from '../../../BridgeDepositPage/types/cross-bridge-asset';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

export function ChainSelector() {
  const { sourceAsset, chain } = useSelector(selectBridgeWithdrawPage);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.BRIDGE]: bridgeLocked,
    [States.ETH_BRIDGE]: ethBridgeLocked,
    [States.BSC_BRIDGE]: bscBridgeLocked,
    [States.BRIDGE_SOV_WITHDRAW]: sovWithdrawLocked,
    [States.BRIDGE_XUSD_WITHDRAW]: xusdWithdrawLocked,
    [States.BRIDGE_ETH_WITHDRAW]: ethWithdrawLocked,
    [States.BRIDGE_BNB_WITHDRAW]: bnbWithdrawLocked,
  } = checkMaintenances();

  const lockedChains = useMemo(
    () => ({
      [Chain.ETH]: ethBridgeLocked,
      [Chain.BSC]: bscBridgeLocked,
    }),
    [ethBridgeLocked, bscBridgeLocked],
  );

  const selectNetwork = useCallback(
    (chain: Chain) => {
      dispatch(actions.selectTargetNetwork(chain));
    },
    [dispatch],
  );

  // It excludes current dapp chain (no RSK network), but i think it should be there in the end.
  const networks = useMemo(
    () =>
      BridgeDictionary.listNetworks()
        .filter(item => item.chainId !== currentChainId)
        .filter(item =>
          BridgeDictionary.get(chain, item.chain)?.getAsset(
            sourceAsset as CrossBridgeAsset,
          ),
        ),
    [sourceAsset, chain],
  );

  const lockedChainsVisible = useMemo(
    () =>
      networks.filter(val => val.chain && lockedChains[val.chain] === true)
        .length > 0,
    [lockedChains, networks],
  );

  const assetWithdrawLocked = useMemo(() => {
    switch (sourceAsset) {
      case CrossBridgeAsset.SOV:
        return sovWithdrawLocked;
      case CrossBridgeAsset.XUSD:
        return xusdWithdrawLocked;
      case CrossBridgeAsset.ETH:
        return ethWithdrawLocked;
      case CrossBridgeAsset.BNB:
        return bnbWithdrawLocked;
      default:
        return false;
    }
  }, [
    sourceAsset,
    sovWithdrawLocked,
    xusdWithdrawLocked,
    ethWithdrawLocked,
    bnbWithdrawLocked,
  ]);

  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
        {t(translations.BridgeWithdrawPage.chainSelector.chooseNetwork.title, {
          asset: sourceAsset,
        })}
      </div>
      <div className="tw-flex tw-px-2 tw-justify-center">
        {networks.map(item => (
          <SelectBox
            key={item.chain}
            onClick={() => selectNetwork(item.chain)}
            disabled={
              bridgeLocked || assetWithdrawLocked || lockedChains[item.chain]
            }
          >
            <img className="tw-mb-5 tw-mt-2" src={item.logo} alt={item.chain} />
            <div>
              <span className="tw-uppercase">{item.chain} </span>{' '}
              {t(translations.BridgeDepositPage.network)}
            </div>
          </SelectBox>
        ))}
      </div>
      {(bridgeLocked || assetWithdrawLocked || lockedChainsVisible) && (
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
}
