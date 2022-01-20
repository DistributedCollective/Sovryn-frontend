import React, { useContext, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { Asset, Chain } from 'types';
import {
  StepItem,
  Stepper,
} from 'app/pages/BridgeDepositPage/components/Stepper';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { toNumberFormat } from 'utils/display-text/format';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import ArrowBack from 'assets/images/genesis/arrow_back.svg';
import { prettyTx } from 'utils/helpers';

import walletIcon from 'assets/images/fast-btc/wallet-icon.svg';
import addressIcon from 'assets/images/fast-btc/address-icon.svg';
import successIcon from 'assets/images/fast-btc/success-icon.svg';
import { NetworkAwareComponentProps } from '../../types';

const stepOrder = [
  WithdrawStep.AMOUNT,
  WithdrawStep.ADDRESS,
  WithdrawStep.REVIEW,
  WithdrawStep.CONFIRM,
  WithdrawStep.PROCESSING,
  WithdrawStep.COMPLETED,
];

const isBehindStep = (current: WithdrawStep, needed: WithdrawStep) => {
  return stepOrder.indexOf(current) > stepOrder.indexOf(needed);
};

export const SidebarStepsWithdraw: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { t } = useTranslation();
  const { step, set, amount, address } = useContext(WithdrawContext);

  const initialSteps: StepItem[] = useMemo(
    () => [
      {
        stepTitle: t(translations.fastBtcPage.withdraw.sidebarSteps.amount),
        value: WithdrawStep.AMOUNT,
      },
      {
        stepTitle: t(translations.fastBtcPage.withdraw.sidebarSteps.address),
        value: WithdrawStep.ADDRESS,
      },
      {
        stepTitle: t(translations.fastBtcPage.withdraw.sidebarSteps.review),
        value: WithdrawStep.REVIEW,
      },
      {
        stepTitle: t(translations.fastBtcPage.withdraw.sidebarSteps.confirm),
        value: WithdrawStep.CONFIRM,
      },
      {
        stepTitle: t(translations.fastBtcPage.withdraw.sidebarSteps.processing),
        value: WithdrawStep.PROCESSING,
      },
      {
        stepTitle: t(translations.fastBtcPage.withdraw.sidebarSteps.completed),
        value: WithdrawStep.COMPLETED,
      },
    ],
    [t],
  );

  const steps = useMemo<StepItem[]>(() => {
    const previousSteps = [...initialSteps.map(item => ({ ...item }))];
    if (isBehindStep(step, WithdrawStep.AMOUNT) && amount) {
      const item = previousSteps.find(
        item => item.value === WithdrawStep.AMOUNT,
      );
      if (item) {
        item.title = (
          <>
            {toNumberFormat(amount, 8)}{' '}
            <AssetSymbolRenderer asset={Asset.RBTC} />
          </>
        );
        item.icon = (
          <img
            className="tw-object-contain tw-h-full tw-w-full tw-rounded-full"
            src={walletIcon}
            alt={amount}
          />
        );
      }
    }

    if (isBehindStep(step, WithdrawStep.ADDRESS) && address) {
      const item = previousSteps.find(
        item => item.value === WithdrawStep.ADDRESS,
      );
      if (item) {
        item.title = prettyTx(address);
        item.icon = (
          <img
            className={'tw-object-contain tw-h-full tw-w-full tw-rounded-full'}
            src={addressIcon}
            alt={address}
          />
        );
      }
    }

    if (step === WithdrawStep.PROCESSING) {
      const item = previousSteps.find(
        item => item.value === WithdrawStep.PROCESSING,
      );
      if (item) {
        item.title = t(
          translations.fastBtcPage.withdraw.sidebarSteps.processingProgress,
        );
      }
    }

    if (step === WithdrawStep.COMPLETED) {
      const item = previousSteps.find(
        item => item.value === WithdrawStep.COMPLETED,
      );
      if (item) {
        item.icon = (
          <img
            className={'tw-object-contain tw-h-full tw-w-full tw-rounded-full'}
            src={successIcon}
            alt="Completed"
          />
        );
      }
    }

    return previousSteps;
  }, [step, address, amount, t, initialSteps]);

  const canOpen = useCallback(
    (testStep: WithdrawStep) => {
      const indexOfTest = stepOrder.indexOf(testStep);
      const indexOfStep = stepOrder.indexOf(step);

      if (indexOfTest === -1 || indexOfStep === -1) {
        return false;
      }
      return (
        indexOfTest < indexOfStep &&
        // Can't go back if in confirm, processing or complete state.
        ![
          WithdrawStep.CONFIRM,
          WithdrawStep.PROCESSING,
          WithdrawStep.COMPLETED,
        ].includes(step)
      );
    },
    [step],
  );

  const changeStep = useCallback(
    (nextStep: WithdrawStep) => {
      if (canOpen(nextStep)) {
        set(prevState => ({ ...prevState, step: nextStep }));
      }
    },
    [canOpen, set],
  );

  const backToUrl = useMemo(
    () => (network === Chain.BSC ? '/perpetual' : '/wallet'),
    [network],
  );

  const backToTitle = useMemo(
    () =>
      network === Chain.BSC
        ? t(translations.fastBtcPage.backToPerpetuals)
        : t(translations.fastBtcPage.backToPortfolio),
    [network, t],
  );

  return (
    <>
      <Link
        to={backToUrl}
        className="tw-absolute tw--top-2 tw-left-0 tw-flex tw-items-center tw-font-semibold tw-text-2xl tw-cursor-pointer tw-select-none tw-text-white tw-whitespace-nowrap tw-no-underline"
      >
        <img
          alt="arrowback"
          src={ArrowBack}
          className="tw-w-4 tw-h-4 tw-mr-2"
        />
        {backToTitle}
      </Link>
      {step !== WithdrawStep.MAIN && (
        <div className="tw-mt-24">
          <Stepper steps={steps} step={step} onClick={changeStep} />
        </div>
      )}
    </>
  );
};
