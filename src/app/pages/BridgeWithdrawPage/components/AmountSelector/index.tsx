import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';
import styled from 'styled-components/macro';
import type { Chain } from 'types';

import { actions } from '../../slice';
import { selectBridgeWithdrawPage } from '../../selectors';
import { AmountInput } from '../AmountInput';
import { FormGroup } from '../../../../components/Form/FormGroup';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { fromWei } from 'utils/blockchain/math-helpers';
import { LoadableValue } from 'app/components/LoadableValue';
import { BridgeDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-dictionary';
import { CrossBridgeAsset } from 'app/pages/BridgeDepositPage/types/cross-bridge-asset';
import { AssetModel } from '../../../BridgeDepositPage/types/asset-model';
import { useTokenBalance } from '../../../BridgeDepositPage/hooks/useTokenBalance';
import { useBridgeLimits } from '../../../BridgeDepositPage/hooks/useBridgeLimits';
import { useBridgeTokenBalance } from '../../../BridgeDepositPage/hooks/useBridgeTokenBalance';
import { ActionButton } from 'app/components/Form/ActionButton';

export function AmountSelector() {
  const { amount, chain, targetChain, sourceAsset, targetAsset } = useSelector(
    selectBridgeWithdrawPage,
  );
  const dispatch = useDispatch();

  const currentAsset = useMemo(
    () =>
      BridgeDictionary.get(chain as Chain, targetChain as Chain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );

  const withdrawAsset = useMemo(
    () =>
      BridgeDictionary.get(targetChain as Chain, chain as Chain)?.getAsset(
        targetAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, targetAsset, targetChain],
  );

  const [value, setValue] = useState(
    amount ? currentAsset.fromWei(amount, currentAsset.minDecimals) : '',
  );

  const selectAmount = useCallback(() => {
    dispatch(actions.selectAmount(currentAsset.toWei(value || '0')));
  }, [dispatch, currentAsset, value]);

  const balance = useTokenBalance(chain as any, currentAsset);

  const { value: limits, loading: limitsLoading } = useBridgeLimits(
    chain as any,
    targetChain as any,
    currentAsset,
  );

  const bridgeBalance = useBridgeTokenBalance(
    chain,
    currentAsset,
    targetAsset as any,
  );

  const valid = useMemo(() => {
    const bnAmount = bignumber(currentAsset.toWei(value || '0'));
    const bnBalance = bignumber(balance.value || '0');
    const testBridgeBalance =
      bridgeBalance.value !== false
        ? bignumber(bridgeBalance.value).greaterThanOrEqualTo(bnAmount)
        : true;
    return (
      !limitsLoading &&
      !balance.loading &&
      testBridgeBalance &&
      bnBalance.greaterThanOrEqualTo(bnAmount) &&
      bnAmount.greaterThan(0) &&
      bnAmount.greaterThanOrEqualTo(limits.returnData.getMinPerToken) &&
      bnAmount.lessThanOrEqualTo(limits.returnData.getMaxTokensAllowed) &&
      bignumber(limits.returnData.dailyLimit).greaterThanOrEqualTo(
        bnAmount.add(limits.returnData.spentToday),
      )
    );
  }, [
    currentAsset,
    balance.loading,
    balance.value,
    bridgeBalance.value,
    limits.returnData.dailyLimit,
    limits.returnData.getMaxTokensAllowed,
    limits.returnData.getMinPerToken,
    limits.returnData.spentToday,
    limitsLoading,
    value,
  ]);

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-mw-320">
      <div className="tw-flex tw-flex-col tw-items-center tw-mw-320">
        <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
          Enter amount to withdraw
        </div>
        <div className="tw-mw-320">
          <FormGroup label="Deposit Amount">
            <AmountInput
              value={value}
              onChange={val => setValue(val)}
              asset={currentAsset}
              maxAmount={balance.value}
              decimalPrecision={currentAsset.minDecimals}
            />
            <p className="tw-mt-1">
              Balance:{' '}
              {toNumberFormat(
                currentAsset.fromWei(balance.value),
                currentAsset.minDecimals,
              )}{' '}
              {currentAsset.symbol}
            </p>
          </FormGroup>
        </div>
        <div className="text-center tw-mt-4 tw-mb-2">Daily bridge limits</div>
        <Table>
          <tbody className="tw-text-right tw-text-sm">
            <tr>
              <td>Min Amount:</td>
              <td>
                <LoadableValue
                  value={`${toNumberFormat(
                    currentAsset.fromWei(limits.returnData.getMinPerToken),
                    currentAsset.minDecimals,
                  )} ${currentAsset.symbol}`}
                  loading={limitsLoading}
                />
              </td>
            </tr>
            <tr>
              <td>Max Amount:</td>
              <td>
                <LoadableValue
                  value={`${toNumberFormat(
                    fromWei(limits.returnData.getMaxTokensAllowed),
                    currentAsset.minDecimals,
                  )} ${currentAsset.symbol}`}
                  loading={limitsLoading}
                />
              </td>
            </tr>
            <tr>
              <td>Daily Limit:</td>
              <td>
                <LoadableValue
                  value={`${toNumberFormat(
                    fromWei(limits.returnData.dailyLimit),
                    currentAsset.minDecimals,
                  )} ${currentAsset.symbol}`}
                  loading={limitsLoading}
                />
              </td>
            </tr>
            <tr>
              <td>Daily Limit Spent:</td>
              <td>
                <LoadableValue
                  value={`${toNumberFormat(
                    fromWei(limits.returnData.spentToday),
                    currentAsset.minDecimals,
                  )} ${currentAsset.symbol}`}
                  loading={limitsLoading}
                />
              </td>
            </tr>
            <tr>
              <td>Fee:</td>
              <td>
                <LoadableValue
                  value={`${toNumberFormat(
                    currentAsset.fromWei(limits.returnData.getFeePerToken),
                    currentAsset.minDecimals,
                  )} ${currentAsset.symbol}`}
                  loading={limitsLoading}
                />
              </td>
            </tr>
            {bridgeBalance.value !== false && (
              <tr>
                <td>Aggregator Balance</td>
                <td>
                  <LoadableValue
                    value={`${toNumberFormat(
                      currentAsset.fromWei(bridgeBalance.value),
                      withdrawAsset.minDecimals,
                    )} ${withdrawAsset.symbol}`}
                    loading={bridgeBalance.loading}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <ActionButton
          className="tw-mt-10 tw-w-80 tw-font-semibold tw-rounded-xl"
          text="Next"
          disabled={!valid}
          onClick={selectAmount}
        />
      </div>
    </div>
  );
}

const Table = styled.table`
  td {
    padding: 0.25rem 0.5rem;
  }
`;
