import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormGroup } from 'form/FormGroup';
import { translations } from '../../../locales/i18n';
import { Slider } from '../../pages/BuySovPage/components/Slider';

interface Props {
  value: number;
  onChange: (value: number) => void;
  labelClassName?: string;
}

export function SlippageSlider(props: Props) {
  const { t } = useTranslation();
  return (
    <FormGroup
      label={t(translations.buySovPage.slippageDialog.tolerance)}
      className={props.labelClassName}
    >
      <Slider
        value={props.value}
        onChange={e => props.onChange(e)}
        min={0.1}
        max={1}
        stepSize={0.05}
        labelRenderer={value => <>{value}%</>}
        labelValues={[0.1, 0.25, 0.5, 0.75, 1]}
      />
    </FormGroup>
  );
}

SlippageSlider.defaultProps = {
  labelClassName: 'tw-mt-5 tw-mb-12',
};
