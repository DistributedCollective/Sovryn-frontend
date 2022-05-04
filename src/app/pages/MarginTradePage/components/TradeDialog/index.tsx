import React, { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { HashZero } from '@ethersproject/constants';
import { translations } from 'locales/i18n';
import { Asset, Nullable } from 'types';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { Dialog } from 'app/containers/Dialog';
import { useApproveAndTrade } from 'app/hooks/trading/useApproveAndTrade';
import { useTrading_resolvePairTokens } from 'app/hooks/trading/useTrading_resolvePairTokens';
import { useAccount } from 'app/hooks/useAccount';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { selectMarginTradePage } from '../../selectors';
import { actions } from '../../slice';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { TradeDialogInfo } from './TradeDialogInfo';
import { TradeToastInfo } from './TradeToastInfo';
import { Toast } from 'app/components/Toast';
import { MarginDetails } from 'app/hooks/trading/useGetEstimatedMarginDetails';
import { TradeDialogContent } from './TradeDialogContent';
import { SimulationStatus } from 'app/hooks/simulator/useFilterSimulatorResponseLogs';

interface ITradeDialogProps {
  isOpen: boolean;
  onCloseModal: () => void;
  orderType: OrderType;
  estimations: MarginDetails;
  simulatorStatus: SimulationStatus;
  simulatorError: Nullable<string>;
  entryPrice: string;
  liquidationPrice: string;
  minReturn: string;
}

export const TradeDialog: React.FC<ITradeDialogProps> = ({
  isOpen,
  onCloseModal,
  orderType,
  estimations,
  simulatorStatus,
  simulatorError,
  entryPrice,
  liquidationPrice,
  minReturn,
}) => {
  const account = useAccount();
  const { position, amount, pairType, collateral, leverage } = useSelector(
    selectMarginTradePage,
  );
  const dispatch = useDispatch();
  const pair = useMemo(() => TradingPairDictionary.get(pairType), [pairType]);

  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, collateral);
  const contractName = getLendingContractName(loanToken);

  const { trade, ...tx } = useApproveAndTrade(
    pair,
    position,
    collateral,
    leverage,
    amount,
    minReturn,
  );

  const submit = () => {
    if (orderType === OrderType.MARKET) {
      trade({
        pair,
        position,
        collateralToken,
        collateral,
        leverage,
        amount,
        positionSize: estimations.collateral,
      });
      onCloseModal();
    }
  };

  const txArgs = [
    HashZero, //0 if new loan
    toWei(String(leverage - 1), 'ether'),
    useLoanTokens ? amount : '0',
    useLoanTokens ? '0' : amount,
    getTokenContract(collateralToken).address,
    account, // trader
    minReturn,
    '0x',
  ];

  const txConf = {
    value: collateral === Asset.RBTC ? amount : '0',
  };

  return (
    <>
      <Dialog
        dataAttribute="margin-select-asset-review-order-close-button"
        isOpen={isOpen}
        onClose={onCloseModal}
      >
        {isOpen && (
          <TradeDialogContent
            onSubmit={submit}
            orderType={orderType}
            estimations={estimations}
            simulatorStatus={simulatorStatus}
            simulatorError={simulatorError}
            entryPrice={entryPrice}
            liquidationPrice={liquidationPrice}
            minReturn={minReturn}
          />
        )}
      </Dialog>
      <TransactionDialog
        tx={tx}
        onUserConfirmed={() => dispatch(actions.closeTradingModal(position))}
        fee={
          <TxFeeCalculator
            args={txArgs}
            txConfig={txConf}
            methodName="marginTrade"
            contractName={contractName}
            condition={true}
            textClassName={'tw-text-gray-10 tw-text-gray-10'}
          />
        }
        finalMessage={
          <TradeDialogInfo
            position={position}
            leverage={leverage}
            orderTypeValue={orderType}
            amount={amount}
            collateral={collateral}
            loanToken={loanToken}
            collateralToken={collateralToken}
            useLoanTokens={useLoanTokens}
          />
        }
        onError={() => {
          Toast(
            'error',
            <div className="tw-flex">
              <p className="tw-mb-0 tw-mr-2">
                <Trans
                  i18nKey={translations.transactionDialog.pendingUser.failed}
                />
              </p>
              <TradeToastInfo
                position={position}
                leverage={leverage}
                orderTypeValue={orderType}
                amount={amount}
                collateral={collateral}
                loanToken={loanToken}
                collateralToken={collateralToken}
                useLoanTokens={useLoanTokens}
              />
            </div>,
          );
        }}
        onSuccess={() => {
          Toast(
            'success',
            <div className="tw-flex">
              <p className="tw-mb-0 tw-mr-2">
                <Trans
                  i18nKey={translations.transactionDialog.txStatus.complete}
                />
              </p>
              <TradeToastInfo
                position={position}
                leverage={leverage}
                orderTypeValue={orderType}
                amount={amount}
                collateral={collateral}
                loanToken={loanToken}
                collateralToken={collateralToken}
                useLoanTokens={useLoanTokens}
              />
            </div>,
          );
        }}
      />
    </>
  );
};
