import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import cn from 'classnames';
import { FormGroup } from 'app/components/Form/FormGroup';

interface Props {
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

export function Duration({ onChange, value }: Props) {
  const { t } = useTranslation();

  return (
    <FormGroup className="tw-mt-8" label={t(trans.duration)}>
      <div className="tw-mt-1 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded-md tw-divide-x tw-divide-secondary">
        {durationOptions.map(option => (
          <DurationButton
            text={t(option.text, { count: option.value })}
            active={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </FormGroup>
  );
}

interface DurationButtonProps {
  text?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

export function DurationButton(props: DurationButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={cn(
        'tw-h-8 tw-text-secondary tw-bg-secondary tw-font-medium tw-text-xs tw-leading-none tw-text-center tw-w-full tw-transition',
        {
          'tw-bg-opacity-50': props.active,
          'tw-bg-opacity-0': !props.active,
          'hover:tw-bg-opacity-25': !props.disabled && !props.active,
          'tw-text-opacity-25': props.disabled && !props.active,
        },
      )}
    >
      {props.text}
    </button>
  );
}
