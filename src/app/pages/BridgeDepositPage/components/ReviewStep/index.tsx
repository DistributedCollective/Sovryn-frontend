import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';

import { Button, ButtonColor, ButtonSize } from 'app/components/Button';

import { actions } from '../../slice';
import { selectBridgeDepositPage } from '../../selectors';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { AssetModel } from '../../types/asset-model';
import { useBridgeLimits } from '../../hooks/useBridgeLimits';
import { NetworkModel } from '../../types/network-model';
import { translations } from 'locales/i18n';
import { useTranslation, Trans } from 'react-i18next';
import { useIsBridgeDepositLocked } from 'app/pages/BridgeDepositPage/hooks/useIsBridgeDepositLocked';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { AssetValue } from 'app/components/AssetValue';

export const ReviewStep: React.FC = () => {
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

  const targetNetwork = useMemo(
    () =>
      BridgeDictionary.listNetworks().find(
        item => item.chain === targetChain,
      ) as NetworkModel,
    [targetChain],
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

  const bridgeDepositLocked = useIsBridgeDepositLocked(targetAsset, chain);

  const items = useMemo(
    () => [
      {
        label: t(trans.dateTime),
        value: new Date().toLocaleDateString(),
      },
      {
        label: t(trans.from),
        value: network?.name,
      },
      {
        label: t(trans.to),
        value: targetNetwork?.name,
      },
      {
        label: t(trans.token),
        value: (
          <>
            {sourceAsset} -&gt; {asset?.symbol}
          </>
        ),
      },
      {
        label: t(trans.amount),
        value: (
          <AssetValue
            value={Number(asset.fromWei(amount))}
            minDecimals={asset.minDecimals}
          />
        ),
      },
      {
        label: t(trans.bridgeFee),
        value: (
          <AssetValue
            value={Number(asset.fromWei(limits.returnData.getFeePerToken))}
            minDecimals={asset.minDecimals}
            assetString={asset.symbol}
          />
        ),
      },
    ],
    [
      amount,
      asset,
      limits.returnData.getFeePerToken,
      network?.name,
      sourceAsset,
      t,
      targetNetwork?.name,
      trans.amount,
      trans.bridgeFee,
      trans.dateTime,
      trans.from,
      trans.to,
      trans.token,
    ],
  );
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-max-w-80 tw-mb-10">
      <div className="tw-mb-5 tw-text-base tw-text-center tw-font-semibold">
        {t(trans.title)}
      </div>
      <div className="tw-w-60 tw-text-center">
        <table className="tw-mx-auto tw-text-left tw-text-sm tw-font-medium tw-w-full">
          <tbody>
            {items.map(({ label, value }, i) => (
              <tr key={i}>
                <td className="tw-py-0.5">{label}:</td>
                <td className="tw-py-0.5 tw-text-right">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          className="tw-w-42 tw-font-semibold tw-absolute tw-right-0 tw-left-0 tw-bottom-8 tw-mx-auto"
          text={t(trans.next)}
          size={ButtonSize.sm}
          disabled={bridgeDepositLocked || !isValid || tx.loading}
          loading={tx.loading}
          onClick={handleSubmit}
          color={ButtonColor.gray}
        />
        {bridgeDepositLocked && (
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
