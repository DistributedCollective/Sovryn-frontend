import React from 'react';
import { useTranslation } from 'react-i18next';

import { FormGroup } from 'app/components/Form/FormGroup';
import { Slider } from 'app/components/Form/Slider';

import { translations } from '../../../../../locales/i18n';
import { isMainnet } from '../../../../../utils/classifiers';

type SlippageFormProps = {
  slippage: number;
  onChange: (slippage: number) => void;
};

const SLIPPAGE_MIN = 0.001;
const SLIPPAGE_MAX = isMainnet ? 0.01 : 0.02;
const SLIPPAGE_STEP = 0.0005;
const SLIPPAGE_LABEL_COUNT = 5;
const SLIPPAGE_LABELS = Array(SLIPPAGE_LABEL_COUNT)
  .fill(0)
  .map((_, index) =>
    index === 0
      ? SLIPPAGE_MIN
      : (index / (SLIPPAGE_LABEL_COUNT - 1)) * SLIPPAGE_MAX,
  );

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
          className="tw-px-4"
          value={slippage}
          onChange={onChange}
          min={SLIPPAGE_MIN}
          max={SLIPPAGE_MAX}
          stepSize={SLIPPAGE_STEP}
          labelRenderer={value => `${value * 100}%`}
          labelValues={SLIPPAGE_LABELS}
        />
      </FormGroup>
    </div>
  );
};
