import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'app/containers/Dialog';
import { translations } from 'locales/i18n';
import { Asset } from 'types/asset';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Slider } from 'app/components/Form/Slider';
import { DummyInput } from 'app/components/Form/Input';
import { fromWei } from 'utils/blockchain/math-helpers';
import { useSlippage } from '../useSlippage';
import styles from './dialog.module.scss';
import { ConfirmButton } from '../Button/confirm';
import { CloseButton } from '../Button/close';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  value: number;
  onChange: (value: number) => void;
  asset?: Asset;
}

export function SlippageDialog(props: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState(props.value);
  const { minReturn } = useSlippage(props.amount, value);

  const cancel = () => {
    setValue(props.value);
    props.onClose();
  };

  const confirm = () => {
    props.onChange(value);
    props.onClose();
  };

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      className={styles.dialog}
    >
      <button data-close="" onClick={() => props.onClose()}>
        <span className="tw-sr-only">Close Dialog</span>
      </button>

      <div className="tw-mw-340 tw-mx-auto">
        <div className="tw-mb-6 text-left">
          {t(translations.marginTradeForm.fields.advancedSettings)}
        </div>
        <div className="tw-text-sm tw-font-light tw-tracking-normal">
          <FormGroup
            className="tw-mt-8"
            label={t(translations.buySovPage.slippageDialog.tolerance)}
          >
            <Slider
              value={value}
              onChange={e => setValue(e)}
              min={0.1}
              max={1}
              stepSize={0.05}
              labelRenderer={value => <>{value}%</>}
              labelValues={[0.1, 0.25, 0.5, 0.75, 1]}
            />
          </FormGroup>

          <FormGroup
            label={t(translations.buySovPage.slippageDialog.minimumReceived)}
          >
            <DummyInput
              value={<>{fromWei(minReturn)}</>}
              appendElem={<AssetRenderer asset={props.asset || Asset.SOV} />}
              className="tw-h-10 tw-truncate"
            />
          </FormGroup>

          <div className="tw-flex tw-w-full tw-justify-between tw-items-center">
            <ConfirmButton
              text={t(translations.common.confirm)}
              onClick={() => confirm()}
              className="tw-mr-2"
            />
            <CloseButton
              text={t(translations.common.cancel)}
              onClick={() => cancel()}
              className="tw-ml-2"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
