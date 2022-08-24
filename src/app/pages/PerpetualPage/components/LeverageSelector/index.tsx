import React, { useCallback, useMemo, useState } from 'react';
import { ReactComponent as EditIcon } from 'assets/images/edit.svg';
import { Slider, SliderType } from 'app/components/Form/Slider';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Input } from '../../../../components/Input';
import { FormGroup } from '../../../../components/Form/FormGroup';
import classNames from 'classnames';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { roundToSmaller } from '../../../../../utils/blockchain/math-helpers';
import { Icon } from 'app/components/Icon';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const leverageStepDeviation = 0.05;

type LeverageSelectorProps = {
  className?: string;
  value: number;
  min: number;
  max: number;
  steps: number[];
  onChange: (value: number) => void;
  disabled?: boolean;
  tooltip?: string;
};

export const LeverageSelector: React.FC<LeverageSelectorProps> = ({
  className,
  value,
  min,
  max,
  steps: unfilteredSteps,
  onChange,
  disabled = false,
  tooltip,
}) => {
  const { t } = useTranslation();
  const [manual, setManual] = useState(false);

  const steps = useMemo(() => {
    const steps = unfilteredSteps.filter(
      step =>
        step - leverageStepDeviation >= min &&
        step + leverageStepDeviation <= max,
    );
    if (unfilteredSteps[0] < min && steps[0] !== min) {
      steps.unshift(min);
    }
    if (steps[steps.length - 1] !== max) {
      steps.push(max);
    }
    return steps;
  }, [min, max, unfilteredSteps]);

  const onEnableManual = useCallback(() => {
    setManual(true);
    onChange(Number(roundToSmaller(value, 2)));
  }, [value, onChange]);

  const onEnableManualMinimum = useCallback(() => {
    setManual(true);
    onChange(min);
  }, [onChange, min]);

  const onDisableManual = useCallback(() => {
    setManual(false);

    const nearestStepValue = steps.reduce((nearest, step) => {
      const currentDifference = Math.abs(nearest - value);
      const stepDifference = Math.abs(step - value);
      return stepDifference <= currentDifference ? step : nearest;
    }, steps[0]);

    if (nearestStepValue !== value) {
      onChange(nearestStepValue);
    }
  }, [onChange, steps, value]);

  const sliderValue = useMemo(() => steps.indexOf(value), [value, steps]);

  const onSliderChange = useCallback(value => onChange(steps[value]), [
    steps,
    onChange,
  ]);

  const onInputChange = useCallback(
    (amount: string) => onChange(Number(amount)),
    [onChange],
  );

  const onInputBlur = useCallback(() => {
    let numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue < min) {
      numberValue = min;
    } else if (numberValue > max) {
      numberValue = max;
    }

    onChange(Number(roundToSmaller(numberValue, 2)));
  }, [value, min, max, onChange]);

  return (
    <div className="tw-relative">
      {disabled && (
        <div className="tw-absolute tw-rounded-lg tw-w-full tw-h-full tw-opacity-80 tw-bg-gray-4 tw-z-10" />
      )}
      <FormGroup
        label={t(translations.perpetualPage.tradeForm.labels.leverageSelector)}
        className={classNames(
          'tw-p-4 tw-pb-px tw-bg-gray-4 tw-rounded-lg',
          className,
        )}
        labelTooltip={tooltip}
      >
        <div className="tw-flex tw-flex-row tw-items-start tw-justify-between tw-h-12">
          {manual || sliderValue < 0 ? (
            <div className="tw-flex tw-items-center tw-justify-center tw-w-full">
              <button
                className="tw-w-1/6 tw-p-1"
                onClick={onDisableManual}
                data-action-id="perps-leverageSelector-closeButton"
              >
                <Icon icon={faXmark} size="lg" />
              </button>
              <Input
                className="tw-w-2/3 tw-mx-4 tw-text-center"
                type="number"
                value={value}
                min={min}
                max={max}
                step={0.01}
                onBlur={onInputBlur}
                onChangeText={onInputChange}
                dataActionId="perps-leverageSelector-manualInput"
              />
              <span className="tw-w-1/6" />
            </div>
          ) : (
            <>
              <button
                className="tw-w-1/6 tw-text-sm tw-text-secondary tw-font-semibold"
                onClick={onEnableManualMinimum}
              >
                {t(translations.perpetualPage.tradeForm.buttons.minLeverage)}
              </button>
              <Slider
                className="tw-mx-4"
                value={sliderValue}
                onChange={onSliderChange}
                min={0}
                max={steps.length - 1}
                stepSize={1}
                labelRenderer={value =>
                  `${toNumberFormat(steps[value], 1, 0)}x`
                }
                type={SliderType.gradient}
              />
              {!disabled && (
                <button
                  className="tw-text-secondary"
                  onClick={onEnableManual}
                  data-action-id="perps-leverageSelector-manualButton"
                >
                  <EditIcon className="tw-h-5" />
                </button>
              )}
            </>
          )}
        </div>
      </FormGroup>
    </div>
  );
};
