import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { Dialog } from '../../../../../containers/Dialog';
import { InputField } from '../../../../../components/InputField';
import { weiToNumberFormat } from '../../../../../../utils/display-text/format';
import { FieldGroup } from '../../../../../components/FieldGroup';
import { useSlippage } from '../useSlippage';
import styles from './dialog.module.css';
import { ConfirmButton } from '../../Button/confirm';
import { CloseButton } from '../../Button/close';
import { LoadableValue } from '../../../../../components/LoadableValue';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  value: number;
  onChange: (value: number) => void;
}

export function SlippageDialog(props: Props) {
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
        <span className="sr-only">Close Dialog</span>
      </button>
      <h1>Adjust Slippage</h1>

      <div className="px-4">
        <FieldGroup label="Slippage Tolerance:" labelColor="#E9EAE9">
          <InputField
            onChange={e => setValue(Number(e.target.value))}
            value={String(value)}
          />
        </FieldGroup>

        <FieldGroup label="Minimum Received" labelColor="#E9EAE9">
          <Dummy className="d-flex justify-content-between align-items-center">
            <div>
              <LoadableValue
                value={<>{weiToNumberFormat(minReturn, 4)}</>}
                loading={false}
              />
            </div>
            <div>SOV</div>
          </Dummy>
        </FieldGroup>
      </div>

      <div className="d-flex w-100 justify-content-between align-items-center">
        <ConfirmButton
          text="Confirm"
          onClick={() => confirm()}
          className="mr-2"
        />
        <CloseButton text="Cancel" onClick={() => cancel()} className="ml-2" />
      </div>
    </Dialog>
  );
}

const Dummy = styled.div`
  border: 1px solid #575757;
  color: #e9eae9;
  height: 48px;
  padding: 11px 21px;
  font-weight: 500;
  border-radius: 10px;
  line-height: 1;
`;
