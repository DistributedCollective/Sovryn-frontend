import { useWalletContext } from '@sovryn/react-wallet';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TradingPosition } from '../../../../../types/trading-position';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { DataCard } from '../DataCard';
import {
  PerpetualPageModals,
  PerpetualTrade,
  PerpetualTradeType,
} from '../../types';
import { TransitionSteps } from '../../../../containers/TransitionSteps';
import { TransitionAnimation } from '../../../../containers/TransitionContainer';
import { Asset } from '../../../../../types';
import { NewPositionCardContextType, NewPositionCardStep } from './types';
import { SlippageFormStep } from './components/SlippageFormStep';
import { TradeFormStep } from './components/TradeFormStep';
import { ConnectFormStep } from './components/ConnectFormStep';
import { noop } from '../../../../constants';
import { PERPETUAL_SLIPPAGE_DEFAULT } from '../../types';
import { PerpetualTxMethod, PerpetualTx } from '../../types';
import { usePerpetual_accountBalance } from '../../hooks/usePerpetual_accountBalance';
import debounce from 'lodash.debounce';

export const NewPositionCardContext = React.createContext<
  NewPositionCardContextType
>({
  hasEmptyBalance: true,
  hasOpenPosition: false,
  trade: {
    pairType: PerpetualPairType.BTCUSD,
    collateral: Asset.BTCS,
    position: TradingPosition.LONG,
    tradeType: PerpetualTradeType.MARKET,
    amount: '0',
    leverage: 1,
    slippage: PERPETUAL_SLIPPAGE_DEFAULT,
  },
  setTrade: trade => trade,
  onSubmit: noop,
});

const StepComponents = {
  [NewPositionCardStep.unconnected]: ConnectFormStep,
  [NewPositionCardStep.trade]: TradeFormStep,
  [NewPositionCardStep.slippage]: SlippageFormStep,
};

export const NewPositionCard: React.FC = () => {
  const dispatch = useDispatch();
  const { connected } = useWalletContext();
  const { pairType, collateral } = useSelector(selectPerpetualPage);

  const {
    available: availableBalance,
    inPositions,
  } = usePerpetual_accountBalance();

  // handle flags in a throttled way to prevent flickering when updating
  const [[hasOpenPosition, hasEmptyBalance], setFlags] = useState([
    false,
    true,
  ]);

  // throttle function prevents the exhaustive deps check
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateFlags = useCallback(
    debounce(setFlags, 250, { leading: false, trailing: true, maxWait: 250 }),
    [setFlags],
  );

  useEffect(() => {
    updateFlags([inPositions !== '0', availableBalance === '0']);

    return () => updateFlags.cancel();
  }, [inPositions, availableBalance, updateFlags]);

  const [trade, setTrade] = useState<PerpetualTrade>({
    pairType,
    collateral,
    position: TradingPosition.LONG,
    tradeType: PerpetualTradeType.MARKET,
    amount: '0',
    leverage: 1,
    slippage: PERPETUAL_SLIPPAGE_DEFAULT,
  });

  const onSubmit = useCallback(
    (trade: PerpetualTrade) => {
      if (!trade.averagePrice || trade.averagePrice === '0') {
        return;
      }

      const transactions: PerpetualTx[] = [];
      if (trade.tradeType === PerpetualTradeType.MARKET) {
        transactions.push({
          method: PerpetualTxMethod.trade,
          pair: trade.pairType,
          amount: trade.amount,
          price: trade.averagePrice,
          tradingPosition: trade.position,
          slippage: trade.slippage,
          leverage: trade.leverage,
          keepPositionLeverage: trade.keepPositionLeverage,
          isClosePosition: trade.isClosePosition,
          tx: null,
          approvalTx: null,
        });
      } else {
        transactions.push({
          method: PerpetualTxMethod.createLimitOrder,
          pair: trade.pairType,
          amount: trade.amount,
          tradingPosition: trade.position,
          leverage: trade.leverage,
          limit: trade.limit || '0',
          trigger: trade.trigger || '0',
          expiry: trade.expiry || 30,
          created: Date.now(),
          tx: null,
          approvalTx: null,
          reduceOnly: trade.reduceOnly,
        });
      }

      dispatch(
        actions.setModal(PerpetualPageModals.TRADE_REVIEW, {
          origin: PerpetualPageModals.NONE,
          trade,
          transactions,
        }),
      );
    },
    [dispatch],
  );

  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  useEffect(() => {
    if (pair.collateralAsset !== collateral) {
      dispatch(actions.setCollateral(pair.collateralAsset));
    }
  }, [pair.collateralAsset, collateral, dispatch]);

  useEffect(() => {
    if (pairType !== trade.pairType) {
      setTrade(trade => ({
        ...trade,
        pairType,
        expiry: undefined,
        amount: '0',
        limit: undefined,
        trigger: undefined,
        leverage: 1,
        reduceOnly: undefined,
      }));
    }
  }, [dispatch, pairType, trade.pairType]);

  const stepProps: NewPositionCardContextType = useMemo(
    () => ({
      hasOpenPosition,
      hasEmptyBalance,
      trade,
      onSubmit,
      setTrade,
    }),
    [trade, onSubmit, hasOpenPosition, hasEmptyBalance],
  );

  return (
    <DataCard
      className="tw-relative tw-flex-1 tw-max-h-content"
      hasPadding={false}
    >
      <NewPositionCardContext.Provider value={stepProps}>
        <TransitionSteps<NewPositionCardStep>
          classNameOuter="tw-h-full tw-min-h-max"
          classNameInner="tw-h-auto tw-min-h-96"
          active={
            connected
              ? NewPositionCardStep.trade
              : NewPositionCardStep.unconnected
          }
          defaultAnimation={TransitionAnimation.slideLeft}
          steps={StepComponents}
        />
      </NewPositionCardContext.Provider>
    </DataCard>
  );
};
