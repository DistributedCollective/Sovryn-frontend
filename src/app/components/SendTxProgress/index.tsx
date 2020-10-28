/**
 *
 * SendTxProgress
 *
 */
import React, { useState, useEffect } from 'react';
import { Icon } from '@blueprintjs/core';
import { TransactionStatus } from '../../../types/transaction-status';
import { LinkToExplorer } from '../LinkToExplorer';
import { TopUpHint } from '../TopUpHint';
import { TradingPosition } from '../../../types/trading-position';

interface Props {
  status: TransactionStatus;
  txHash: string;
  loading: boolean;
  type: string;
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
      default: <TopUpHint />,
      trade: <TopUpHint />,
    },
  },
  success: {
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
  error: {
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

const getTitle = (
  status: TransactionStatus | string,
  type: string = 'default',
) => {
  if (typeClassifiers.hasOwnProperty(status)) {
    if (typeClassifiers[status].title.hasOwnProperty(type)) {
      return typeClassifiers[status].title[type];
    }
    return typeClassifiers[status].title.default;
  }
  return '!!! No title';
};
const getDescription = (
  status: TransactionStatus | string,
  type: string = 'default',
) => {
  if (typeClassifiers.hasOwnProperty(status)) {
    if (typeClassifiers[status].description.hasOwnProperty(type)) {
      return typeClassifiers[status].description[type];
    }
    return typeClassifiers[status].description.default;
  }
  return '!!! No description';
};

export function SendTxProgress(props: Props) {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    props.status === TransactionStatus.PENDING_FOR_USER && setDisplay(true);
  }, [props.status]);

  const closeWindow = () => setDisplay(false);

  let color = props.position === 'LONG' ? 'customTeal' : 'Gold';
  const iconSize = props.displayAbsolute ? 30 : 17;

  let mainText = getTitle(props.status, props.type);
  let subText = getDescription(props.status, props.type);

  if (props.status === TransactionStatus.ERROR) {
    color = 'Red';
    if (!props.txHash) {
      mainText = getTitle('denied', props.type);
      subText = getDescription('denied', props.type);
    }
  }

  return (
    <>
      <div
        className={`bg-${color} h-100 w-100 ${
          props.displayAbsolute ? 'position-absolute p-4' : 'my-3 px-3 py-2'
        }`}
        style={{
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          opacity: '0.9',
          display: display ? 'block' : 'none',
        }}
      >
        {props.status !== TransactionStatus.PENDING_FOR_USER &&
          props.displayAbsolute && (
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
          className={[
            'd-flex',
            props.displayAbsolute
              ? 'flex-column'
              : 'flex-row align-items-center',
          ].join(' ')}
        >
          {/* Icon row */}
          <div className="mr-3">
            {props.status === TransactionStatus.PENDING_FOR_USER && (
              <Icon icon="time" iconSize={iconSize} />
            )}
            {props.status === TransactionStatus.PENDING && (
              <Icon icon="time" iconSize={iconSize} />
            )}
            {props.status === TransactionStatus.SUCCESS && (
              <Icon icon="tick" iconSize={iconSize} />
            )}
            {props.status === TransactionStatus.ERROR && (
              <Icon icon="error" iconSize={iconSize} />
            )}
          </div>
          {/* Main text */}
          <div
            className={`font-weight-bold ${props.displayAbsolute && 'mt-1'}`}
            style={{ fontSize: props.displayAbsolute ? '22px' : '16px' }}
          >
            {mainText}
          </div>
        </div>

        {/* Sub text */}
        <div
          className="mt-1"
          style={{ fontSize: props.displayAbsolute ? '16px' : '14px' }}
        >
          {props.txHash ? (
            <>
              {subText && (
                <p className="mb-1 text-primaryBackground">{subText}</p>
              )}
              <p className="m-0">
                Transaction: <LinkToExplorer txHash={props.txHash} />
              </p>
            </>
          ) : (
            subText
          )}
        </div>
      </div>
    </>
  );
}

SendTxProgress.defaultProps = {
  status: TransactionStatus.NONE,
  txHash: null,
  loading: false,
  type: null,
  position: 'LONG',
  displayAbsolute: true,
};
