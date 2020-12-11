import React, { useEffect, useState } from 'react';
import { FastBTCTutorialComponent } from '../component';
import { useAccount, useIsConnected } from '../../../hooks/useAccount';
import {
  useInjectReducer,
  useInjectSaga,
} from '../../../../utils/redux-injectors';
import {
  actions,
  reducer,
  sliceKey,
} from '../../../containers/FastBtcForm/slice';
import { fastBtcFormSaga } from '../../../containers/FastBtcForm/saga';
import { useDispatch, useSelector } from 'react-redux';
import { selectFastBtcForm } from '../../../containers/FastBtcForm/selectors';
import { Icon } from '@blueprintjs/core';
import logo from '../../../../assets/images/sovryn-logo-white-inline.svg';
import { Screen2 } from '../screen2';
import { Screen3 } from '../screen3';

export function FastBTCTutorialDialog() {
  const [screen, setScreen] = useState(1);

  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: fastBtcFormSaga });

  const state = useSelector(selectFastBtcForm);
  const transactionDetected = state.depositTx;
  const dispatch = useDispatch();
  //
  // useEffect(() => {
  //   if (props.address && props.address.length) {
  //     dispatch(actions.changeReceiverAddress(props.address));
  //   }
  // }, [props.address, dispatch]);

  useEffect(() => {
    if (state.depositTx) {
      setTimeout(() => setScreen(3), 1500);
    }
  }, [state.depositTx]);

  function changeScreen(num) {
    setScreen(num);
  }

  return (
    <>
      <div className="fast-btc-tutorial_container position-absolute mx-auto">
        <div
          className={`dialog-box position-absolute bg-primary sovryn-border p-4 ${
            screen !== 1 && 'wide'
          }`}
        >
          <div
            className="position-absolute text-white close cursor-pointer"
            onClick={() => {}}
          >
            <Icon icon="cross" />
          </div>
          <div className="logo text-center mt-2">
            <img src={logo} alt="" />
          </div>
          {screen === 2 && (
            <Screen2
              btcAddress={state.depositAddress}
              transactionDetected={transactionDetected}
            />
          )}
          {screen === 3 && (
            <Screen3
              depositTxHash={state.depositTx ? state.depositTx.txHash : false}
              transferTxHash={
                state.transferTx ? state.transferTx.txHash : false
              }
            />
          )}
        </div>
      </div>
    </>
  );
}
