/**
 *
 * BridgeWithdrawPage
 *
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { actions, reducer, sliceKey } from './slice';
import { selectBridgeWithdrawPage } from './selectors';
import { bridgeWithdrawPageSaga } from './saga';
import { WithdrawStep } from './types';
import { ChainSelector } from './components/ChainSelector';
import { TokenSelector } from './components/TokenSelector';
import { AmountSelector } from './components/AmountSelector';
import { ReviewStep } from './components/ReviewStep';
import { ConfirmStep } from './components/ConfirmStep';
import { Asset, Chain } from '../../../types';
import babelfishIcon from 'assets/images/babelfish.svg';

import './styles.scss';
import { SidebarSteps } from './components/SidebarSteps';
import { CrossBridgeAsset } from '../BridgeDepositPage/types/cross-bridge-asset';
import { ReceiverSelector } from './components/ReceiverSelector';

interface Props {}

const dirtyWithdrawAssets = {
  [Asset.ETH]: CrossBridgeAsset.ETHS,
};

export function BridgeWithdrawPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bridgeWithdrawPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { step } = useSelector(selectBridgeWithdrawPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const history = useHistory();

  const location = useLocation<any>();

  useEffect(() => {
    if (!location.state?.receiver || !location.state?.asset) {
      history.push('/wallet');
    } else {
      dispatch(actions.initReceiver(location.state?.receiver));
      // todo: change our main ETH to actual ETHs (in backend too).
      if (dirtyWithdrawAssets.hasOwnProperty(location.state?.asset)) {
        dispatch(
          actions.selectSourceAsset(dirtyWithdrawAssets[location.state?.asset]),
        );
      } else {
        dispatch(actions.selectSourceAsset(location.state?.asset));
      }
    }
  }, [location.state, history, dispatch]);

  useEffect(() => {
    dispatch(actions.init());
    dispatch(actions.selectSourceNetwork(Chain.RSK));
    return () => {
      // Unset bridge settings
      dispatch(actions.reset());
      dispatch(actions.close());
    };
  }, [dispatch]);

  return (
    <>
      <div
        className="tw-flex tw-flex-row tw-justify-between tw-items-start tw-w-full tw-p-5"
        style={{ marginTop: '-4.4rem' }}
      >
        <div
          className="tw-relative tw-h-full tw-flex tw-flex-col tw-items-start tw-justify-around tw-pl-8"
          style={{ minWidth: 200, minHeight: 'calc(100vh - 2.5rem)' }}
        >
          <SidebarSteps />
          <div></div>
        </div>

        <div
          style={{ minHeight: 'calc(100vh - 2.5rem)' }}
          className="tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-around tw-relative"
        >
          <SwitchTransition>
            <CSSTransition
              key={step}
              addEndListener={(node, done) =>
                node.addEventListener('transitionend', done, false)
              }
              classNames="fade"
            >
              <>
                {step === WithdrawStep.CHAIN_SELECTOR && <ChainSelector />}
                {step === WithdrawStep.TOKEN_SELECTOR && <TokenSelector />}
                {step === WithdrawStep.AMOUNT_SELECTOR && <AmountSelector />}
                {step === WithdrawStep.RECEIVER_SELECTOR && (
                  <ReceiverSelector />
                )}
                {step === WithdrawStep.REVIEW && <ReviewStep />}
                {[
                  WithdrawStep.CONFIRM,
                  WithdrawStep.PROCESSING,
                  WithdrawStep.COMPLETE,
                ].includes(step) && <ConfirmStep />}
              </>
            </CSSTransition>
          </SwitchTransition>
          <div className="tw-flex tw-flex-col tw-items-center">
            <img className="tw-mb-1" src={babelfishIcon} alt="babelFish" />
            Powered by babelFish
          </div>
        </div>
      </div>
    </>
  );
}
