import {
  AmountSelectorButton,
  AmountSelectorButtonPadding,
} from 'app/components/Form/AmountInput';
import { Input } from 'app/components/Input';
import React, { useCallback } from 'react';

type ExpiryDateInputProps = {
  value: string;
  onChange: (value: string) => void;
  step?: number;
};

const buttonValues = [1, 7, 30];

export const ExpiryDateInput: React.FC<ExpiryDateInputProps> = ({
  value,
  onChange,
  step = 1,
}) => {
  const onInputChange = useCallback(
    (value: string) => onChange(String(Math.floor(Number(value)))),
    [onChange],
  );

  return (
    <div className="tw-w-2/5">
      <Input
        value={value}
        onChange={onInputChange}
        step={step}
        type="number"
        min={0}
      />

      <div className="tw-mt-2.5 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded-md tw-divide-x tw-divide-secondary">
        {buttonValues.map(buttonValue => (
          <AmountSelectorButton
            key={buttonValue}
            text={String(buttonValue)}
            onClick={() => onChange(String(buttonValue))}
            padding={AmountSelectorButtonPadding.Small}
            appendText="D"
            dataActionId="perpetuals-expiryDate"
          />
        ))}
      </div>
    </div>
  );
};
