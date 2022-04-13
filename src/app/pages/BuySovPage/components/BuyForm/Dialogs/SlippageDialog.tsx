import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import classNames from 'classnames';
import { Dialog } from 'app/containers/Dialog';
import { weiToNumberFormat } from 'utils/display-text/format';
import { useSlippage } from '../useSlippage';
import styles from './dialog.module.scss';
import { Asset } from 'types/asset';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Slider } from 'app/components/Form/Slider';
import { sliderDefaultLabelValues } from 'app/components/Form/Slider/sliderDefaultLabelValues';

interface ISlippageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  value: number;
  onChange: (value: number) => void;
  asset?: Asset;
  dataActionId?: string;
}

export const SlippageDialog: React.FC<ISlippageDialogProps> = ({
  amount,
  onClose,
  onChange,
  dataActionId,
  isOpen,
  asset,
  ...props
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(props.value);
  const { minReturn } = useSlippage(amount, value);

  const handleChange = useCallback(
    (value: number) => {
      setValue(value);
      onChange(value);
    },
    [onChange],
  );

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={isOpen}
      onClose={onClose}
      className={styles.dialog}
      data-action-id={dataActionId}
    >
      <button
        data-close=""
        onClick={onClose}
        data-action-id="buySov-slippageDialog-button-close"
      >
        <span className="tw-sr-only">Close Dialog</span>
      </button>

      <div className="tw-mw-340 tw-mx-auto">
        <div className="tw-mb-6 text-left">
          {t(translations.buySovPage.slippageDialog.title)}
        </div>

        <div className="tw-text-sm tw-font-light tw-tracking-normal">
          <FormGroup
            label={t(translations.buySovPage.slippageDialog.tolerance)}
          >
            <Slider
              value={value}
              onChange={handleChange}
              min={sliderDefaultLabelValues.min}
              max={sliderDefaultLabelValues.max}
              stepSize={sliderDefaultLabelValues.stepSize}
              labelValues={sliderDefaultLabelValues.labelValues}
              labelRenderer={value => <>{value}%</>}
              dataActionId="buySov-slippageDialog-slider"
            />

            <LabelValuePair
              label={t(translations.buySovPage.slippageDialog.minimumReceived)}
              value={
                <>
                  {weiToNumberFormat(minReturn, 4)}{' '}
                  <AssetRenderer asset={asset || Asset.SOV} />
                </>
              }
              className="tw-mt-5"
            />
          </FormGroup>
        </div>
      </div>
    </Dialog>
  );
};

interface ILabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

export const LabelValuePair: React.FC<ILabelValuePairProps> = ({
  className,
  label,
  value,
}) => (
  <div
    className={classNames(
      'tw-flex tw-text-xs tw-flex-row tw-flex-wrap tw-justify-between tw-space-x-4 tw-mb-3',
      className,
    )}
  >
    <div className="tw-truncate">{label}</div>
    <div className="tw-truncate tw-text-right">{value}</div>
  </div>
);
