import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';
import styled from 'styled-components/macro';

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
import { translations } from 'locales/i18n';
import { useTranslation, Trans } from 'react-i18next';
import styles from './index.module.scss';
import cn from 'classnames';
import { discordInvite } from 'utils/classifiers';
import { useIsBridgeWithdrawLocked } from 'app/pages/BridgeWithdrawPage/hooks/useIsBridgeWithdrawLocked';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

export const AmountSelector: React.FC = () => {
  const { amount, chain, targetChain, sourceAsset, targetAsset } = useSelector(
    selectBridgeWithdrawPage,
  );
  const { t } = useTranslation();
  const trans = translations.BridgeWithdrawPage.amountSelector;
  const dispatch = useDispatch();

  const currentAsset = useMemo(
    () =>
      BridgeDictionary.get(chain!, targetChain!)?.getAsset(
        sourceAsset!,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );

  const withdrawAsset = useMemo(
    () =>
      BridgeDictionary.get(targetChain!, chain!)?.getAsset(
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

  const balance = useTokenBalance(chain!, currentAsset);

  const { value: limits, loading: limitsLoading } = useBridgeLimits(
    chain!,
    targetChain!,
    currentAsset,
  );

  const bridgeBalance = useBridgeTokenBalance(
    chain,
    currentAsset,
    targetAsset!,
  );

  const bnAmount = useMemo(() => {
    return bignumber(currentAsset.toWei(value || '0'));
  }, [currentAsset, value]);

  const checkBridgeBalance = useMemo(() => {
    return bridgeBalance.value !== false
      ? bignumber(bridgeBalance.value).greaterThanOrEqualTo(bnAmount)
      : true;
  }, [bnAmount, bridgeBalance.value]);

  const checkSpentToday = useMemo(() => {
    return bignumber(limits.returnData.dailyLimit).greaterThanOrEqualTo(
      bnAmount.add(limits.returnData.spentToday),
    );
  }, [bnAmount, limits.returnData.dailyLimit, limits.returnData.spentToday]);

  const isValid = useMemo(() => {
    const bnBalance = bignumber(balance.value || '0');

    return (
      !limitsLoading &&
      !balance.loading &&
      checkBridgeBalance &&
      bnBalance.greaterThanOrEqualTo(bnAmount) &&
      bnAmount.greaterThan(0) &&
      bnAmount.greaterThanOrEqualTo(limits.returnData.getMinPerToken) &&
      bnAmount.lessThanOrEqualTo(limits.returnData.getMaxTokensAllowed) &&
      bnAmount.greaterThan(limits.returnData.getFeePerToken) &&
      checkSpentToday
    );
  }, [
    bnAmount,
    balance.value,
    balance.loading,
    limitsLoading,
    checkBridgeBalance,
    limits.returnData.getMinPerToken,
    limits.returnData.getMaxTokensAllowed,
    limits.returnData.getFeePerToken,
    checkSpentToday,
  ]);

  const bridgeWithdrawLocked = useIsBridgeWithdrawLocked(
    sourceAsset,
    targetChain,
  );

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-96">
      <div className="tw-flex tw-flex-col tw-items-center tw-w-96">
        <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
          {t(trans.title)}
        </div>
        <div className="tw-w-96">
          <FormGroup label={t(trans.withdrawAmount)}>
            <AmountInput
              value={value}
              onChange={val => setValue(val)}
              asset={currentAsset}
              maxAmount={balance.value}
              decimalPrecision={currentAsset.minDecimals}
            />
            <p className="tw-mt-1 tw-mb-1 tw-relative">
              {t(trans.balance)}:{' '}
              {toNumberFormat(
                currentAsset.fromWei(balance.value),
                currentAsset.minDecimals,
              )}{' '}
              {currentAsset.symbol}
              {(!checkBridgeBalance || !checkSpentToday) && (
                <div
                  className={cn(
                    styles.warning,
                    'tw-absolute tw-b-0 tw-l-0 tw-text-Red',
                  )}
                >
                  {!checkBridgeBalance
                    ? t(trans.insufficientAggregator)
                    : t(trans.insufficientDaily)}
                </div>
              )}
            </p>
          </FormGroup>
        </div>
        <div className="text-center tw-mt-4 tw-mb-2">
          {t(trans.dailyBridgeLimits)}
        </div>
        <Table>
          <tbody className="tw-text-right tw-text-sm">
            <tr>
              <td> {t(trans.minAmount)}:</td>
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
              <td> {t(trans.maxAmount)}:</td>
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
              <td> {t(trans.dailyLimit)}:</td>
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
              <td> {t(trans.dailyLimitSpent)}:</td>
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
              <td> {t(trans.fee)}:</td>
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
                <td> {t(trans.aggregatorBalance)}</td>
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
          className="tw-mt-10 tw-w-96 tw-font-semibold tw-rounded-xl"
          text={t(translations.common.next)}
          disabled={bridgeWithdrawLocked || !isValid}
          onClick={selectAmount}
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

const Table = styled.table`
  td {
    padding: 0.25rem 0.5rem;
  }
`;
