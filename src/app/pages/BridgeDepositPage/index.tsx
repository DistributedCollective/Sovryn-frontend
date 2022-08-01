import React, { useEffect, useLayoutEffect } from 'react';
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

import './styles.scss';
import { SidebarSteps } from './components/SidebarSteps';
import classNames from 'classnames';
import { usePageActions } from 'app/containers/PageContainer';
import { CrossChainLayout } from 'app/components/CrossChain/CrossChainLayout';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useWalletContext } from '@sovryn/react-wallet';

const dirtyDepositAsset = {
  [Asset.ETH]: CrossBridgeAsset.ETHS,
};

export const BridgeDepositPage: React.FC = () => {
  const page = usePageActions();
  const { t } = useTranslation();

  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bridgeDepositPageSaga });
  const { setOptions } = useWalletContext();

  const {
    step,
    requestedReturnToPortfolio,
    receiver,
    targetAsset,
  } = useSelector(selectBridgeDepositPage);

  useLayoutEffect(() => {
    page.updateOptions({
      headerProps: { address: receiver },
    });
  }, [receiver, page]);

  const dispatch = useDispatch();
  const history = useHistory();

  const location = useLocation<any>();

  useEffect(() => {
    if (!location.state?.receiver || !location.state?.asset) {
      history.push('/portfolio');
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

  useEffect(() => {
    setOptions({
      viewType: 'gray',
      hideTitle: false,
      size: 'sm',
    });
    return () => {
      setOptions({
        viewType: 'default',
        hideTitle: false,
        size: 'md',
      });
    };
  }, [setOptions]);

  return (
    <CrossChainLayout
      title={t(translations.BridgeDepositPage.title, { asset: targetAsset })}
      subtitle={t(translations.BridgeDepositPage.subtitle, {
        asset: targetAsset,
      })}
    >
      <div
        style={{ minHeight: 510, width: 780, maxWidth: 'calc(100vw - 22rem)' }}
        className="tw-pb-4 tw-flex tw-flex-col tw-h-full tw-relative"
      >
        <div
          className={classNames(
            'tw-px-6 tw-mt-10 tw-relative tw-z-50 tw-w-full tw-flex tw-items-start tw-justify-center',
            { invisible: requestedReturnToPortfolio },
          )}
        >
          <SidebarSteps />
        </div>
        <div className="tw-flex-1 tw-px-4 tw-w-full tw-flex tw-flex-col tw-items-end md:tw-items-center tw-justify-around">
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
      </div>
    </CrossChainLayout>
  );
};
