import React, { Dispatch } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { FastBtcFormState } from '../../../containers/FastBtcForm/types';
import { actions } from 'app/containers/FastBtcForm/slice';

interface Props {
  state: FastBtcFormState;
  dispatch: Dispatch<any>;
}

export function Screen1(props: Props) {
  const { t } = useTranslation();
  const s = translations.fastBTC.screens[1];

  return (
    <>
      <div className="heading my-4">
        <h2>{t(s.title)}</h2>
      </div>
      <div className="btc-address sovryn-border bg-primary py-3 pl-2">
        <div className="row d-flex w-100 mx-auto">
          <div className="green-circle mx-1"></div>
          {/*{props.state.receiverAddress.length > 0 && (*/}
          {/*  <>*/}
          {/*    <CopyToClipboard text={props.btcAddress}>*/}
          {/*      <div className="flex-shrink-1">{`${props.btcAddress.substring(*/}
          {/*        0,*/}
          {/*        48,*/}
          {/*      )}...`}</div>*/}
          {/*    </CopyToClipboard>*/}
          {/*  </>*/}
          {/*)}*/}
          <div className="address-link">
            <Button small minimal className="text-white" icon="log-out" />
          </div>
        </div>
      </div>
      <div className="description my-4">
        <p>{t(s.p1)}</p>
        <p>{t(s.p2)}</p>
      </div>
      <div className="create-button text-center position-absolute">
        <button
          type="button"
          className="btn"
          onClick={() => props.dispatch(actions.changeStep(2))}
        >
          <div>{t(s.createAddress)}</div>
        </button>
      </div>
    </>
  );
}
