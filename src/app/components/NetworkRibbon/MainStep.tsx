import React from 'react';
import StepOneImg from 'assets/images/new-tutorial/step1.png';
import StepTwoImg from 'assets/images/new-tutorial/step2.png';
import StepThreeImg from 'assets/images/new-tutorial/step3.png';
import StepFourImg from 'assets/images/new-tutorial/step4.png';
import StepFiveImg from 'assets/images/new-tutorial/step5.png';
import ArrowBackIcon from 'assets/images/new-tutorial/arrow_left.png';
import ArrowNextIcon from 'assets/images/new-tutorial/arrow_right.png';
import CircleInactiveIcon from 'assets/images/new-tutorial/circle_inactive.png';
import CircleActiveIcon from 'assets/images/new-tutorial/circle_active.png';

interface StepProps {
  value: number;
  image: string;
  text: string;
}
interface Props {
  step: number;
  onChangeStep: (value: number) => any;
}

const steps: StepProps[] = [
  {
    value: 1,
    image: StepOneImg,
    text: 'Open up liquidity in your browser',
  },
  {
    value: 2,
    image: StepTwoImg,
    text: 'Go to dropdown',
  },
  {
    value: 3,
    image: StepThreeImg,
    text: 'Select settings',
  },
  {
    value: 4,
    image: StepFourImg,
    text: 'Go to network dropdown',
  },
  {
    value: 5,
    image: StepFiveImg,
    text: 'Select RSK',
  },
];

function MainStep({ step, onChangeStep }: Props) {
  return (
    <div className="tutorial-step-main tw-flex">
      <div className="tw-ml-24">
        <div className="tw-mr-3 tw-flex tw-justify-center tw-items-center tw-bg-white tw-p-10 tw-rounded-2xl tw-w-96 tw-h-96">
          <img src={steps[step - 1].image} alt={`step${step - 1}`} />
        </div>
        <div className="tw-flex tw-mt-4 tw-justify-center">
          <div className="tw-mx-1.5">
            <img
              className="tw-cursor-pointer"
              src={ArrowBackIcon}
              alt="back"
              onClick={() => onChangeStep(step - 1)}
            />
          </div>
          {steps.map((row: StepProps) => {
            return (
              <div
                key={row.value}
                className="tw-flex tw-items-center tw-mx-1.5"
              >
                <img
                  className="tw-cursor-pointer"
                  src={
                    step === row.value ? CircleActiveIcon : CircleInactiveIcon
                  }
                  alt="dot"
                  onClick={() => onChangeStep(row.value)}
                />
              </div>
            );
          })}
          <div className="tw-mx-1.5">
            <img
              className="tw-cursor-pointer"
              src={ArrowNextIcon}
              alt="next"
              onClick={() => onChangeStep(step + 1)}
            />
          </div>
        </div>
      </div>
      <div className="tw-flex tw-items-center">
        <div className="tw-ml-32">
          <div className="tw-font-semibold tw-text-2xl">Step {step}:</div>
          <div className="tw-font-semibold tw-text-base tw-mt-1">
            {steps[step - 1].text}
          </div>
        </div>
      </div>
    </div>
  );
}

export { MainStep };
