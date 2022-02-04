import React, { useContext, useMemo, useCallback, useEffect } from 'react';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import classNames from 'classnames';
import { getPriceColor, getPriceChange } from '../RecentTradesTable/utils';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { RecentTradesContext } from '../../contexts/RecentTradesContext';
import { Switch, Tooltip } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { getCollateralName, getCollateralLogo } from '../../utils/renderUtils';
import { Asset, Chain } from '../../../../../types';
import { gsnNetwork } from '../../../../../utils/gsn/GsnNetwork';
import { useWalletContext } from '@sovryn/react-wallet';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useBridgeNetworkSendTx } from '../../../../hooks/useBridgeNetworkSendTx';
import { getContract } from '../../../../../utils/blockchain/contract-helpers';
import { PERPETUAL_PAYMASTER } from '../../types';
import { bridgeNetwork } from '../../../BridgeDepositPage/utils/bridge-network';
import { toWei } from '../../../../../utils/blockchain/math-helpers';

type PairSelectorProps = {
  pair: PerpetualPair;
  collateral: Asset;
  onChange: (pair: PerpetualPairType) => void;
};

const perpetualPairs = PerpetualPairDictionary.list();

export const PairSelector: React.FC<PairSelectorProps> = ({
  pair,
  collateral,
  onChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { useMetaTransactions } = useSelector(selectPerpetualPage);
  const { wallet } = useWalletContext();

  // FIXME: REMOVE THIS SHITTY TESTING CODE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  const { send } = useBridgeNetworkSendTx(
    Chain.BSC,
    'PERPETUALS_token',
    'approve',
  );

  const onReset = useCallback(async () => {
    await send([getContract('perpetualManager').address, toWei(0)]);
    await send([PERPETUAL_PAYMASTER, toWei(0)]);
  }, [send]);

  useEffect(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('PERPETUALS_token').address,
        getContract('PERPETUALS_token').abi,
        'allowance',
        [wallet.address.toLowerCase(), getContract('perpetualManager').address],
      )
      .then(result => console.log('allowance manager' + result))
      .catch(console.error);
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('PERPETUALS_token').address,
        getContract('PERPETUALS_token').abi,
        'allowance',
        [wallet.address.toLowerCase(), PERPETUAL_PAYMASTER],
      )
      .then(result => console.log('allowance paymaster' + result))
      .catch(console.error);
  }, [useMetaTransactions]);
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const { checkMaintenance, States } = useMaintenance();
  const isGsnInMaintenance = useMemo(
    () =>
      checkMaintenance(States.PERPETUALS) ||
      checkMaintenance(States.PERPETUALS_GSN),
    [checkMaintenance, States],
  );

  const [collateralLogo, collateralName] = useMemo(
    () => [getCollateralLogo(collateral), getCollateralName(collateral)],
    [collateral],
  );

  const isGsnSupported = useMemo(
    () => wallet.providerType && gsnNetwork.isSupportedByConnectedWallet(),
    [wallet.providerType],
  );

  const onToggleMetaTransactions = useCallback(() => {
    dispatch(walletProviderActions.setSignTypedRequired(!useMetaTransactions));
    dispatch(actions.setUseMetaTransactions(!useMetaTransactions));
  }, [dispatch, useMetaTransactions]);

  return (
    <div className="tw-w-full tw-bg-gray-3">
      <div className="tw-container tw-flex tw-flex-row">
        <div className="tw-flex tw-flex-row tw-items-center tw-w-56 tw-px-4 tw-py-1.5">
          <img
            className="tw-w-auto tw-h-7 tw-mr-2"
            src={collateralLogo}
            alt={collateralName}
          />
          <span className="tw-font-bold tw-text-sm">{collateralName}</span>
        </div>
        <div className="tw-flex tw-flex-row tw-items-center tw-flex-1">
          {perpetualPairs.map(entry => (
            <PairSelectorButton
              key={entry.id}
              pair={entry}
              isSelected={pair.id === entry.id}
              onSelect={onChange}
            />
          ))}
        </div>
        <button onClick={onReset}>reset approval</button>
        <div className="tw-flex tw-flex-row tw-items-center tw-px-4">
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
                      translations.perpetualPage.pairSelector.tooltips
                        .gsnUnsupported,
                    )}
                  </p>
                )}
                {t(
                  useMetaTransactions
                    ? translations.perpetualPage.pairSelector.tooltips
                        .gsnEnabled
                    : translations.perpetualPage.pairSelector.tooltips
                        .gsnDisabled,
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
        </div>
      </div>
    </div>
  );
};

type PairSelectorButtonProps = {
  pair: PerpetualPair;
  isSelected: boolean;
  onSelect: (pair: PerpetualPairType) => void;
};

const PairSelectorButton: React.FC<PairSelectorButtonProps> = ({
  pair,
  isSelected,
  onSelect,
}) => {
  const { trades } = useContext(RecentTradesContext);
  const latestPrice = trades[0]?.price;
  const previousPrice = trades[1]?.price;
  const color = useMemo(
    () =>
      getPriceColor(getPriceChange(previousPrice || latestPrice, latestPrice)),
    [previousPrice, latestPrice],
  );

  const onClick = useCallback(() => !isSelected && onSelect(pair.pairType), [
    onSelect,
    pair,
    isSelected,
  ]);

  return (
    <div
      className={classNames(
        'tw-flex tw-flex-row tw-items-center tw-min-w-56 tw-px-3 tw-py-1.5 tw-mr-2 tw-rounded-lg tw-select-none tw-transition-colors tw-duration-300',
        isSelected
          ? 'tw-bg-gray-5'
          : 'tw-bg-gray-4 tw-cursor-pointer hover:tw-bg-gray-5',
      )}
      onClick={onClick}
    >
      <span className="tw-font-medium tw-mr-2 tw-text-xs">{pair.name}</span>
      <span
        className={classNames(
          'tw-flex-auto tw-text-right tw-font-medium tw-text-base',
          color,
        )}
      >
        {toNumberFormat(latestPrice, 1)}
      </span>
    </div>
  );
};
