import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Select } from 'app/components/Form/Select';
import {
  TradingPairDictionary,
  TradingPairType,
} from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { Text } from '@blueprintjs/core';
import { TradingPosition } from '../../../../../types/trading-position';
import { LeverageSelector } from '../LeverageSelector';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AmountInput } from 'app/components/Form/AmountInput';
import { CollateralAssets } from '../CollateralAssets';
import { Button } from '../Button';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useWalletContext } from '@sovryn/react-wallet';
import { TradeDialog } from '../TradeDialog';
import { useDispatch, useSelector } from 'react-redux';
import { selectMarginTradePage } from '../../selectors';
import { actions } from '../../slice';
import { AvailableBalance } from '../../../../components/AvailableBalance';
import { renderItemNH } from 'app/components/Form/Select/renderers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';

const pairs = TradingPairDictionary.entries()
  .filter(value => !value[1].deprecated)
  .map(([type, item]) => ({
    key: type,
    label: item.name as string,
    leverage: item.leverage,
  }));

interface ITradeFormProps {
  pairType: TradingPairType;
}

export const TradeForm: React.FC<ITradeFormProps> = ({ pairType }) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);

  const { collateral, leverage } = useSelector(selectMarginTradePage);
  const dispatch = useDispatch();

  const pairInfo = useMemo(() => pairs.find(pair => pair.key === pairType), [
    pairType,
  ]);

  const [amount, setAmount] = useState('');

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
  }, [pair.collaterals, collateral, dispatch]);

  useEffect(() => {
    if (pairInfo && pairInfo.leverage) {
      dispatch(actions.setLeverage(pairInfo.leverage));
    }
  }, [dispatch, pairInfo]);

  const submit = useCallback(order => dispatch(actions.submit(order)), [
    dispatch,
  ]);

  const { value: tokenBalance } = useAssetBalanceOf(collateral);

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(tokenBalance)
    );
  }, [weiAmount, tokenBalance]);

  const buttonDisabled = useMemo(
    () => !validate || !connected || openTradesLocked,
    [validate, connected, openTradesLocked],
  );

  return (
    <>
      <div className="tw-trading-form-card tw-bg-black tw-rounded-3xl tw-p-12 tw-mx-auto xl:tw-mx-0">
        <div className="tw-mw-340 tw-mx-auto">
          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.pair)}
            className="tw-mb-6"
          >
            <Select
              value={pairType}
              options={pairs}
              filterable={false}
              onChange={value => dispatch(actions.setPairType(value))}
              itemRenderer={renderItemNH}
              valueRenderer={item => (
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
            {pairInfo && pairInfo.leverage ? (
              `${pairInfo.leverage}x`
            ) : (
              <LeverageSelector
                value={leverage}
                onChange={value => dispatch(actions.setLeverage(value))}
              />
            )}
          </FormGroup>

          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.amount)}
          >
            <AmountInput
              value={amount}
              onChange={setAmount}
              asset={collateral}
            />
          </FormGroup>
        </div>
        <div className="tw-mt-12">
          {openTradesLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.openMarginTrades}
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
        {!openTradesLocked && (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mw-340 tw-mx-auto">
            {pair.canOpenLong && (
              <Button
                text={t(translations.marginTradePage.tradeForm.buttons.long)}
                position={TradingPosition.LONG}
                onClick={submit}
                disabled={buttonDisabled}
              />
            )}
            {pair.canOpenShort && (
              <Button
                text={t(translations.marginTradePage.tradeForm.buttons.short)}
                position={TradingPosition.SHORT}
                onClick={submit}
                disabled={buttonDisabled}
              />
            )}
          </div>
        )}
      </div>
      <TradeDialog />
    </>
  );
};
