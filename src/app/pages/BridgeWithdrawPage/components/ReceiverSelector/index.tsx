import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chain } from 'types';

import { actions } from '../../slice';
import { selectBridgeWithdrawPage } from '../../selectors';
import { FormGroup } from '../../../../components/Form/FormGroup';
import networkList from '../../../../components/NetworkRibbon/component/network.json';
import { BridgeNetworkDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { Input } from '../../../../components/Form/Input';
import { ActionButton } from 'app/components/Form/ActionButton';
import { discordInvite } from 'utils/classifiers';

import { CrossBridgeAsset } from 'app/pages/BridgeDepositPage/types/cross-bridge-asset';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { rskWalletAddressLength } from 'app/constants';
import styles from './index.module.scss';
import imgWarning from 'assets/images/warning_black_24dp.svg';
import classNames from 'classnames';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

interface IReceiverSelectorProps {
  address: string;
}

export function ReceiverSelector({ address }: IReceiverSelectorProps) {
  const { t } = useTranslation();
  const trans = translations.BridgeWithdrawPage.receiverSelector;
  const [showWarning, setShowWarning] = useState(false);
  const { sourceAsset, targetChain, targetAsset, receiver } = useSelector(
    selectBridgeWithdrawPage,
  );
  const dispatch = useDispatch();
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

  const network = useMemo(
    () => BridgeNetworkDictionary.get(targetChain as Chain),
    [targetChain],
  );

  const currentNetwork =
    networkList.find(item => item.chainId === network?.chainId)?.name ||
    network?.name;

  const [value, setValue] = useState(receiver);

  const selectReceiver = useCallback(() => {
    dispatch(actions.selectReceiver(value.toLowerCase()));
  }, [dispatch, value]);

  const valid = useMemo(() => {
    return value && value.length === rskWalletAddressLength;
  }, [value]);

  return (
    <div className="tw-flex tw-flex-col tw-items-center">
      <div className="tw-flex tw-flex-col tw-items-center">
        <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold tw-w-96">
          {t(trans.title, { currentNetwork })}
        </div>
        <div className="tw-w-80">
          <FormGroup label={`Receiving ${targetAsset} Address`}>
            <Input
              value={value}
              onChange={val => setValue(val)}
              onFocus={() => setShowWarning(true)}
            />
          </FormGroup>
        </div>
        <div className={classNames('text-center tw-pt-1', styles.warning)}>
          {showWarning ? (
            <div
              className={classNames(
                styles['address-warning'],
                'tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center',
              )}
            >
              <span className={'tw-flex tw-items-center'}>
                <img src={imgWarning} className="tw-mr-1.5" alt="warning" />
                {t(trans.withdrawWarning)}
              </span>

              <div
                className={classNames(
                  styles['withdraw-disclaimer'],
                  'tw-text-xs tw-mt-4',
                )}
              >
                {t(trans.withdrawDisclaimer)}
              </div>
            </div>
          ) : (
            <div className="tw-mb-12">{t(trans.confirm)}</div>
          )}
        </div>

        <ActionButton
          className="tw-mt-10 tw-w-80 tw-font-semibold tw-rounded-xl"
          text={t(translations.common.next)}
          disabled={
            bridgeLocked ||
            assetWithdrawLocked ||
            (targetChain && lockedChains[targetChain]) ||
            !valid
          }
          onClick={selectReceiver}
        />
        {(bridgeLocked ||
          assetWithdrawLocked ||
          (targetChain && lockedChains[targetChain])) && (
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
    </div>
  );
}
