/**
 *
 * SendTxProgress
 *
 */
import React, { useState, useEffect } from 'react';
import { Icon } from '@blueprintjs/core';
import { TransactionStatus } from '../../../types/transaction-status';
import { LinkToExplorer } from '../LinkToExplorer';

interface Props {
  status: TransactionStatus;
  txHash: string;
  loading: boolean;
  type: string;
  position: string;
  displayAbsolute: boolean;
}

export function SendTxProgress(props: Props) {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    props.status === TransactionStatus.PENDING_FOR_USER && setDisplay(true);
  }, [props.status]);

  const closeWindow = () => setDisplay(false);

  let color = props.position === 'LONG' ? 'customTeal' : 'Gold';

  let mainText = '';
  let subText = '';

  if (props.status === TransactionStatus.PENDING_FOR_USER) {
    mainText = 'Trade in Progress...';
    subText = 'Please confirm your trade in MetaMask';
  }

  if (props.status === TransactionStatus.PENDING) {
    mainText = 'Trade in Progress...';
  }

  if (props.status === TransactionStatus.SUCCESS) {
    mainText = 'Trade Successful';
  }

  if (props.status === TransactionStatus.ERROR) {
    color = 'Red';
    mainText = 'Transaction Denied';
    subText = '';
  }

  return (
    <>
      <div
        className={`bg-${color} p-4 mb-2 h-100 w-100 ${
          props.displayAbsolute && 'position-absolute'
        }`}
        style={{
          top: '0',
          opacity: '0.9',
          display: display ? 'block' : 'none',
        }}
      >
        {props.status !== TransactionStatus.PENDING_FOR_USER && (
          <div
            className="position-absolute"
            style={{
              top: '5px',
              right: '5px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
            onClick={closeWindow}
          >
            <u>Close</u> X
          </div>
        )}
        {/* Icon row */}
        <div className="my-2" style={{ fontSize: '24px' }}>
          {props.status === TransactionStatus.PENDING_FOR_USER && (
            <Icon icon="time" iconSize={40} />
          )}
          {props.status === TransactionStatus.PENDING && (
            <Icon icon="time" iconSize={40} />
          )}
          {props.status === TransactionStatus.SUCCESS && (
            <Icon icon="tick" iconSize={40} />
          )}
          {props.status === TransactionStatus.ERROR && (
            <Icon icon="error" iconSize={40} />
          )}
        </div>

        {/* Main text */}
        <div className="my-2 font-weight-bold" style={{ fontSize: '22px' }}>
          {mainText}
        </div>

        {/* Sub text */}
        <div className="my-2">
          {props.txHash ? <LinkToExplorer txHash={props.txHash} /> : subText}
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
