import React, { Dispatch, useCallback } from 'react';
import { Spinner } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { FastBtcFormState } from '../../types';
import { actions } from '../../slice';
import { TradeButton } from '../../../../components/TradeButton';

interface Props {
  state: FastBtcFormState;
  dispatch: Dispatch<any>;
}

export function Screen3({ state, dispatch }: Props) {
  const { t } = useTranslation();
  const s = translations.fastBTC.screens[3];

  const handleClose = useCallback(() => {
    dispatch(actions.showDialog(false));
    dispatch(actions.reset());
  }, [dispatch]);

  return (
    <>
      <div className="text-center">
        {!state.depositTx && !state.depositTx && <Spinner size={18} />}
        <div className="d-flex flex-column justify-content-center align-items-center">
          {state.depositTx && (
            <div className="d-flex flex-row justify-content-center align-items-center">
              {t(s.txId)}:{' '}
              <LinkToExplorer txHash={state.depositTx.txHash} realBtc={true} />
            </div>
          )}
          {state.transferTx && (
            <div className="d-flex flex-row justify-content-center align-items-center">
              {t(s.txHash)}: <LinkToExplorer txHash={state.transferTx.txHash} />
            </div>
          )}
        </div>
        <div className="d-flex flex-row justify-content-center align-items-center text-muted mt-2">
          <small>{state.transferTx?.txHash ? '2' : '1'}/2</small>
        </div>
      </div>
      {state.depositTx && (
        <>
          <div className="mt-3">
            <div className="font-weight-bold text-muted">{t(s.amount)}</div>
            <div>{state.depositTx?.value} BTC</div>
          </div>
          <div className="mt-3">
            <div className="font-weight-bold text-muted">{t(s.status)}</div>
            <div>{state.depositTx?.status}</div>
          </div>
        </>
      )}
      {state.transferTx && (
        <>
          <div className="mt-3">
            <div className="font-weight-bold text-muted">{t(s.amount)}</div>
            <div>{state.transferTx?.value} rBTC</div>
          </div>
        </>
      )}
      <div className="mt-3 text-center">
        <TradeButton
          text={t(translations.common.close)}
          onClick={handleClose}
        />
      </div>
    </>
  );
}
