import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'app/containers/Dialog';
import { translations } from 'locales/i18n';
import cn from 'classnames';
import { FormGroup } from 'app/components/Form/FormGroup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  value: number;
  onChange: (value: number) => void;
}

const trans = translations.spotTradingPage.limitOrderSetting;

const durationOptions = [
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
    text: trans.untilCancelled,
    value: 0,
  },
];

export function LimitOrderSetting({ onChange, value, onClose, isOpen }: Props) {
  const { t } = useTranslation();

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      <button data-close="" onClick={() => onClose()}>
        <span className="tw-sr-only">Close Dialog</span>
      </button>
      <h2 className="tw-mb-10 tw-text-3xl tw-leading-tight tw-font-semibold tw-text-center tw-normal-case">
        {t(trans.title)}
      </h2>

      <div className="tw-mw-340 tw-mx-auto">
        <FormGroup className="tw-mt-8" label={t(trans.duration)}>
          <div className="tw-h-8 tw-mt-1 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded-md tw-divide-x tw-divide-secondary">
            {durationOptions.map(option => (
              <DurationButton
                text={t(option.text, { count: option.value })}
                active={value === option.value}
                onClick={() => onChange(option.value)}
              />
            ))}
          </div>
        </FormGroup>

        <FormGroup className="tw-mt-8" label={t(trans.partialFilled)}>
          <div className="tw-h-8 tw-mt-1 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded-md tw-divide-x tw-divide-secondary">
            <DurationButton text={'Yes'} active={false} onClick={() => {}} />
            <DurationButton text={'No'} active={false} onClick={() => {}} />
          </div>
        </FormGroup>
      </div>
    </Dialog>
  );
}

interface DurationButtonProps {
  text?: string;
  onClick?: () => void;
  active?: boolean;
}

export function DurationButton(props: DurationButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={cn(
        'tw-h-8 tw-text-secondary tw-bg-secondary tw-font-medium tw-text-xs tw-leading-none tw-text-center tw-w-full tw-transition',
        {
          'tw-bg-opacity-50': props.active,
          'tw-bg-opacity-0 hover:tw-bg-opacity-25': !props.active,
        },
      )}
    >
      {props.text}
    </button>
  );
}
