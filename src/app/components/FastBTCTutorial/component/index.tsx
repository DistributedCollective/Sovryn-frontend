import React, { useState, useEffect, useCallback } from 'react';
import logo from 'assets/images/sovryn-logo-white-inline.svg';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Spinner } from '@blueprintjs/core';
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
import { FieldGroup } from '../../../components/FieldGroup';
import { InputField } from '../../../components/InputField';
import { useAccount, useIsConnected } from '../../../hooks/useAccount';
import { DummyField } from '../../../components/DummyField';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { weiTo4, weiToFixed } from 'utils/blockchain/math-helpers';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { TradeButton } from '../../../components/TradeButton';

import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export function FastBTCTutorialComponent(props) {
  const { t } = useTranslation();
  const [screen, setScreen] = useState(3);

  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: fastBtcFormSaga });

  const isConnected = useIsConnected();
  const state = useSelector(selectFastBtcForm);
  const transactionDetected = state.depositTx;

  const dispatch = useDispatch();

  const address = useAccount();

  useEffect(() => {
    if (address && address.length) {
      dispatch(actions.changeReceiverAddress(address));
    }
  }, [address, dispatch]);

  useEffect(() => {
    if (state.depositTx) {
      setTimeout(() => setScreen(3), 1500);
    }
  }, [state.depositTx]);

  const handleInputChange = useCallback(
    e => {
      dispatch(actions.changeReceiverAddress(e.currentTarget.value));
    },
    [dispatch],
  );

  return (
    <>
      <div className="fast-btc-tutorial_container position-absolute mx-auto">
        <div
          className={`dialog-box position-absolute bg-primary sovryn-border p-4 ${
            screen !== 1 && 'wide'
          }`}
        >
          <div className="position-absolute text-white close">
            <Icon icon="cross" />
          </div>
          <div className="logo text-center mt-2">
            <img src={logo} alt="" />
          </div>
          {screen === 1 && (
            <Screen1
              btcAddress={state.depositAddress}
              changeScreen={setScreen}
            />
          )}
          {screen === 2 && (
            <Screen2
              btcAddress={state.depositAddress}
              transactionDetected={transactionDetected}
            />
          )}
          {screen === 3 && <Screen3 />}
        </div>
      </div>
    </>
  );
}
