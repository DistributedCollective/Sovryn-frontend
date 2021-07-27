import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';
import styled from 'styled-components/macro';

import type { Chain } from 'types';
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

export function ReviewStep() {
  const { amount, chain, targetChain, sourceAsset, tx } = useSelector(
    selectBridgeDepositPage,
  );
  const dispatch = useDispatch();

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
      BridgeDictionary.get(chain as Chain, targetChain)?.getAsset(
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
        Review deposit
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
              <td>{network?.name}</td>
            </tr>
            <tr>
              <td>Token:</td>
              <td>{asset?.symbol}</td>
            </tr>
            <tr>
              <td>Amount:</td>
              <td>
                {toNumberFormat(asset.fromWei(amount), asset.minDecimals)}
              </td>
            </tr>
            <tr>
              <td>Bridge Fee:</td>
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
          className="tw-mt-20 tw-w-full"
          text={'Confirm Deposit'}
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
