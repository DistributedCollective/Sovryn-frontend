import React, { useState } from 'react';
import { Dialog } from '../../../../../containers/Dialog';
import { weiToNumberFormat } from '../../../../../../utils/display-text/format';
import { useSlippage } from '../useSlippage';
import styles from './dialog.module.scss';
import { ConfirmButton } from '../../Button/confirm';
import { CloseButton } from '../../Button/close';
import { LoadableValue } from '../../../../../components/LoadableValue';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';
import { Asset } from 'types/asset';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AssetRenderer } from '../../../../../components/AssetRenderer';
import { Slider } from '../../../../../components/Form/Slider';

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
  isOpen,
  onClose,
  amount,
  value,
  onChange,
  asset,
  dataActionId = '',
}) => {
  const { t } = useTranslation();
  const [slippageValue, setSlippageValue] = useState(value);
  const { minReturn } = useSlippage(amount, slippageValue);

  const cancel = () => {
    setSlippageValue(value);
    onClose();
  };

  const confirm = () => {
    onChange(slippageValue);
    onClose();
  };

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={isOpen}
      onClose={() => onClose()}
      className={styles.dialog}
    >
      <button
        data-close=""
        onClick={() => onClose()}
        data-action-id={`${dataActionId}slippageDialog-button-close`}
      >
        <span className="tw-sr-only">Close Dialog</span>
      </button>
      <h2 className="tw-mb-10 tw-text-3xl tw-leading-tight tw-font-semibold tw-text-center tw-normal-case">
        {t(translations.buySovPage.slippageDialog.title)}
      </h2>

      <div className="tw-px-4">
        <FormGroup label={t(translations.buySovPage.slippageDialog.tolerance)}>
          <Slider
            value={slippageValue}
            onChange={e => setSlippageValue(e)}
            min={0.1}
            max={1}
            stepSize={0.05}
            labelRenderer={value => <>{value}%</>}
            labelValues={[0.1, 0.25, 0.5, 0.75, 1]}
            dataActionId={`${dataActionId}slippageDialog-slider`}
          />
        </FormGroup>
        <br />
        <FormGroup
          label={t(translations.buySovPage.slippageDialog.minimumReceived)}
        >
          <div className={styles.dummy}>
            <div data-action-id={`${dataActionId}slippageDialog-input`}>
              <LoadableValue
                value={<>{weiToNumberFormat(minReturn, 6)}</>}
                loading={false}
              />
            </div>
            <div>
              <AssetRenderer asset={asset || Asset.SOV} />
            </div>
          </div>
        </FormGroup>

        <div className="tw-flex tw-w-full tw-justify-between tw-items-center">
          <ConfirmButton
            text={t(translations.common.confirm)}
            onClick={() => confirm()}
            className="tw-mr-2"
            dataActionId={`${dataActionId}slippageDialog-confirmButton`}
          />
          <CloseButton
            text={t(translations.common.cancel)}
            onClick={() => cancel()}
            className="tw-ml-2"
            dataActionId={`${dataActionId}slippageDialog-closeButton`}
          />
        </div>
      </div>
    </Dialog>
  );
};
