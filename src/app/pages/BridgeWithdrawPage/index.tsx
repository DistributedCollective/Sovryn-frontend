import React, { useEffect, useLayoutEffect } from 'react';
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

import './styles.scss';
import { SidebarSteps } from './components/SidebarSteps';
import { CrossBridgeAsset } from '../BridgeDepositPage/types/cross-bridge-asset';
import { ReceiverSelector } from './components/ReceiverSelector';
import { useAccount } from '../../hooks/useAccount';
import { usePageActions } from 'app/containers/PageContainer';
import { CrossChainLayout } from 'app/components/CrossChain/CrossChainLayout';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

const dirtyWithdrawAssets = {
  [Asset.ETH]: CrossBridgeAsset.ETHS,
};

export const BridgeWithdrawPage: React.FC = () => {
  const page = usePageActions();
  const account = useAccount();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    page.updateOptions({
      headerProps: { address: account },
    });
  }, [account, page]);

  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bridgeWithdrawPageSaga });

  const { step, sourceAsset } = useSelector(selectBridgeWithdrawPage);
  const dispatch = useDispatch();
  const history = useHistory();

  const location = useLocation<any>();

  useEffect(() => {
    if (!location.state?.receiver || !location.state?.asset) {
      history.push('/portfolio');
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
    <CrossChainLayout
      title={t(translations.BridgeWithdrawPage.title, { asset: sourceAsset })}
      subtitle={t(translations.BridgeWithdrawPage.subtitle, {
        asset: sourceAsset,
      })}
    >
      <div
        style={{ minHeight: 610, width: 780, maxWidth: 'calc(100vw - 22rem)' }}
        className="tw-pb-4 tw-flex tw-flex-col tw-h-full tw-relative"
      >
        <div className="tw-px-10 tw-mt-10 tw-relative tw-z-50 tw-w-full tw-flex tw-items-start tw-justify-center">
          <SidebarSteps />
        </div>

        <div className="tw-flex-1 tw-px-4 tw-w-full tw-flex tw-flex-col tw-items-end md:tw-items-center tw-justify-around">
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
                  <ReceiverSelector address={account} />
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
        </div>
        {/* {sourceAsset === 'XUSD' && (
          <div className="tw-absolute tw-bottom-8 tw-left-0 tw-right-0 tw-mx-auto tw-flex tw-flex-col tw-items-center">
            <img className="tw-mb-1" src={babelfishIcon} alt="babelFish" />
            {t(translations.BridgeDepositPage.poweredBy)}
          </div>
        )} */}
      </div>
    </CrossChainLayout>
  );
};
