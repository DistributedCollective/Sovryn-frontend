/**
 *
 * Babelfish
 *
 */

import React, { useCallback, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import ethIcon from 'assets/images/tokens/eth.svg';
import { SelectNetwork } from './components/SelectNetwork';
import { Processing } from './components/Processing';
import { Review } from './components/Review';
import { ReturnRSK } from './components/ReturnRSK';

import ArrowBack from '../../../assets/images/genesis/arrow_back.svg';
import { Confirm } from './components/Confirm';
import { SelectAmount } from './components/SelectAmount';
import { SelectToken } from './components/SelectToken';
import { StepItem, Stepper } from './components/Stepper';

import './styles.scss';

const initialSteps = [
  'Network',
  'Token',
  'Amount',
  'Review',
  'Confirm',
  'Processing',
  'Complete',
];

interface BabelFishProps {
  isOpen: boolean;
  onBack: () => void;
}
export function Babelfish({ isOpen, onBack }: BabelFishProps) {
  const [finalStep, setFinalStep] = useState(false);
  const [step, setStep] = useState(1);
  const [steps, setSteps] = useState<StepItem[]>(
    initialSteps.map(title => ({ title })),
  );
  const [isBack, setBack] = useState(isOpen);
  const updateStep = useCallback(
    (index, value) => {
      const prvSteps = [...steps];
      prvSteps[index].value = value;

      setSteps(prvSteps);
    },
    [steps],
  );
  const setNetwork = (network: string) => {
    switch (network) {
      case 'ETH':
        updateStep(0, {
          title: 'Ethereum',
          icon: (
            <img
              className={
                'tw-object-contain tw-h-full tw-w-full tw-rounded-full tw-bg-white'
              }
              src={ethIcon}
              alt="ETH"
            />
          ),
        });
        break;
      case 'BSC':
        updateStep(0, {
          title: 'Binance Chain',
          icon: <img className={'tw-object-contain'} src={ethIcon} alt="BSC" />,
        });
        break;
    }
    setStep(2);
  };

  const handleStep = useCallback(
    nextStep => {
      if (nextStep >= step || step > 6 || finalStep) return;

      for (let i = step; i > nextStep - 1; i--) {
        updateStep(i - 1, null);
      }

      setStep(nextStep);
    },
    [step, updateStep, finalStep],
  );
  return (
    <div
      className={`tw-flex tw-px-10 tw-h-screen tw-w-full tw-fixed tw-top-0 ${
        isBack ? 'ModalOpen' : 'ModalClosed'
      }`}
    >
      <div
        onClick={() => {
          setBack(false);
          setTimeout(function () {
            onBack();
          }, 600);
        }}
        className="tw-z-10 tw-cursor-pointer tw-flex tw-items-center tw-absolute tw-top-10 tw-left-10 tw-text-lg tw-font-semibold"
      >
        <img
          alt="arrowback"
          src={ArrowBack}
          className="mr-3"
          style={{ height: '20px', width: '20px' }}
        />
        Back
      </div>
      <div
        className="tw-relative tw-h-full tw-flex tw-items-center tw-justify-start tw-pl-8"
        style={{ minWidth: 300 }}
      >
        <Stepper steps={steps} step={step} onClick={handleStep} />
      </div>
      <div className="tw-relative tw-flex-1 tw-flex tw-flex-col tw-justify-center tw-items-center">
        <SwitchTransition>
          <CSSTransition
            key={step}
            addEndListener={(node, done) =>
              node.addEventListener('transitionend', done, false)
            }
            classNames="fade"
          >
            <>
              {!finalStep && (
                <>
                  {step === 1 && <SelectNetwork setNetwork={setNetwork} />}
                  {step === 2 && (
                    <SelectToken
                      setToken={token => {
                        updateStep(1, token);
                        setStep(3);
                      }}
                    />
                  )}
                  {step === 3 && (
                    <SelectAmount
                      updateAmount={amount => {
                        updateStep(2, amount);
                        setStep(4);
                      }}
                    />
                  )}
                  {step === 4 && <Review nextStep={() => setStep(5)} />}
                  {step === 5 && <Confirm nextStep={() => setStep(6)} />}
                  {(step === 6 || step === 7) && (
                    <Processing
                      onConfirm={() => setStep(7)}
                      onClose={() => setFinalStep(true)}
                    />
                  )}
                </>
              )}
              {finalStep && <ReturnRSK />}
            </>
          </CSSTransition>
        </SwitchTransition>
        <div></div>
        <div className="tw-absolute tw-bottom-10">Powered by babelFish</div>
      </div>
    </div>
  );
}
