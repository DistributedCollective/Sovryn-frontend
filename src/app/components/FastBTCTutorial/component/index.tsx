import React, { useState, useEffect } from 'react';
import logo from 'assets/images/sovryn-logo-white-inline.svg';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@blueprintjs/core';
import { Screen1 } from '../screen1';
import { Screen2 } from '../screen2';
import { Screen3 } from '../screen3';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  reducer,
  sliceKey,
  actions,
} from '../../../containers/FastBtcForm/slice';
import { selectFastBtcForm } from '../../../containers/FastBtcForm/selectors';
import { fastBtcFormSaga } from '../../../containers/FastBtcForm/saga';

export function FastBTCTutorialComponent(props) {
  const [screen, setScreen] = useState(1);

  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: fastBtcFormSaga });

  const state = useSelector(selectFastBtcForm);
  const transactionDetected = state.depositTx;
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.address && props.address.length) {
      dispatch(actions.changeReceiverAddress(props.address));
    }
  }, [props.address, dispatch]);

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
            onClick={() => props.handleClose()}
          >
            <Icon icon="cross" />
          </div>
          <div className="logo text-center mt-2">
            <img src={logo} alt="" />
          </div>
          {screen === 1 && (
            <Screen1
              btcAddress={state.depositAddress}
              changeScreen={changeScreen}
            />
          )}
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
