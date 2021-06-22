/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';
import styled from 'styled-components/macro';

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

interface Props {}

export function ReviewStep(props: Props) {
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
      BridgeDictionary.get(chain as Chain, targetChain as Chain)?.getAsset(
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

  const valid = useMemo(() => {
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
    <div className="tw-flex tw-flex-col tw-items-center tw-mw-320">
      <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
        Review {currentAsset.symbol} Withdraw
      </div>
      <div className="tw-mw-320">
        <Table className="tw-mx-auto">
          <tbody>
            <tr>
              <td>Date/Time:</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>From:</td>
              <td>{currentNetwork?.name}</td>
            </tr>
            <tr>
              <td>To:</td>
              <td>{network?.name}</td>
            </tr>
            <tr>
              <td>Token:</td>
              <td>
                {currentAsset?.symbol} -&gt; {asset?.symbol}
              </td>
            </tr>
            <tr>
              <td>Amount:</td>
              <td>
                {toNumberFormat(
                  currentAsset.fromWei(amount),
                  currentAsset.minDecimals,
                )}
              </td>
            </tr>
            <tr>
              <td>Receiver:</td>
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
              <td>Bridge Fee:</td>
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
          className="tw-mt-20 tw-w-full"
          text={'Confirm Withdraw'}
          disabled={!valid || tx.loading}
          loading={tx.loading}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

const Table = styled.table`
  td {
    padding: 0.5rem 1.25rem;
    text-align: left;
  }
`;
