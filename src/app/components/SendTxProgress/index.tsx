/**
 *
 * SendTxProgress
 *
 */
import React, { useEffect, useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { LinkToExplorer } from '../LinkToExplorer';
import { TradingPosition } from '../../../types/trading-position';
import { TopUpHint } from '../TopUpHint';
import {
  Transaction,
  TxStatus,
  TxType,
} from '../../../store/global/transactions-store/types';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../../../store/global/transactions-store/selectors';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

interface Props {
  status: TxStatus;
  txHash: string;
  loading: boolean;
  type: TxType;
  position: string;
  displayAbsolute: boolean;
}

const typeClassifiers = {
  pending_for_user: {
    title: {
      default: 'Waiting for user',
    },
    description: {
      default: 'Please confirm transaction in your wallet',
    },
  },
  pending: {
    title: {
      default: 'Transaction pending',
      approve: 'Approving',
      trade: 'Trade in Progress',
      lend: 'Lending in Progress',
      top_up: 'Top Up in Progress',
      trade_close: 'Closing Position',
      withdraw: 'Withdrawal in Progress',
    },
    description: {
      default: 'Your transaction is being processed.',
      trade: <TopUpHint />,
    },
  },
  confirmed: {
    title: {
      default: 'Transaction confirmed!',
      approve: 'Approved successfully!',
      trade: 'Trade was successful!',
      lend: 'Lending was successful!',
      top_up: 'Top Up Successful!',
      trade_close: 'Position Closed!',
      withdraw: 'Withdrawal was successful!',
    },
    description: {
      default: 'Your transaction was confirmed in the blockchain.',
    },
  },
  failed: {
    title: {
      default: 'Transaction failed!',
      approve: 'Failed to approve!',
      trade: 'Trade failed!',
      lend: 'Lending failed!',
      top_up: 'Top Up failed!',
      trade_close: 'Failed to close position!',
      withdraw: 'Withdraw failed!',
    },
    description: {
      default: 'Transaction was reverted by contract.',
    },
  },
  denied: {
    title: {
      default: 'Rejected.',
    },
    description: {
      default: 'User denied transaction',
    },
  },
};

const getTitle = (status: TxStatus | string, type: TxType = TxType.NONE) => {
  if (typeClassifiers.hasOwnProperty(status)) {
    if (typeClassifiers[status].title.hasOwnProperty(type)) {
      return typeClassifiers[status].title[type];
    }
    return typeClassifiers[status].title.default;
  }
  return '!!! No title';
};
const getDescription = (
  status: TxStatus | string,
  type: TxType = TxType.NONE,
) => {
  if (typeClassifiers.hasOwnProperty(status)) {
    if (typeClassifiers[status].description.hasOwnProperty(type)) {
      return typeClassifiers[status].description[type];
    }
    return typeClassifiers[status].description.default;
  }
  return '!!! No description';
};

const getIcon = (status: TxStatus) => {
  switch (status) {
    default:
      return 'time';
    case TxStatus.CONFIRMED:
      return 'tick';
    case TxStatus.FAILED:
      return 'error';
  }
};

export function SendTxProgress(props: Props) {
  const { t } = useTranslation();
  const [display, setDisplay] = useState(false);

  const [tx, setTx] = useState<Transaction>();
  // const [approveTx, setApproveTx] = useState<Transaction>();
  const transactions = useSelector(selectTransactions);

  useEffect(() => {
    props.status === TxStatus.PENDING_FOR_USER && setDisplay(true);
  }, [props.status]);

  useEffect(() => {
    if (props.txHash && transactions.hasOwnProperty(props.txHash)) {
      setTx(transactions[props.txHash]);
      // if (
      //   transactions[props.txHash].approveTransactionHash &&
      //   transactions.hasOwnProperty(
      //     transactions[props.txHash].approveTransactionHash as string,
      //   )
      // ) {
      //   setApproveTx(
      //     transactions[
      //       transactions[props.txHash].approveTransactionHash as string
      //     ],
      //   );
      // } else {
      //   setApproveTx(undefined);
      // }
    } else {
      setTx(undefined);
      // setApproveTx(undefined);
    }
  }, [props.txHash, transactions]);

  const closeWindow = () => setDisplay(false);

  let color = props.position === TradingPosition.LONG ? 'teal' : 'gold';

  let mainText = getTitle(props.status, props.type);
  let subText = getDescription(props.status, props.type);

  if (props.status === TxStatus.FAILED) {
    color = 'red';
    if (!props.txHash) {
      mainText = getTitle('denied', props.type);
      subText = getDescription('denied', props.type);
    }
  }

  if (!display) {
    return null;
  }

  return (
    <div
      className={`bg-white text-black p-4 rounded d-flex flex-row justify-content-between ${
        props.displayAbsolute ? 'position-absolute p-4' : 'my-3 px-3 py-2'
      }`}
      style={{
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
      }}
    >
      {!tx && props.status === TxStatus.PENDING_FOR_USER && (
        <>
          <div className="flex-grow-0 flex-shrink-1 mr-3">
            <Icon
              icon="time"
              iconSize={17}
              style={{ color: `var(--${color})` }}
            />
          </div>
          <div className="flex-grow-1">
            {props.displayAbsolute && (
              <div
                className="position-relative float-right"
                style={{
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
                onClick={closeWindow}
              >
                <u>Close</u> X
              </div>
            )}
            <div
              className="text-uppercase font-weight-bold"
              style={{ color: `var(--${color})` }}
            >
              {t(translations.sendTxProgress.pending_for_user.title)}
            </div>
            <div className="font-weight-light">
              {t(translations.sendTxProgress.pending_for_user.title)}
            </div>
          </div>
        </>
      )}

      {tx && (
        <>
          <div className="flex-grow-0 flex-shrink-1 mr-3">
            <Icon
              icon={getIcon(props.status)}
              iconSize={17}
              style={{ color: `var(--${color})` }}
            />
          </div>
          <div className="flex-grow-1">
            {props.displayAbsolute && (
              <div
                className="position-relative float-right"
                style={{
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
                onClick={closeWindow}
              >
                <u>Close</u> X
              </div>
            )}
            <div
              className="text-uppercase font-weight-bold"
              style={{ color: `var(--${color})` }}
            >
              {mainText}
            </div>
            <div className="font-weight-light">
              {tx?.transactionHash ? (
                <>
                  {subText && <p className="mb-1">{subText}</p>}
                  <p className="m-0">
                    Transaction:{' '}
                    {tx?.approveTransactionHash && (
                      <>
                        <LinkToExplorer
                          txHash={tx.approveTransactionHash}
                          className="ml-1 text-black"
                        />
                        {' & '}
                      </>
                    )}
                    <LinkToExplorer
                      txHash={tx.transactionHash}
                      className="ml-1 text-black"
                    />
                  </p>
                </>
              ) : (
                subText
              )}
            </div>
          </div>
        </>
      )}

      {!tx && props.status === TxStatus.FAILED && (
        <>
          <div className="flex-grow-0 flex-shrink-1 mr-3">
            <Icon
              icon={getIcon(props.status)}
              iconSize={17}
              style={{ color: `var(--${color})` }}
            />
          </div>
          <div className="flex-grow-1">
            <div
              className="position-relative float-right"
              style={{
                fontSize: '12px',
                cursor: 'pointer',
              }}
              onClick={closeWindow}
            >
              <u>Close</u> X
            </div>
            <div
              className="text-uppercase font-weight-bold"
              style={{ color: `var(--${color})` }}
            >
              {mainText}
            </div>
            <div className="font-weight-light">{subText}</div>
          </div>
        </>
      )}
    </div>
  );
}

SendTxProgress.defaultProps = {
  status: TxStatus.NONE,
  txHash: null,
  loading: false,
  type: null,
  position: 'LONG',
  displayAbsolute: true,
};
