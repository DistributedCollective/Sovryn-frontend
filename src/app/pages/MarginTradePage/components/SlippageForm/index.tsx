import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import { Asset } from 'types/asset';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Slider } from 'app/components/Form/Slider';
import { DummyInput } from 'app/components/Form/Input';
import { fromWei } from 'utils/blockchain/math-helpers';
import { useSlippage } from './useSlippage';
import styles from './dialog.module.scss';
import { weiToNumberFormat } from 'utils/display-text/format';

interface Props {
  onClose: () => void;
  amount: string;
  value: number;
  onChange: (value: number) => void;
  asset?: Asset;
  isTrade?: boolean;
}

export function SlippageForm(props: Props) {
  const { t } = useTranslation();
  const { minReturn } = useSlippage(props.amount, props.value);

  return (
    <div className="tw-rounded-3xl tw-absolute tw-inset-0 tw-bg-black tw-p-4">
      <button
        data-action-id="margin-select-asset-slippage-tolerance-back-button"
        className={styles.buttonClose}
        onClick={props.onClose}
      />
      <div className="tw-mb-6 tw-text-center">
        {t(translations.marginTradeForm.fields.slippageSettings)}
      </div>
      <div className="tw-text-sm tw-font-light tw-tracking-normal">
        <FormGroup
          className="tw-mt-8"
          label={t(translations.buySovPage.slippageDialog.tolerance)}
        >
          <Slider
            value={props.value}
            onChange={e => props.onChange(e)}
            min={0.1}
            max={1}
            stepSize={0.1}
            labelRenderer={value => <>{value}%</>}
            labelValues={[0.1, 0.25, 0.5, 0.75, 1]}
            dataActionId="margin-slippage-tolerance-bar"
          />
        </FormGroup>

        {props.isTrade ? (
          <>
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.minEntry)}
              value={
                <>
                  {weiToNumberFormat(minReturn, 2)}{' '}
                  <AssetRenderer asset={props.asset || Asset.SOV} />
                </>
              }
              className="tw-mt-5"
              dataActionId="margin-reviewTransaction-minimumEntryPrice"
            />
          </>
        ) : (
          <FormGroup
            label={t(translations.buySovPage.slippageDialog.minimumReceived)}
            className="tw-form-group tw-mt-8 tw-mx-auto tw-mw-340"
          >
            <DummyInput
              value={<>{fromWei(minReturn)}</>}
              appendElem={<AssetRenderer asset={props.asset || Asset.SOV} />}
              className="tw-h-10 tw-truncate"
              data-action-id="margin-reviewTransaction-minimumEntryPrice"
            />
          </FormGroup>
        )}
      </div>
    </div>
  );
}

interface LabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  dataActionId?: string;
}

function LabelValuePair(props: LabelValuePairProps) {
  return (
    <div
      className={classNames(
        'tw-flex tw-text-xs tw-flex-row tw-flex-wrap tw-justify-between tw-space-x-4 tw-mb-3',
        props.className,
      )}
      data-action-id={props.dataActionId}
    >
      <div className="tw-truncate ">{props.label}</div>
      <div className="tw-truncate tw-text-right">{props.value}</div>
    </div>
  );
}
