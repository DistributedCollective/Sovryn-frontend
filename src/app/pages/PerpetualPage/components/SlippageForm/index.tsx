import React from 'react';
import { useTranslation } from 'react-i18next';

import { FormGroup } from 'app/components/Form/FormGroup';
import { Slider } from 'app/components/Form/Slider';

import { translations } from '../../../../../locales/i18n';

type SlippageFormProps = {
  slippage: number;
  onChange: (slippage: number) => void;
};

export const SlippageForm: React.FC<SlippageFormProps> = ({
  slippage,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="tw-text-sm tw-font-light tw-tracking-normal">
      <FormGroup
        className="tw-mt-8"
        label={t(translations.buySovPage.slippageDialog.tolerance)}
      >
        <Slider
          value={slippage}
          onChange={onChange}
          min={0.1}
          max={1}
          stepSize={0.05}
          labelRenderer={value => <>{value}%</>}
          labelValues={[0.1, 0.25, 0.5, 0.75, 1]}
        />
      </FormGroup>
    </div>
  );
};
