import React from 'react';
import { weiTo4 } from 'utils/blockchain/math-helpers';

import { FieldGroup } from 'app/components/FieldGroup';
import { AmountField } from 'app/containers/AmountField';

import '../../assets/index.scss';

type Props = {
  amountName: string;
  amountValue: string;
  onChangeAmount: (e: string) => void;
  onMaxChange: () => void;

  currency: string;
  minValue?: number | string;
  maxValue?: number | string;
  loadingLimit?: boolean;
};

const Amount: React.FC<Props> = ({
  amountName,
  currency,
  minValue,
  maxValue,
  onChangeAmount,
  amountValue,
  onMaxChange,
  loadingLimit,
}) => {
  return (
    <div className="d-flex flex-row justify-content-between">
      <div className="d-flex flex-grow-1 flex-column">
        <FieldGroup
          label={
            <>
              {amountName}{' '}
              {maxValue !== '0' && !loadingLimit && (
                <span className="text-muted">
                  (Max: {weiTo4(maxValue)} {currency})
                </span>
              )}
            </>
          }
        >
          <AmountField
            onChange={onChangeAmount}
            value={amountValue}
            onMaxClicked={() => onMaxChange()}
          />
        </FieldGroup>
      </div>
    </div>
  );
};

export default Amount;
