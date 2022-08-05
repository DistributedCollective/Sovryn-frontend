import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';

import { Chain } from 'types';
import { Button, ButtonColor, ButtonSize } from 'app/components/Button';

import { actions } from '../../slice';
import { selectBridgeWithdrawPage } from '../../selectors';
import { BridgeDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-dictionary';
import { NetworkModel } from '../../../BridgeDepositPage/types/network-model';
import { CrossBridgeAsset } from '../../../BridgeDepositPage/types/cross-bridge-asset';
import { AssetModel } from '../../../BridgeDepositPage/types/asset-model';
import { useTokenBalance } from '../../../BridgeDepositPage/hooks/useTokenBalance';
import { useBridgeLimits } from '../../../BridgeDepositPage/hooks/useBridgeLimits';
import { prettyTx } from '../../../../../utils/helpers';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useIsBridgeWithdrawLocked } from 'app/pages/BridgeWithdrawPage/hooks/useIsBridgeWithdrawLocked';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { Icon, Popover } from '@blueprintjs/core';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';

export const ReviewStep: React.FC = () => {
  const {
    amount,
    chain,
    targetChain,
    sourceAsset,
    targetAsset,
    receiver,
    tx,
  } = useSelector(selectBridgeWithdrawPage);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSubmit = useCallback(() => {
    dispatch(actions.submitForm());
  }, [dispatch]);

  const currentNetwork = useMemo(
    () =>
      BridgeDictionary.listNetworks().find(
        item => item.chain === chain,
      ) as NetworkModel,
    [chain],
  );

  const network = useMemo(
    () =>
      BridgeDictionary.listNetworks().find(
        item => item.chain === targetChain,
      ) as NetworkModel,
    [targetChain],
  );

  const currentAsset = useMemo(
    () =>
      BridgeDictionary.get(chain!, targetChain!)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );

  const asset = useMemo(
    () =>
      BridgeDictionary.get(targetChain as Chain, chain as Chain)?.getAsset(
        targetAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, targetAsset, targetChain],
  );

  const balance = useTokenBalance(chain as any, currentAsset);

  const { value: limits, loading: limitsLoading } = useBridgeLimits(
    chain as any,
    targetChain as any,
    currentAsset,
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

  const bridgeWithdrawLocked = useIsBridgeWithdrawLocked(
    sourceAsset,
    targetChain,
  );

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-80">
      <div className="tw-mb-4 tw-text-base tw-text-center tw-font-semibold">
        {t(translations.BridgeWithdrawPage.transactionDetails)}
      </div>
      <div className="tw-w-60 tw-text-right tw-mb-10">
        <table className="tw-mx-auto tw-text-left tw-text-sm tw-font-medium tw-w-full">
          <tbody>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.dateTime)}:</td>
              <td className="tw-text-right">
                {new Date().toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.from)}:</td>
              <td className="tw-text-right">{currentNetwork?.name}</td>
            </tr>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.to)}:</td>
              <td className="tw-text-right">{network?.name}</td>
            </tr>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.token)}:</td>
              <td className="tw-text-right">
                {currentAsset?.symbol} -&gt; {asset?.symbol}
              </td>
            </tr>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.amount)}:</td>
              <td className="tw-text-right">
                <AssetValue
                  value={Number(currentAsset.fromWei(amount))}
                  minDecimals={2}
                  maxDecimals={8}
                  mode={AssetValueMode.auto}
                />
              </td>
            </tr>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.receiver)}:</td>
              <td className="tw-text-right">
                <a
                  href={network.explorer + '/address/' + receiver}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {prettyTx(receiver)}
                </a>
              </td>
            </tr>
            <tr>
              <td>
                {t(translations.BridgeWithdrawPage.reviewStep.bridgeFee)}:
              </td>
              <td className="tw-text-right">
                <div className="tw-flex tw-items-center tw-justify-end">
                  <AssetValue
                    value={Number(
                      currentAsset.fromWei(limits.returnData.getFeePerToken),
                    )}
                    minDecimals={currentAsset.minDecimals}
                    assetString={currentAsset.symbol}
                  />

                  {targetChain === Chain.ETH && (
                    <Popover
                      content={
                        <div className="tw-max-w-80 tw-px-4 tw-py-2">
                          <Trans
                            i18nKey={
                              translations.BridgeWithdrawPage.reviewStep
                                .bridgeFeeWarning
                            }
                            components={[<strong className="tw-font-bold" />]}
                          />
                        </div>
                      }
                    >
                      <Icon
                        className="tw-cursor-pointer tw-pt-1 tw-ml-2 tw-flex tw-items-center tw-text-warning"
                        icon={'info-sign'}
                      />
                    </Popover>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <Button
          className="tw-w-42 tw-font-semibold tw-absolute tw-bottom-8 tw-left-0 tw-right-0 tw-mx-auto"
          text={t(translations.BridgeWithdrawPage.reviewStep.confirm)}
          disabled={bridgeWithdrawLocked || !isValid || tx.loading}
          loading={tx.loading}
          onClick={handleSubmit}
          color={ButtonColor.primary}
          size={ButtonSize.sm}
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
