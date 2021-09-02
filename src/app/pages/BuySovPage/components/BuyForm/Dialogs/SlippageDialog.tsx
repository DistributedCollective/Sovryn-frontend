import React, { useState } from 'react';
import styled from 'styled-components/macro';
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
      <h2 className="tw-mb-10 tw-text-3xl tw-leading-tight tw-font-semibold tw-text-center tw-normal-case">
        {t(translations.buySovPage.slippageDialog.title)}
      </h2>

      <div className="tw-px-4">
        <FormGroup label={t(translations.buySovPage.slippageDialog.tolerance)}>
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
        <br />
        <FormGroup
          label={t(translations.buySovPage.slippageDialog.minimumReceived)}
        >
          <Dummy className="tw-flex tw-justify-between tw-items-center">
            <div>
              <LoadableValue
                value={<>{weiToNumberFormat(minReturn, 6)}</>}
                loading={false}
              />
            </div>
            <div>
              <AssetRenderer asset={props.asset || Asset.SOV} />
            </div>
          </Dummy>
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
    </Dialog>
  );
}

const Dummy = styled.div`
  border: 1px solid #575757;
  color: #e8e8e8;
  height: 48px;
  padding: 11px 21px;
  font-weight: 500;
  border-radius: 0.75rem;
  line-height: 1;
`;
