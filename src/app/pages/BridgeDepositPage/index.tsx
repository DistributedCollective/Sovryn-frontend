/**
 *
 * BridgeDepositPage
 *
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';

import { actions, reducer, sliceKey } from './slice';
import { selectBridgeDepositPage } from './selectors';
import { bridgeDepositPageSaga } from './saga';
import { DepositStep } from './types';
import { ChainSelector } from './components/ChainSelector';
import { TokenSelector } from './components/TokenSelector';
import { AmountSelector } from './components/AmountSelector';
import { ReviewStep } from './components/ReviewStep';
import { ConfirmStep } from './components/ConfirmStep';
import { CompleteStep } from './components/CompleteStep';
import { Asset } from '../../../types';
import { CrossBridgeAsset } from './types/cross-bridge-asset';
import babelfishIcon from 'assets/images/babelfish.svg';

import './styles.scss';
import { SidebarSteps } from './components/SidebarSteps';

interface Props {}

const dirtyDepositAsset = {
  [Asset.ETH]: CrossBridgeAsset.ETHS,
};

export function BridgeDepositPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bridgeDepositPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { step } = useSelector(selectBridgeDepositPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const history = useHistory();

  const location = useLocation<any>();

  useEffect(() => {
    if (!location.state?.receiver || !location.state?.asset) {
      history.push('/wallet');
    } else {
      dispatch(actions.selectReceiver(location.state?.receiver));
      // todo: change our main ETH to actual ETHs (in backend too).
      if (dirtyDepositAsset.hasOwnProperty(location.state?.asset)) {
        dispatch(
          actions.selectTargetAsset(dirtyDepositAsset[location.state?.asset]),
        );
      } else {
        dispatch(actions.selectTargetAsset(location.state?.asset));
      }
    }
  }, [location.state, history, dispatch]);

  useEffect(() => {
    dispatch(actions.init());
    return () => {
      // Unset bridge settings
      dispatch(walletProviderActions.setBridgeChainId(null));
      dispatch(actions.reset());
      dispatch(actions.close());
    };
  }, [dispatch]);

  return (
    <>
      <div className="tw-flex tw-flex-row tw-justify-between tw-items-start tw-w-full tw-p-5">
        <div
          className="tw-relative tw-h-full tw-flex tw-flex-col tw-items-start tw-justify-around tw-pl-8"
          style={{ minWidth: 200, minHeight: 'calc(100vh - 4.4rem)' }}
        >
          <SidebarSteps />
          <div></div>
        </div>

        <div
          style={{ minHeight: 'calc(100vh - 4.4rem)' }}
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
                {step === DepositStep.CHAIN_SELECTOR && <ChainSelector />}
                {step === DepositStep.TOKEN_SELECTOR && <TokenSelector />}
                {step === DepositStep.AMOUNT_SELECTOR && <AmountSelector />}
                {step === DepositStep.REVIEW && <ReviewStep />}
                {[DepositStep.CONFIRM, DepositStep.PROCESSING].includes(
                  step,
                ) && <ConfirmStep />}
                {step === DepositStep.COMPLETE && <CompleteStep />}
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
