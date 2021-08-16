import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';
import styled from 'styled-components/macro';

import { actions } from '../../slice';
import { selectBridgeDepositPage } from '../../selectors';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { AssetModel } from '../../types/asset-model';
import { AmountInput } from '../AmountInput';
import { FormGroup } from '../../../../components/Form/FormGroup';
import { useBridgeLimits } from '../../hooks/useBridgeLimits';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { fromWei } from 'utils/blockchain/math-helpers';
import { useBridgeTokenBalance } from '../../hooks/useBridgeTokenBalance';
import { LoadableValue } from 'app/components/LoadableValue';
import { ActionButton } from 'app/components/Form/ActionButton';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export function AmountSelector() {
  const { amount, chain, targetChain, sourceAsset, targetAsset } = useSelector(
    selectBridgeDepositPage,
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const asset = useMemo(
    () =>
      BridgeDictionary.get(chain!, targetChain)?.getAsset(
        sourceAsset!,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );

  const [value, setValue] = useState(
    amount ? asset.fromWei(amount, asset.minDecimals) : '',
  );

  const selectAmount = useCallback(() => {
    dispatch(actions.selectAmount(asset.toWei(value || '0')));
  }, [dispatch, asset, value]);

  const balance = useTokenBalance(chain!, asset);

  const { value: limits, loading: limitsLoading } = useBridgeLimits(
    chain!,
    targetChain!,
    asset,
  );

  const bridgeBalance = useBridgeTokenBalance(targetChain, asset, targetAsset!);

  const isValid = useMemo(() => {
    const bnAmount = bignumber(asset.toWei(value || '0'));
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
      bnAmount.greaterThan(limits.returnData.getFeePerToken) &&
      bnAmount.lessThanOrEqualTo(limits.returnData.getMaxTokensAllowed) &&
      bignumber(limits.returnData.dailyLimit).greaterThanOrEqualTo(
        bnAmount.add(limits.returnData.spentToday),
      )
    );
  }, [
    asset,
    balance.loading,
    balance.value,
    bridgeBalance.value,
    limits.returnData.dailyLimit,
    limits.returnData.getFeePerToken,
    limits.returnData.getMaxTokensAllowed,
    limits.returnData.getMinPerToken,
    limits.returnData.spentToday,
    limitsLoading,
    value,
  ]);

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-80">
      <div className="tw-flex tw-flex-col tw-items-center tw-w-80">
        <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
          {t(translations.BridgeDepositPage.amountSelector.title)}
        </div>
        <div className="tw-w-80">
          <FormGroup
            label={t(
              translations.BridgeDepositPage.amountSelector.depositAmount,
            )}
          >
            <AmountInput
              value={value}
              onChange={val => setValue(val)}
              asset={asset}
              maxAmount={balance.value}
              decimalPrecision={asset.minDecimals}
            />
            <p className="tw-mt-1">
              {t(translations.BridgeDepositPage.amountSelector.balance)}:{' '}
              {toNumberFormat(asset.fromWei(balance.value), asset.minDecimals)}{' '}
              {asset.symbol}
            </p>
          </FormGroup>
        </div>
        <div className="text-center tw-mt-4 tw-mb-2">
          {t(translations.BridgeDepositPage.amountSelector.dailyDepositLimits)}
        </div>
        <Table>
          <tbody className="tw-text-right tw-text-sm">
            <tr>
              <td>
                {t(translations.BridgeDepositPage.amountSelector.minAmount)}:
              </td>
              <td>
                <LoadableValue
                  value={`${toNumberFormat(
                    asset.fromWei(limits.returnData.getMinPerToken),
                    asset.minDecimals,
                  )} ${asset.symbol}`}
                  loading={limitsLoading}
                />
              </td>
            </tr>
            <tr>
              <td>
                {t(translations.BridgeDepositPage.amountSelector.maxAmount)}:
              </td>
              <td>
                <LoadableValue
                  value={`${toNumberFormat(
                    fromWei(limits.returnData.getMaxTokensAllowed),
                    asset.minDecimals,
                  )} ${asset.symbol}`}
                  loading={limitsLoading}
                />
              </td>
            </tr>
            <tr>
              <td>
                {t(translations.BridgeDepositPage.amountSelector.dailyLimit)}:
              </td>
              <td>
                <LoadableValue
                  value={`${toNumberFormat(
                    fromWei(limits.returnData.dailyLimit),
                    asset.minDecimals,
                  )} ${asset.symbol}`}
                  loading={limitsLoading}
                />
              </td>
            </tr>
            <tr>
              <td>
                {t(
                  translations.BridgeDepositPage.amountSelector.dailyLimitSpent,
                )}
                :
              </td>
              <td>
                <LoadableValue
                  value={`${toNumberFormat(
                    fromWei(limits.returnData.spentToday),
                    asset.minDecimals,
                  )} ${asset.symbol}`}
                  loading={limitsLoading}
                />
              </td>
            </tr>
            <tr>
              <td> {t(translations.BridgeDepositPage.amountSelector.fee)}:</td>
              <td>
                <LoadableValue
                  value={`${toNumberFormat(
                    asset.fromWei(limits.returnData.getFeePerToken),
                    asset.minDecimals,
                  )} ${asset.symbol}`}
                  loading={limitsLoading}
                />
              </td>
            </tr>
            {bridgeBalance.value !== false && (
              <tr>
                <td>
                  {t(
                    translations.BridgeDepositPage.amountSelector
                      .aggregatorBalance,
                  )}
                </td>
                <td>{bridgeBalance.value}</td>
              </tr>
            )}
          </tbody>
        </Table>

        <ActionButton
          className="tw-mt-10 tw-w-80 tw-font-semibold tw-rounded-xl"
          text={t(translations.common.next)}
          disabled={!isValid}
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
