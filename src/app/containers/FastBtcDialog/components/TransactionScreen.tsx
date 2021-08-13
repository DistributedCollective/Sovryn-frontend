import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { FastBtcDialogState, TxId } from '../types';
import styles from './transaction.module.scss';
import { prettyTx } from '../../../../utils/helpers';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { Button } from '@blueprintjs/core';
import { toNumberFormat } from '../../../../utils/display-text/format';
import { useAccount } from '../../../hooks/useAccount';

interface Props {
  state: FastBtcDialogState;
  dispatch: Dispatch<any>;
  onClose: () => void;
}

export function TransactionScreen({ state, dispatch, onClose }: Props) {
  const address = useAccount();
  const { t } = useTranslation();

  const step = state.txId === TxId.DEPOSIT ? 1 : 2;
  const tx = state.txId === TxId.DEPOSIT ? state.depositTx : state.transferTx;

  return (
    <>
      <h2 className={styles.title}>
        {t(translations.fastBtcDialog.transaction.title)}
      </h2>
      <div className={styles.subtitle}>
        <i>
          {t(translations.fastBtcDialog.transaction.status, {
            status: `${step}/2 ${
              t(translations.fastBtcDialog.transaction[tx.status]) ||
              t(translations.fastBtcDialog.transaction.sent)
            }`,
          })}
        </i>
      </div>

      <div className="tw-flex tw-flex-row tw-justify-center tw-items-center">
        <div className={styles.amountBlock}>
          <div className={styles.amountBlockBtc}>
            {toNumberFormat(tx.value, 4)} BTC
          </div>
        </div>
      </div>

      <div className="tw-flex tw-flex-row tw-justify-center tw-items-center">
        <div className={styles.txData}>
          <div className="tw-px-1">
            <div>
              <strong>{t(translations.fastBtcDialog.transaction.from)}</strong>{' '}
              {prettyTx(state.deposit.address)}
            </div>

            <div className={styles.arrowDown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38.776"
                height="38.483"
                viewBox="0 0 38.776 38.483"
              >
                <path
                  id="Path_2946"
                  data-name="Path 2946"
                  d="M99.026,15.924,88.13,5v8.193H68.986v5.462H88.13v8.193Z"
                  transform="translate(35.312 -65.486) rotate(90)"
                  fill="#e9eae9"
                  stroke="#e9eae9"
                  strokeWidth="7"
                />
              </svg>
            </div>

            <div>
              <strong>{t(translations.fastBtcDialog.transaction.to)}</strong>{' '}
              {prettyTx(address)}
            </div>
          </div>

          <div className="tw-mt-8">
            <div className="tw-mt-2">
              <strong>{t(translations.fastBtcDialog.transaction.hash)}</strong>{' '}
              <LinkToExplorer
                txHash={tx.txHash}
                realBtc={state.txId === TxId.DEPOSIT}
                className="tw-text-primary tw-font-light"
              />
            </div>
          </div>

          <div className="tw-mt-12 tw-justify-center tw-items-center tw-flex tw-flex-row">
            <Button
              minimal
              className="button-round tw-text-primary tw-text-lg tw-mx-auto"
              text={t(translations.fastBtcDialog.transaction.close)}
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );
}
