import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';

import type { Chain } from 'types';
import { Button } from 'app/components/Button';

import { actions } from '../../slice';
import { selectBridgeWithdrawPage } from '../../selectors';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { BridgeDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-dictionary';
import { NetworkModel } from '../../../BridgeDepositPage/types/network-model';
import { CrossBridgeAsset } from '../../../BridgeDepositPage/types/cross-bridge-asset';
import { AssetModel } from '../../../BridgeDepositPage/types/asset-model';
import { useTokenBalance } from '../../../BridgeDepositPage/hooks/useTokenBalance';
import { useBridgeLimits } from '../../../BridgeDepositPage/hooks/useBridgeLimits';
import { prettyTx } from '../../../../../utils/helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Table } from '../styled';

export function ReviewStep() {
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

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-80">
      <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
        {t(translations.BridgeWithdrawPage.reviewStep.title, {
          symbol: currentAsset.symbol,
        })}
      </div>
      <div className="tw-w-80">
        <Table className="tw-mx-auto">
          <tbody>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.dateTime)}:</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.from)}:</td>
              <td>{currentNetwork?.name}</td>
            </tr>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.to)}:</td>
              <td>{network?.name}</td>
            </tr>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.token)}:</td>
              <td>
                {currentAsset?.symbol} -&gt; {asset?.symbol}
              </td>
            </tr>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.amount)}:</td>
              <td>
                {toNumberFormat(
                  currentAsset.fromWei(amount),
                  currentAsset.minDecimals,
                )}
              </td>
            </tr>
            <tr>
              <td>{t(translations.BridgeWithdrawPage.reviewStep.receiver)}:</td>
              <td>
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
              <td>
                {toNumberFormat(
                  currentAsset.fromWei(limits.returnData.getFeePerToken),
                  currentAsset.minDecimals,
                )}{' '}
                {currentAsset.symbol}
              </td>
            </tr>
          </tbody>
        </Table>

        <Button
          className="tw-mt-20 tw-w-80 "
          text={t(translations.BridgeWithdrawPage.reviewStep.confirm)}
          disabled={!isValid || tx.loading}
          loading={tx.loading}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
