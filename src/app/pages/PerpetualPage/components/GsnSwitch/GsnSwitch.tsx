import React, { useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../selectors';
import { useWalletContext } from '@sovryn/react-wallet';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { gsnNetwork } from '../../../../../utils/gsn/GsnNetwork';
import { actions } from '../../slice';
import { Tooltip, Switch } from '@blueprintjs/core';
import { translations } from '../../../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import {
  PERPETUAL_PAYMASTER,
  PerpetualPageModals,
  PERPETUAL_CHAIN,
} from '../../types';
import { bridgeNetwork } from '../../../BridgeDepositPage/utils/bridge-network';
import { getContract } from '../../../../../utils/blockchain/contract-helpers';
import { useAccount } from '../../../../hooks/useAccount';
import { BigNumber } from 'ethers';
import { toWei } from '../../../../../utils/blockchain/math-helpers';

export const GsnSwitch: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const account = useAccount();
  const { useMetaTransactions } = useSelector(selectPerpetualPage);
  const { wallet } = useWalletContext();

  const { checkMaintenance, States } = useMaintenance();
  const isGsnInMaintenance = useMemo(
    () =>
      checkMaintenance(States.PERPETUALS) ||
      checkMaintenance(States.PERPETUALS_GSN),
    [checkMaintenance, States],
  );

  const isGsnSupported = useMemo(
    () => wallet.providerType && gsnNetwork.isSupportedByConnectedWallet(),
    [wallet.providerType],
  );

  const onToggleMetaTransactions = useCallback(() => {
    if (!useMetaTransactions) {
      const contract = getContract('PERPETUALS_token');
      // on enabling meta transactions check wether or not the Paymaster already has allowance
      bridgeNetwork
        .call(PERPETUAL_CHAIN, contract.address, contract.abi, 'allowance', [
          account.toLowerCase(),
          PERPETUAL_PAYMASTER.toLowerCase(),
        ])
        .then(allowance => {
          if (BigNumber.from(allowance).lt(toWei(100))) {
            dispatch(actions.setModal(PerpetualPageModals.GSN_APPROVAL));
          } else {
            dispatch(actions.setUseMetaTransactions(!useMetaTransactions));
          }
        })
        .catch(console.error);
    } else {
      dispatch(actions.setUseMetaTransactions(!useMetaTransactions));
    }
  }, [dispatch, useMetaTransactions, account]);

  useEffect(() => {
    if (wallet.connected && useMetaTransactions) {
      if (isGsnInMaintenance || !gsnNetwork.isSupportedByConnectedWallet()) {
        dispatch(actions.setUseMetaTransactions(false));
      }
    }
  }, [wallet.connected, useMetaTransactions, isGsnInMaintenance, dispatch]);

  return (
    <Tooltip
      popoverClassName="tw-max-w-md tw-font-light"
      position="bottom-left"
      content={
        <>
          {isGsnInMaintenance && (
            <p className="tw-block tw-mb-2 tw-text-warning">
              {t(translations.common.maintenance)}
            </p>
          )}
          {!isGsnSupported && (
            <p className="tw-block tw-mb-2 tw-text-warning">
              {t(
                translations.perpetualPage.pairSelector.tooltips.gsnUnsupported,
              )}
            </p>
          )}
          {t(
            useMetaTransactions
              ? translations.perpetualPage.pairSelector.tooltips.gsnEnabled
              : translations.perpetualPage.pairSelector.tooltips.gsnDisabled,
          )}
        </>
      }
    >
      <Switch
        className="tw-mb-0"
        large
        label={t(translations.perpetualPage.pairSelector.gsn)}
        disabled={isGsnInMaintenance || !isGsnSupported}
        checked={useMetaTransactions}
        onChange={onToggleMetaTransactions}
      />
    </Tooltip>
  );
};
