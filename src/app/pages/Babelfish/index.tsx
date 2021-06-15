/**
 *
 * Babelfish
 *
 */

import React, { useCallback, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import ethIcon from 'assets/images/tokens/eth.svg';

import ArrowBack from '../../../assets/images/genesis/arrow_back.svg';
import { Confirm } from './components/Confirm';
import { Review } from './components/Review';
import { SelectAmount } from './components/SelectAmount';
import { SelectNetwork } from './components/SelectNetwork';
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
  const [step, setStep] = useState(4);
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
      if (nextStep >= step) return;

      for (let i = step; i > nextStep - 1; i--) {
        updateStep(i - 1, null);
      }

      setStep(nextStep);
    },
    [step, updateStep],
  );
  return (
    <div
      className={`tw-flex tw-px-10 tw-h-full ${
        isBack ? 'ModalOpen' : 'ModalClosed'
      }`}
      style={{ minHeight: 'calc(100vh - 4.4rem)' }}
    >
      <div
        className="tw-absolute tw-flex tw-flex-row tw-justify-center tw-items-center"
        style={{ marginTop: '-3.5rem' }}
      >
        <img
          alt="arrowback"
          src={ArrowBack}
          onClick={() => {
            setBack(false);
            setTimeout(function () {
              onBack();
            }, 400);
          }}
          style={{ height: '20px', width: '20px', marginRight: '10px' }}
        />
        <span
          style={{
            fontSize: '24px',
            fontFamily: 'Montserrat',
            fontWeight: 700,
          }}
          onClick={() => {
            setBack(false);
            setTimeout(function () {
              onBack();
            }, 400);
          }}
        >
          {' '}
          Back
        </span>
      </div>
      <div
        className="tw-relative tw-h-full tw-flex tw-items-center tw-justify-center"
        style={{ minWidth: 300 }}
      >
        <Stepper steps={steps} step={step} onClick={handleStep} />
      </div>
      <div className="tw-relative tw-flex-1 tw-flex tw-flex-col tw-justify-around tw-items-center">
        <SwitchTransition>
          <CSSTransition
            key={step}
            addEndListener={(node, done) =>
              node.addEventListener('transitionend', done, false)
            }
            classNames="fade"
          >
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
            </>
          </CSSTransition>
        </SwitchTransition>
        <div></div>
        <div className="tw-absolute tw-bottom-10">Powered by babelFish</div>
      </div>
    </div>
  );
}
