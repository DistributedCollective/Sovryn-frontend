import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import cn from 'classnames';
import { Dialog } from 'app/containers/Dialog';
import { weiToNumberFormat } from 'utils/display-text/format';
import { useSlippage } from '../useSlippage';
import styles from './dialog.module.scss';
import { Asset } from 'types/asset';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Slider } from 'app/components/Form/Slider';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  value: number;
  onChange: (value: number) => void;
  asset?: Asset;
  dataActionId?: String;
}

export function SlippageDialog(props: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState(props.value);
  const { minReturn } = useSlippage(props.amount, value);

  const handleChange = useCallback(
    (value: number) => {
      setValue(value);
      props.onChange(value);
    },
    [props],
  );

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      className={styles.dialog}
      data-action-id={props.dataActionId}
    >
      <button
        data-close=""
        onClick={() => props.onClose()}
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
              onChange={e => handleChange(e)}
              min={0.1}
              max={1}
              stepSize={0.05}
              labelRenderer={value => <>{value}%</>}
              labelValues={[0.1, 0.25, 0.5, 0.75, 1]}
              dataActionId="buySov-slippageDialog-slider"
            />

            <LabelValuePair
              label={t(translations.buySovPage.slippageDialog.minimumReceived)}
              value={
                <>
                  {weiToNumberFormat(minReturn, 4)}{' '}
                  <AssetRenderer asset={props.asset || Asset.SOV} />
                </>
              }
              className="tw-mt-5"
            />
          </FormGroup>
        </div>
      </div>
    </Dialog>
  );
}

interface LabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

function LabelValuePair(props: LabelValuePairProps) {
  return (
    <div
      className={cn(
        'tw-flex tw-text-xs tw-flex-row tw-flex-wrap tw-justify-between tw-space-x-4 tw-mb-3',
        props.className,
      )}
    >
      <div className="tw-truncate ">{props.label}</div>
      <div className="tw-truncate tw-text-right">{props.value}</div>
    </div>
  );
}
