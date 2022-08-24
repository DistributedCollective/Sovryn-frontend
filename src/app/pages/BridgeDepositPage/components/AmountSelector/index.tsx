import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bignumber } from 'mathjs';

import { actions } from '../../slice';
import { selectBridgeDepositPage } from '../../selectors';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { AssetModel } from '../../types/asset-model';
import { AmountInput } from '../AmountInput';
import { FormGroup } from '../../../../components/Form/FormGroup';
import { useBridgeLimits } from '../../hooks/useBridgeLimits';
import { useBridgeTokenBalance } from '../../hooks/useBridgeTokenBalance';
import { LoadableValue } from 'app/components/LoadableValue';
import { translations } from 'locales/i18n';
import { useTranslation, Trans } from 'react-i18next';
import { useIsBridgeDepositLocked } from 'app/pages/BridgeDepositPage/hooks/useIsBridgeDepositLocked';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { Button, ButtonColor, ButtonSize } from 'app/components/Button';
import { AssetValue } from 'app/components/AssetValue';

export const AmountSelector: React.FC = () => {
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

  const bridgeDepositLocked = useIsBridgeDepositLocked(targetAsset, chain);

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
      bridgeBalance.value !== null
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
    <div className="tw-flex tw-flex-col tw-items-center tw-w-96">
      <div className="tw-flex tw-flex-col tw-items-center tw-w-96">
        <div className="tw-w-80">
          <FormGroup
            label={t(
              translations.BridgeDepositPage.amountSelector.depositAmount,
            )}
            labelClassName="tw-text-sm tw-font-semibold"
          >
            <AmountInput
              value={value}
              onChange={val => setValue(val)}
              asset={asset}
              maxAmount={balance.value}
              decimalPrecision={asset.minDecimals}
            />
            <p className="tw-mt-1 tw-mb-1 tw-text-sm">
              {t(translations.BridgeDepositPage.amountSelector.balance)}:{' '}
              <AssetValue
                value={Number(asset.fromWei(balance.value))}
                minDecimals={asset.minDecimals}
                assetString={asset.symbol}
              />
            </p>
          </FormGroup>
        </div>
        <div className="tw-w-80">
          <div className="text-left tw-font-semibold tw-mt-4 tw-mb-2 tw-w-full">
            {t(
              translations.BridgeDepositPage.amountSelector.dailyDepositLimits,
            )}
          </div>
          <table className="tw-mx-auto tw-text-left tw-text-sm tw-font-medium tw-w-full">
            <tbody>
              <tr>
                <td>
                  {t(translations.BridgeDepositPage.amountSelector.minAmount)}:
                </td>
                <td className="tw-text-right">
                  <LoadableValue
                    value={
                      <AssetValue
                        value={Number(
                          asset.fromWei(limits.returnData.getMinPerToken),
                        )}
                        minDecimals={asset.minDecimals}
                        assetString={asset.symbol}
                      />
                    }
                    loading={limitsLoading}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  {t(translations.BridgeDepositPage.amountSelector.maxAmount)}:
                </td>
                <td className="tw-text-right">
                  <LoadableValue
                    value={
                      <AssetValue
                        value={Number(
                          asset.fromWei(limits.returnData.getMaxTokensAllowed),
                        )}
                        minDecimals={asset.minDecimals}
                        assetString={asset.symbol}
                      />
                    }
                    loading={limitsLoading}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  {t(translations.BridgeDepositPage.amountSelector.dailyLimit)}:
                </td>
                <td className="tw-text-right">
                  <LoadableValue
                    value={
                      <AssetValue
                        value={limits.returnData.dailyLimit}
                        minDecimals={asset.minDecimals}
                        assetString={asset.symbol}
                      />
                    }
                    loading={limitsLoading}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  {t(
                    translations.BridgeDepositPage.amountSelector
                      .dailyLimitSpent,
                  )}
                  :
                </td>
                <td className="tw-text-right">
                  <LoadableValue
                    value={
                      <AssetValue
                        value={limits.returnData.spentToday}
                        minDecimals={asset.minDecimals}
                        assetString={asset.symbol}
                      />
                    }
                    loading={limitsLoading}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  {t(translations.BridgeDepositPage.amountSelector.fee)}:
                </td>
                <td className="tw-text-right">
                  <LoadableValue
                    value={
                      <AssetValue
                        value={Number(
                          asset.fromWei(limits.returnData.getFeePerToken),
                        )}
                        minDecimals={asset.minDecimals}
                        assetString={asset.symbol}
                      />
                    }
                    loading={limitsLoading}
                  />
                </td>
              </tr>
              {bridgeBalance.value !== null && (
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
          </table>
        </div>

        <Button
          className="tw-w-42 tw-font-semibold tw-absolute tw-right-0 tw-left-0 tw-bottom-8 tw-mx-auto"
          text={t(translations.common.next)}
          disabled={bridgeDepositLocked || !isValid}
          onClick={selectAmount}
          color={ButtonColor.gray}
          size={ButtonSize.sm}
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
