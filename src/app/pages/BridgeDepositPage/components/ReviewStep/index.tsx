import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';
import { Table } from '../../../BridgeWithdrawPage/components/styled';

import { Button, ButtonSize } from 'app/components/Button';

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
import { useIsBridgeDepositLocked } from 'app/pages/BridgeDepositPage/hooks/useIsBridgeDepositLocked';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';

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
          size={ButtonSize.lg}
          disabled={bridgeDepositLocked || !isValid || tx.loading}
          loading={tx.loading}
          onClick={handleSubmit}
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
