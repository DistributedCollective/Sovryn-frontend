import React from 'react';
import { Spinner } from '@blueprintjs/core';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function Screen3(props) {
  const { t } = useTranslation();
  const s = translations.fastBTC.screens[3];

  return (
    <>
      <h2 className="mt-3">{t(s.txDetails)}</h2>
      <p className="m-3 text-center">
        {t(s.txHash)}:{' '}
        <div className="d-inline-block">
          {!props.depositTxHash && !props.transferTxHash && (
            <Spinner size={18} />
          )}
          {props.depositTxHash && !props.transferTxHash && (
            <LinkToExplorer txHash={props.depositTxHash} realBtc={true} />
          )}
          {props.transferTxHash && (
            <LinkToExplorer txHash={props.transferTxHash} />
          )}
        </div>
      </p>
      <div className="row m-1">
        <div className="col-6">
          <p>
            {t(s.from)}: <br /> address...
          </p>
          <p>
            {t(s.to)}: <br /> address...
          </p>
          <p>
            {t(s.amount)}: <br /> amount...
          </p>
          <p>
            {t(s.fee)}: <br /> 1.00 USD
          </p>
        </div>
        <div className="col-6">
          <p>
            {t(s.initiated)}:<span className="float-right">time...</span>
          </p>
          <p>
            Status:<span className="float-right">status...</span>
          </p>
          <p>
            Estimated Time:<span className="float-right">time...</span>
          </p>
        </div>
      </div>
      <div className="create-button text-right position-absolute">
        <button type="button" className="btn">
          <div>{t(translations.common.close)}</div>
        </button>
      </div>
    </>
  );
}
