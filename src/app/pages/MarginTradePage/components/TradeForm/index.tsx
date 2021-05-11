import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Select } from 'form/Select';
import {
  TradingPairDictionary,
  TradingPairType,
} from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { Option, Options } from 'form/Select/types';
import { Text } from '@blueprintjs/core';
import { TradingPosition } from '../../../../../types/trading-position';
import { LeverageSelector } from '../LeverageSelector';
import { FormGroup } from 'form/FormGroup';
import { AmountInput } from 'form/AmountInput';
import { CollateralAssets } from '../CollateralAssets';
import { Button } from '../Button';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useWalletContext } from '@sovryn/react-wallet';
import { EngageButton } from '../EngageButton';
import { TradeDialog } from '../TradeDialog';
import { useDispatch, useSelector } from 'react-redux';
import { selectMarginTradePage } from '../../selectors';
import { actions } from '../../slice';
import { AvailableBalance } from '../../../../components/AvailableBalance';
import { renderItemNH } from 'form/Select/renderers';
import { stringToFixedPrecision } from 'utils/display-text/format';

const pairs: Options<
  TradingPairType,
  React.ReactNode
> = TradingPairDictionary.entries().map(([type, item]) => ({
  key: type,
  label: item.name,
}));

export function TradeForm() {
  const { t } = useTranslation();
  const { connected } = useWalletContext();

  const { pairType, collateral, leverage } = useSelector(selectMarginTradePage);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState<string>('');

  const weiAmount = useWeiAmount(amount);

  useEffect(() => {
    dispatch(actions.setAmount(weiAmount));
  }, [weiAmount, dispatch]);

  const pair = useMemo(() => {
    return TradingPairDictionary.get(pairType);
  }, [pairType]);

  useEffect(() => {
    if (!pair.collaterals.includes(collateral)) {
      dispatch(actions.setCollateral(pair.collaterals[0]));
    }
    // eslint-disable-next-line
  }, [pair.collaterals]);

  const submit = e => dispatch(actions.submit(e));

  const { value: tokenBalance } = useAssetBalanceOf(collateral);

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(tokenBalance)
    );
  }, [weiAmount, tokenBalance]);

  return (
    <>
      <div className="tw-trading-form-card tw-bg-black lg:tw-rounded tw-p-12 tw-mx-auto xl:tw-mx-0">
        <div className="tw-mw-320 tw-mx-auto">
          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.pair)}
            className="tw-mb-6"
          >
            <Select
              value={pairType}
              options={pairs as any}
              filterable={false}
              onChange={value => dispatch(actions.setPairType(value))}
              itemRenderer={renderItemNH}
              innerClasses="tw-pr-3"
              valueRenderer={(item: Option) => (
                <Text ellipsize className="tw-text-center">
                  {item.label}
                </Text>
              )}
            />
          </FormGroup>
          <CollateralAssets
            value={collateral}
            onChange={value => dispatch(actions.setCollateral(value))}
            options={pair.collaterals}
          />
          <AvailableBalance asset={collateral} />
          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.leverage)}
            className="tw-mb-6"
          >
            <LeverageSelector
              value={leverage}
              onChange={value => dispatch(actions.setLeverage(value))}
            />
          </FormGroup>

          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.amount)}
          >
            <AmountInput
              value={stringToFixedPrecision(amount, 6)}
              onChange={value => setAmount(value)}
              asset={collateral}
            />
          </FormGroup>
        </div>

        {!connected ? (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-space-x-4 tw-mt-12 tw-mw-320 tw-mx-auto">
            <EngageButton />
          </div>
        ) : (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mt-12 tw-mw-320 tw-mx-auto">
            <Button
              text={t(translations.marginTradePage.tradeForm.buttons.long)}
              position={TradingPosition.LONG}
              onClick={submit}
              disabled={!validate}
            />
            <Button
              text={t(translations.marginTradePage.tradeForm.buttons.short)}
              position={TradingPosition.SHORT}
              onClick={submit}
              disabled={!validate}
            />
          </div>
        )}
      </div>
      <TradeDialog />
    </>
  );
}
