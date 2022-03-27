/**
 *
 * SendTxProgress
 *
 */
import React, { useEffect, useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { LinkToExplorer } from '../LinkToExplorer';
import { TradingPosition } from '../../../types/trading-position';
import {
  Transaction,
  TxStatus,
  TxType,
} from '../../../store/global/transactions-store/types';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../../../store/global/transactions-store/selectors';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import classNames from 'classnames';

interface Props {
  status: TxStatus;
  txHash: string;
  loading: boolean;
  type: TxType;
  position: string;
  displayAbsolute: boolean;
}

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

/**
 * @deprecated use TxDialog component instead
 * @param props
 * @constructor
 */
export function SendTxProgress(props: Props) {
  const { t } = useTranslation();
  const [display, setDisplay] = useState(false);

  const [tx, setTx] = useState<Transaction>();
  const transactions = useSelector(selectTransactions);

  useEffect(() => {
    props.status === TxStatus.PENDING_FOR_USER && setDisplay(true);
    props.status === TxStatus.NONE && setDisplay(false);
  }, [props.status]);

  useEffect(() => {
    if (props.txHash && transactions.hasOwnProperty(props.txHash)) {
      setTx(transactions[props.txHash]);
    } else {
      setTx(undefined);
    }
  }, [props.txHash, transactions]);

  const closeWindow = () => setDisplay(false);

  const getTitle = (status: TxStatus | string, type: TxType = TxType.NONE) => {
    if (translations.sendTxProgress.hasOwnProperty(status)) {
      return t(translations.sendTxProgress[status].title);
    }
    return '!!! No title';
  };

  const getDescription = (
    status: TxStatus | string,
    type: TxType = TxType.NONE,
  ) => {
    if (translations.sendTxProgress.hasOwnProperty(status)) {
      return t(translations.sendTxProgress[status].text);
    }
    return '!!! No description';
  };

  let color =
    props.position === TradingPosition.LONG
      ? 'tw-text-long'
      : 'tw-text-primary';

  let mainText = getTitle(props.status, props.type);
  let subText = getDescription(props.status, props.type);

  if (props.status === TxStatus.FAILED) {
    color = 'tw-text-warning';
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
      className={`tw-bg-sov-white tw-text-black tw-p-6 tw-rounded tw-flex tw-flex-row tw-justify-between ${
        props.displayAbsolute ? 'tw-absolute tw-p-6' : 'tw-my-4 tw-px-4 tw-py-2'
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
          <div className="tw-flex-grow-0 tw-flex-shrink tw-mr-4">
            <Icon icon="time" iconSize={17} className={color} />
          </div>
          <div className="tw-flex-grow">
            {props.displayAbsolute && (
              <div
                className="tw-relative tw-float-right"
                style={{
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
                onClick={closeWindow}
              >
                <u>Close</u> X
              </div>
            )}
            <div className={classNames('tw-uppercase tw-font-bold', color)}>
              {t(translations.sendTxProgress.pending_for_user.title)}
            </div>
            <div className="tw-font-normal">
              {t(translations.sendTxProgress.pending_for_user.text)}
            </div>
          </div>
        </>
      )}

      {tx && (
        <>
          <div className="tw-flex-grow-0 tw-flex-shrink tw-mr-4">
            <Icon
              icon={getIcon(props.status)}
              iconSize={17}
              className={color}
            />
          </div>
          <div className="tw-flex-grow">
            <div
              className="tw-relative tw-float-right"
              style={{
                fontSize: '12px',
                cursor: 'pointer',
              }}
              onClick={closeWindow}
            >
              <u>{t(translations.sendTxProgress.texts.closeButton)}</u> X
            </div>
            <div className={classNames('tw-uppercase tw-font-bold', color)}>
              {mainText}
            </div>
            <div className="tw-font-normal">
              {tx?.transactionHash ? (
                <>
                  {subText && <p className="tw-mb-1">{subText}</p>}
                  <p className="tw-m-0">
                    {t(translations.sendTxProgress.texts.transaction)}:{' '}
                    {tx?.approveTransactionHash && (
                      <>
                        <LinkToExplorer
                          txHash={tx.approveTransactionHash}
                          className="tw-ml-1 tw-text-black"
                        />
                        {' & '}
                      </>
                    )}
                    <LinkToExplorer
                      txHash={tx.transactionHash}
                      className="tw-ml-1 tw-text-black"
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
          <div className="tw-flex-grow-0 tw-flex-shrink tw-mr-4">
            <Icon
              icon={getIcon(props.status)}
              iconSize={17}
              className={color}
            />
          </div>
          <div className="tw-flex-grow">
            <div
              className="tw-relative tw-float-right"
              style={{
                fontSize: '12px',
                cursor: 'pointer',
              }}
              onClick={closeWindow}
            >
              <u>{t(translations.sendTxProgress.texts.closeButton)}</u> X
            </div>
            <div className={classNames('tw-uppercase tw-font-bold', color)}>
              {mainText}
            </div>
            <div className="tw-font-normal">{subText}</div>
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
