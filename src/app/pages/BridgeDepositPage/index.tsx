/**
 *
 * BridgeDepositPage
 *
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useWalletContext } from '@sovryn/react-wallet';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';

import { reducer, sliceKey, actions } from './slice';
import { selectBridgeDepositPage } from './selectors';
import { bridgeDepositPageSaga } from './saga';
import { DepositStep } from './types';
import { ChainSelector } from './components/ChainSelector';
import { TokenSelector } from './components/TokenSelector';
import { AmountSelector } from './components/AmountSelector';
import { ReviewStep } from './components/ReviewStep';

import './styles.scss';
import { SidebarSteps } from './components/SidebarSteps';

interface Props {}

export function BridgeDepositPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bridgeDepositPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { step } = useSelector(selectBridgeDepositPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const history = useHistory();

  const location = useLocation<any>();
  const walletContext = useWalletContext();

  useEffect(() => {
    if (!location.state?.receiver || !location.state?.asset) {
      history.push('/wallet');
    } else {
      dispatch(actions.selectReceiver(location.state?.receiver));
      dispatch(actions.selectTargetAsset(location.state?.asset));
    }
  }, [location.state, history, dispatch]);

  useEffect(() => {
    return () => {
      // Unset bridge settings
      dispatch(walletProviderActions.setBridgeChainId(null));
      // dispatch(walletProviderActions.chainChanged(currentChainId));
      console.log('back to portfolio?');
    };
  }, [dispatch]);

  return (
    <>
      <div className="tw-bg-black">
        <pre>
          <div>Receiver address: {location?.state?.receiver}</div>
          <div>
            User Address: {walletContext.address} // {walletContext.chainId}
          </div>
        </pre>
      </div>

      <div className="tw-flex tw-flex-row tw-justify-between tw-items-start tw-w-full tw-p-5">
        {/* <div className="tw-w-4/12">
          <SidebarSteps />
       
        </div> */}
        <div
          className="tw-relative tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-start tw-pl-8"
          style={{ minWidth: 200 }}
        >
          <SidebarSteps />
          <div>
            <Link to="/wallet">Back to portfolio.</Link>
          </div>
        </div>

        <div className="tw-w-8/12">
          <SwitchTransition>
            <CSSTransition
              key={step}
              addEndListener={(node, done) =>
                node.addEventListener('transitionend', done, false)
              }
              classNames="fade"
            >
              <>
                {step === DepositStep.CHAIN_SELECTOR && <ChainSelector />}
                {step === DepositStep.TOKEN_SELECTOR && <TokenSelector />}
                {step === DepositStep.AMOUNT_SELECTOR && <AmountSelector />}
                {step === DepositStep.REVIEW && <ReviewStep />}
                {step === DepositStep.CONFIRM && <>Confirm</>}
                {step === DepositStep.PROCESSING && <>Processing</>}
                {step === DepositStep.COMPLETE && <>Complete</>}
              </>
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
    </>
  );
}
