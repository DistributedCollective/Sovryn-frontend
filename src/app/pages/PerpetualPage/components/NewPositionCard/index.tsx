import { useWalletContext } from '@sovryn/react-wallet';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import iconArrowForward from 'assets/images/arrow_forward.svg';
import { translations } from '../../../../../locales/i18n';
import { TradingPosition } from '../../../../../types/trading-position';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { SlippageForm } from '../SlippageForm';
import { DataCard } from '../DataCard';
import {
  PerpetualPageModals,
  PerpetualTrade,
  PerpetualTradeType,
} from '../../types';
import {
  TransitionStep,
  TransitionSteps,
} from '../../../../containers/TransitionSteps';
import { TransitionAnimation } from '../../../../containers/TransitionContainer';
import { TradeForm } from '../../components/TradeForm';
import { Asset } from '../../../../../types';

enum Step {
  unconnected = 'unconnected',
  trade = 'trade',
  slippage = 'slippage',
}

type StepProps = {
  trade: PerpetualTrade;
  onChangeTrade: (trade: PerpetualTrade) => void;
  onSubmit: () => void;
};

const NewPositionCardContext = React.createContext<StepProps>({
  trade: {
    pairType: PerpetualPairType.BTCUSD,
    collateral: Asset.PERPETUALS,
    position: TradingPosition.LONG,
    tradeType: PerpetualTradeType.MARKET,
    amount: '0',
    limit: '0',
    leverage: 1,
    slippage: 0.5,
  },
  onChangeTrade: () => {},
  onSubmit: () => {},
});

type NewPositionCardProps = {
  /** balance as wei string */
  balance: string | null;
};

export const NewPositionCard: React.FC<NewPositionCardProps> = ({
  balance,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { connected } = useWalletContext();
  const { pairType, collateral } = useSelector(selectPerpetualPage);

  const [trade, setTrade] = useState<PerpetualTrade>({
    pairType,
    collateral,
    position: TradingPosition.LONG,
    tradeType: PerpetualTradeType.MARKET,
    amount: '0',
    limit: '0',
    leverage: 1,
    slippage: 0.5,
  });

  const onSubmit = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.TRADE_REVIEW, trade)),
    [dispatch, trade],
  );

  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  useEffect(() => {
    if (!pair.collaterals.includes(collateral)) {
      dispatch(actions.setCollateral(pair.collaterals[0]));
    }
  }, [pair.collaterals, collateral, dispatch]);

  const stepProps: StepProps = useMemo(
    () => ({
      trade,
      onSubmit,
      onChangeTrade: setTrade,
    }),
    [trade, onSubmit],
  );

  return (
    <DataCard
      title={t(translations.perpetualPage.tradeForm.titles.order)}
      className="tw-relative"
      noPadding
    >
      <NewPositionCardContext.Provider value={stepProps}>
        <TransitionSteps<Step>
          classNameOuter="tw-h-full tw-min-h-max"
          classNameInner="tw-p-4 tw-h-full tw-min-h-max"
          active={connected ? Step.trade : Step.unconnected}
          defaultAnimation={TransitionAnimation.slideLeft}
          steps={StepComponents}
        />
      </NewPositionCardContext.Provider>
    </DataCard>
  );
};
const ConnectForm: TransitionStep<Step> = ({ changeTo }) => {
  const { t } = useTranslation();
  const { connect } = useWalletContext();

  return (
    <div className="tw-flex-grow tw-text-xs">
      <p className="tw-mt-4">
        {t(translations.perpetualPage.tradeForm.text.welcome1)}
      </p>
      <p className="tw-mb-2">
        {t(translations.perpetualPage.tradeForm.text.welcome2)}
      </p>
      <ul className="tw-ml-4 tw-mb-8 tw-list-disc">
        <Trans
          i18nKey={translations.perpetualPage.tradeForm.text.welcome3}
          components={[<li className="tw-mb-1" />]}
        />
      </ul>
      <p className="tw-mb-11">
        {/* TODO: add href to quickstart guide */}
        <Trans
          i18nKey={translations.perpetualPage.tradeForm.text.welcome4}
          components={[
            <a
              className="tw-text-secondary tw-underline"
              href="https://wiki.sovryn.app/"
            >
              Quickstart Guide
            </a>,
          ]}
        />
      </p>
      <button
        className="tw-w-full tw-min-h-10 tw-p-2 tw-text-base tw-text-primary tw-border tw-border-primary tw-bg-primary-05 tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-25"
        onClick={connect}
      >
        {t(translations.perpetualPage.tradeForm.buttons.connect)}
      </button>
    </div>
  );
};

const TradeFormStep: TransitionStep<Step> = ({ changeTo }) => {
  const { trade, onSubmit, onChangeTrade } = useContext(NewPositionCardContext);
  const onOpenSlippage = useCallback(() => changeTo(Step.slippage), [changeTo]);
  return (
    <TradeForm
      trade={trade}
      onOpenSlippage={onOpenSlippage}
      onSubmit={onSubmit}
      onChange={onChangeTrade}
    />
  );
};

const SlippageFormStep: TransitionStep<Step> = ({ changeTo }) => {
  const { t } = useTranslation();

  const { trade, onChangeTrade } = useContext(NewPositionCardContext);

  const onCloseSlippage = useCallback(
    () => changeTo(Step.trade, TransitionAnimation.slideLeft),
    [changeTo],
  );
  const onChangeSlippage = useCallback(
    slippage => onChangeTrade({ ...trade, slippage }),
    [trade, onChangeTrade],
  );

  return (
    <div>
      <h3 className="tw-relative tw-mb-12 tw-text-center tw-text-base tw-font-medium tw-normal-case tw-leading-normal">
        <button
          className="tw-absolute tw-left-0 tw-top-0"
          onClick={onCloseSlippage}
        >
          <img
            className="tw-transform tw-rotate-180"
            src={iconArrowForward}
            alt="Back"
            title="Back"
          />
        </button>
        {t(translations.perpetualPage.tradeForm.titles.slippage)}
      </h3>
      <SlippageForm slippage={trade.slippage} onChange={onChangeSlippage} />
    </div>
  );
};

const StepComponents = {
  [Step.unconnected]: ConnectForm,
  [Step.trade]: TradeFormStep,
  [Step.slippage]: SlippageFormStep,
};
