import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';
import { Table } from '../../../BridgeWithdrawPage/components/styled';

import { Button } from 'app/components/Button';

import { actions } from '../../slice';
import { selectBridgeDepositPage } from '../../selectors';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { AssetModel } from '../../types/asset-model';
import { useBridgeLimits } from '../../hooks/useBridgeLimits';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { NetworkModel } from '../../types/network-model';
import { translations } from 'locales/i18n';
import { useTranslation, Trans } from 'react-i18next';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { Chain } from 'types';

export function ReviewStep() {
  const {
    amount,
    chain,
    targetChain,
    sourceAsset,
    targetAsset,
    tx,
  } = useSelector(selectBridgeDepositPage);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const trans = translations.BridgeDepositPage.reviewStep;
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.BRIDGE]: bridgeLocked,
    [States.ETH_BRIDGE]: ethBridgeLocked,
    [States.BSC_BRIDGE]: bscBridgeLocked,
    [States.ETH_BRIDGE_DEPOSIT]: ethBridgeDepositLocked,
    [States.BSC_BRIDGE_DEPOSIT]: bscBridgeDepositLocked,
    [States.BRIDGE_SOV_DEPOSIT]: sovDepositLocked,
    [States.BRIDGE_XUSD_DEPOSIT]: xusdDepositLocked,
    [States.BRIDGE_ETH_DEPOSIT]: ethDepositLocked,
    [States.BRIDGE_BNB_DEPOSIT]: bnbDepositLocked,
  } = checkMaintenances();

  const assetDepositLocked = useMemo(() => {
    switch (targetAsset) {
      case CrossBridgeAsset.SOV:
        return sovDepositLocked;
      case CrossBridgeAsset.XUSD:
        return xusdDepositLocked;
      case CrossBridgeAsset.ETH:
        return ethDepositLocked;
      case CrossBridgeAsset.BNB:
        return bnbDepositLocked;
      default:
        return false;
    }
  }, [
    targetAsset,
    sovDepositLocked,
    xusdDepositLocked,
    ethDepositLocked,
    bnbDepositLocked,
  ]);

  const handleSubmit = useCallback(() => {
    dispatch(actions.submitForm());
  }, [dispatch]);

  const network = useMemo(
    () =>
      BridgeDictionary.listNetworks().find(
        item => item.chain === chain,
      ) as NetworkModel,
    [chain],
  );

  const lockedChains = useMemo(
    () => ({
      [Chain.ETH]: ethBridgeLocked || ethBridgeDepositLocked,
      [Chain.BSC]: bscBridgeLocked || bscBridgeDepositLocked,
    }),
    [
      ethBridgeLocked,
      ethBridgeDepositLocked,
      bscBridgeLocked,
      bscBridgeDepositLocked,
    ],
  );

  const asset = useMemo(
    () =>
      BridgeDictionary.get(chain!, targetChain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );

  const balance = useTokenBalance(chain as any, asset);

  const { value: limits, loading: limitsLoading } = useBridgeLimits(
    chain as any,
    targetChain as any,
    asset,
  );

  const isValid = useMemo(() => {
    const bnAmount = bignumber(amount || '0');
    const bnBalance = bignumber(balance.value || '0');
    return (
      !limitsLoading &&
      !balance.loading &&
      bnBalance.greaterThanOrEqualTo(bnAmount) &&
      bnAmount.greaterThan(0) &&
      bnAmount.greaterThanOrEqualTo(limits.returnData.getMinPerToken) &&
      bnAmount.lessThanOrEqualTo(limits.returnData.getMaxTokensAllowed) &&
      bignumber(limits.returnData.dailyLimit).greaterThanOrEqualTo(
        bnAmount.add(limits.returnData.spentToday),
      )
    );
  }, [
    amount,
    balance.loading,
    balance.value,
    limits.returnData.dailyLimit,
    limits.returnData.getMaxTokensAllowed,
    limits.returnData.getMinPerToken,
    limits.returnData.spentToday,
    limitsLoading,
  ]);

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-80">
      <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
        {t(trans.title)}
      </div>
      <div className="tw-w-80">
        <Table className="tw-mx-auto">
          <tbody>
            <tr>
              <td>{t(trans.dateTime)}:</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>{t(trans.from)}:</td>
              <td>{network?.name}</td>
            </tr>
            <tr>
              <td>{t(trans.token)}:</td>
              <td>{asset?.symbol}</td>
            </tr>
            <tr>
              <td>{t(trans.amount)}:</td>
              <td>
                {toNumberFormat(asset.fromWei(amount), asset.minDecimals)}
              </td>
            </tr>
            <tr>
              <td>{t(trans.bridgeFee)}:</td>
              <td>
                {toNumberFormat(
                  asset.fromWei(limits.returnData.getFeePerToken),
                  asset.minDecimals,
                )}{' '}
                {asset.symbol}
              </td>
            </tr>
          </tbody>
        </Table>

        <Button
          className="tw-mt-20 tw-w-80"
          text={t(trans.confirmDeposit)}
          disabled={
            bridgeLocked ||
            assetDepositLocked ||
            (chain && lockedChains[chain]) ||
            !isValid ||
            tx.loading
          }
          loading={tx.loading}
          onClick={handleSubmit}
        />
        {(bridgeLocked ||
          assetDepositLocked ||
          (chain && lockedChains[chain])) && (
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
