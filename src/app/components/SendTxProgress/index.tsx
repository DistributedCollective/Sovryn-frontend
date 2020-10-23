/**
 *
 * SendTxProgress
 *
 */
import React, { useState, useEffect } from 'react';
import { Icon } from '@blueprintjs/core';
import { TransactionStatus } from '../../../types/transaction-status';
import { LinkToExplorer } from '../LinkToExplorer';
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
      default: 'Your transaction is being processed.',
      trade:
        'Your transaction is being processed and will be added to your Trading Activity once completed.',
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

const getIcon = (status: TransactionStatus) => {
  switch (status) {
    default:
      return 'time';
    case TransactionStatus.SUCCESS:
      return 'tick';
    case TransactionStatus.ERROR:
      return 'error';
  }
};

export function SendTxProgress(props: Props) {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    props.status === TransactionStatus.PENDING_FOR_USER && setDisplay(true);
  }, [props.status]);

  const closeWindow = () => setDisplay(false);

  let color = props.position === TradingPosition.LONG ? 'teal' : 'gold';

  let mainText = getTitle(props.status, props.type);
  let subText = getDescription(props.status, props.type);

  if (props.status === TransactionStatus.ERROR) {
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
      <div className="flex-grow-0 flex-shrink-1 mr-3">
        <Icon
          icon={getIcon(props.status)}
          iconSize={17}
          style={{ color: `var(--${color})` }}
        />
      </div>
      <div className="flex-grow-1">
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
          className="text-uppercase font-weight-bold"
          style={{ color: `var(--${color})` }}
        >
          {mainText}
        </div>
        <div className="font-weight-light">
          {props.txHash ? (
            <>
              {subText && <p className="mb-1">{subText}</p>}
              <p className="m-0">
                Transaction:{' '}
                <LinkToExplorer
                  txHash={props.txHash}
                  className="ml-1 text-black"
                />
              </p>
            </>
          ) : (
            subText
          )}
        </div>
      </div>
    </div>
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
