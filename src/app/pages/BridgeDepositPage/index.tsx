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
import { WalletSelector } from './components/WalletSelector';
import { TokenSelector } from './components/TokenSelector';
import { AmountSelector } from './components/AmountSelector';
import { ReviewStep } from './components/ReviewStep';
import { ConfirmStep } from './components/ConfirmStep';
import { ReturnToPortfolio } from './components/ReturnToPortfolio';
import { Asset } from '../../../types';
import { CrossBridgeAsset } from './types/cross-bridge-asset';
import babelfishIcon from 'assets/images/tokens/babelfish.svg';

import './styles.scss';
import { SidebarSteps } from './components/SidebarSteps';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import UserWallet from './components/UserWallet';

const dirtyDepositAsset = {
  [Asset.ETH]: CrossBridgeAsset.ETHS,
};

export const BridgeDepositPage: React.FC = () => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bridgeDepositPageSaga });

  const {
    step,
    requestedReturnToPortfolio,
    targetAsset,
    receiver,
  } = useSelector(selectBridgeDepositPage);
  const { t } = useTranslation();
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
      <div
        className="tw-flex tw-flex-row tw-justify-between tw-items-start tw-w-full tw-p-5 tw-bg-gray-4 tw-relative"
        style={{ marginTop: '-4.4rem' }}
      >
        <UserWallet address={receiver} />
        <div
          className={classNames(
            'tw-relative tw-z-50 tw-h-full tw-flex tw-flex-col tw-items-start tw-justify-center tw-pl-8',
            { invisible: requestedReturnToPortfolio },
          )}
          style={{ minWidth: 200, minHeight: 'calc(100vh - 2.5rem)' }}
        >
          <SidebarSteps />
        </div>
        <div
          style={{
            minHeight: 'calc(100% - 2.5rem)',
            minWidth: 'calc(100% - 2.5rem)',
          }}
          className="tw-flex-1 tw-flex tw-flex-col tw-items-end md:tw-items-center tw-justify-around tw-absolute tw-pb-20"
        >
          <SwitchTransition>
            <CSSTransition
              key={step + (requestedReturnToPortfolio ? 1 : 0)}
              addEndListener={(node, done) =>
                node.addEventListener('transitionend', done, false)
              }
              classNames="fade"
            >
              <>
                {!requestedReturnToPortfolio && (
                  <>
                    {step === DepositStep.CHAIN_SELECTOR && <ChainSelector />}
                    {step === DepositStep.WALLET_SELECTOR && <WalletSelector />}
                    {step === DepositStep.TOKEN_SELECTOR && <TokenSelector />}
                    {step === DepositStep.AMOUNT_SELECTOR && <AmountSelector />}
                    {step === DepositStep.REVIEW && <ReviewStep />}
                    {[
                      DepositStep.CONFIRM,
                      DepositStep.PROCESSING,
                      DepositStep.COMPLETE,
                    ].includes(step) && <ConfirmStep />}
                  </>
                )}
                {requestedReturnToPortfolio && <ReturnToPortfolio />}
              </>
            </CSSTransition>
          </SwitchTransition>
        </div>
        {!requestedReturnToPortfolio && targetAsset === 'XUSD' && (
          <div className="tw-absolute tw-bottom-8 tw-left-0 tw-right-0 tw-mx-auto tw-flex tw-flex-col tw-items-center">
            <img className="tw-mb-1" src={babelfishIcon} alt="babelFish" />
            {t(translations.BridgeDepositPage.poweredBy)}
          </div>
        )}
      </div>
    </>
  );
};
