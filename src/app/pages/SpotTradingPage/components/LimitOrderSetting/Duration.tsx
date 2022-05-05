import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import classNames from 'classnames';
import { FormGroup } from 'app/components/Form/FormGroup';

interface IDurationProps {
  value: number;
  onChange: (value: number) => void;
}

const trans = translations.spotTradingPage.limitOrderSetting;

export const durationOptions = [
  {
    text: trans.day_one,
    value: 1,
  },
  {
    text: trans.day_other,
    value: 3,
  },
  {
    text: trans.day_other,
    value: 7,
  },
  {
    text: trans.day_other,
    value: 30,
  },
  {
    text: trans.infinity,
    value: 0,
  },
];

export const Duration: React.FC<IDurationProps> = ({ onChange, value }) => {
  const { t } = useTranslation();
  return (
    <FormGroup className="tw-mt-8" label={t(trans.duration)}>
      <div className="tw-mt-1 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded-md tw-divide-x tw-divide-secondary">
        {durationOptions.map(option => (
          <DurationButton
            key={option.value}
            text={t(option.text, { count: option.value })}
            active={value === option.value}
            onClick={() => onChange(option.value)}
            value={option.value}
          />
        ))}
      </div>
    </FormGroup>
  );
};

interface IDurationButtonProps {
  text?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  value?: number;
}

const DurationButton: React.FC<IDurationButtonProps> = ({
  text,
  onClick,
  active,
  disabled,
  value,
}) => {
  const dataActionId = value === 0 ? 'max' : `${value}day`;
  return (
    <button
      onClick={onClick}
      className={classNames(
        'tw-h-8 tw-text-secondary tw-bg-secondary tw-font-medium tw-text-xs tw-leading-none tw-text-center tw-w-full tw-transition',
        {
          'tw-bg-opacity-50': active,
          'tw-bg-opacity-0': !active,
          'hover:tw-bg-opacity-25': !disabled && !active,
          'tw-text-opacity-25': disabled && !active,
        },
      )}
      data-action-id={`spot-limit-duration-${dataActionId}`}
    >
      {text}
    </button>
  );
};
