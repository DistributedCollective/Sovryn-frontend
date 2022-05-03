import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chain } from 'types';

import { actions } from '../../slice';
import { selectBridgeWithdrawPage } from '../../selectors';
import { FormGroup } from '../../../../components/Form/FormGroup';
import { BridgeNetworkDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { Input } from '../../../../components/Form/Input';
import { ActionButton } from 'app/components/Form/ActionButton';
import { discordInvite } from 'utils/classifiers';

import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { rskWalletAddressLength } from 'app/constants';
import styles from './index.module.scss';
import imgWarning from 'assets/images/warning_black_24dp.svg';
import classNames from 'classnames';
import { useIsBridgeWithdrawLocked } from 'app/pages/BridgeWithdrawPage/hooks/useIsBridgeWithdrawLocked';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { getNetworkByChainId } from '../../../../../utils/blockchain/networks';

interface IReceiverSelectorProps {
  address: string;
}

export const ReceiverSelector: React.FC<IReceiverSelectorProps> = ({
  address,
}) => {
  const { t } = useTranslation();
  const trans = translations.BridgeWithdrawPage.receiverSelector;
  const [showWarning, setShowWarning] = useState(false);
  const { sourceAsset, targetChain, targetAsset, receiver } = useSelector(
    selectBridgeWithdrawPage,
  );
  const dispatch = useDispatch();

  const network = useMemo(
    () => BridgeNetworkDictionary.get(targetChain as Chain),
    [targetChain],
  );

  const currentNetwork =
    (network?.chainId && getNetworkByChainId(network.chainId)?.name) ||
    network?.name;

  const [value, setValue] = useState(receiver);

  const selectReceiver = useCallback(() => {
    dispatch(actions.selectReceiver(value.toLowerCase()));
  }, [dispatch, value]);

  const valid = useMemo(() => {
    return value && value.length === rskWalletAddressLength;
  }, [value]);

  const bridgeWithdrawLocked = useIsBridgeWithdrawLocked(
    sourceAsset,
    targetChain,
  );

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
          disabled={bridgeWithdrawLocked || !valid}
          onClick={selectReceiver}
        />
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
    </div>
  );
};
