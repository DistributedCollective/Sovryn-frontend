/**
 *
 * FastBtcForm
 *
 */

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import QRCode from 'qrcode.react';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { selectFastBtcForm } from './selectors';
import { fastBtcFormSaga } from './saga';
import { FieldGroup } from '../../components/FieldGroup';
import { InputField } from '../../components/InputField';
import { useAccount } from '../../hooks/useAccount';
import { TradeButton } from '../../components/TradeButton';
import { DummyField } from '../../components/DummyField';
import { Spinner } from '@blueprintjs/core';

interface Props {}

export function FastBtcForm(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: fastBtcFormSaga });

  const state = useSelector(selectFastBtcForm);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const address = useAccount();

  useEffect(() => {
    dispatch(actions.changeReceiverAddress(address));
  }, [address, dispatch]);

  useEffect(() => {
    console.log('state changed', state);
  }, [state]);

  return (
    <>
      <FieldGroup label={'RSK Wallet'}>
        <InputField
          invalid={!state.isReceiverAddressValid}
          value={state.receiverAddress}
          onChange={e =>
            dispatch(actions.changeReceiverAddress(e.currentTarget.value))
          }
          rightElement={
            state.isReceiverAddressValidating && (
              <>
                <Spinner size={18} />
              </>
            )
          }
        />
      </FieldGroup>

      {state.depositAddress && (
        <>
          <FieldGroup label={'BTC Deposit Address'}>
            <DummyField>{state.depositAddress}</DummyField>
          </FieldGroup>
          <div className="d-flex">
            <span>min: {state.minDepositAmount}</span>
            <span>max: {state.maxDepositAmount}</span>
          </div>
          <div className="text-center">
            <QRCode
              value={state.depositAddress}
              renderAs="svg"
              bgColor="var(--primary)"
              fgColor="var(--white)"
              size={258}
            />
          </div>
        </>
      )}

      {state.step === 1 && state.depositAddress && (
        <>
          <div className="d-flex flex-row justify-content-start">
            <span>Waiting for deposit</span>
            <Spinner size={22} />
          </div>
        </>
      )}

      {state.step === 2 && <></>}

      <div className="d-flex flex-row justify-content-end align-items-center">
        <TradeButton text={'Verify'} onClick={() => {}} />
      </div>
      {/*<div className="position-relative">*/}
      {/*  <div className="row">*/}
      {/*    <div className="col-4 pr-1">*/}
      {/*      <FieldGroup label={t(s.fields.currency)} labelColor={color}>*/}
      {/*        <FormSelect*/}
      {/*          onChange={value => setSourceToken(value.key)}*/}
      {/*          placeholder={t(s.fields.currency_placeholder)}*/}
      {/*          value={sourceToken}*/}
      {/*          items={options}*/}
      {/*        />*/}
      {/*      </FieldGroup>*/}
      {/*    </div>*/}
      {/*    <div className="col-8 pl-1">*/}
      {/*      <FieldGroup label={t(s.fields.receive)} labelColor={color}>*/}
      {/*        <DummyField>*/}
      {/*          <LoadableValue*/}
      {/*            value={<>{weiToFixed(rateByPath, 8)}</>}*/}
      {/*            loading={loading}*/}
      {/*          />*/}
      {/*        </DummyField>*/}
      {/*      </FieldGroup>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div>*/}
      {/*    <SendTxProgress {...tx} />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
}
