import React, { ChangeEvent, useEffect, useState } from 'react';

import clsx from 'clsx';
import { translations } from '../../../../../locales/i18n';
import { useTokenBalanceOf } from '../../../../hooks/useTokenBalanceOf';
import { TradingPairDictionary } from '../../../../../utils/trading-pair-dictionary';
import { useTranslation } from 'react-i18next';
import { TradingPosition } from '../../../../../types/trading-position';
import { useSelector } from 'react-redux';
import { selectTradingPage } from '../../../TradingPage/selectors';
import { weiTo18 } from '../../../../../utils/blockchain/math-helpers';
import '../../assets/index.scss';
import { FieldGroup } from '../../../../components/FieldGroup';
import { AmountField } from '../../../AmountField';
import ButtonGroup from '../ButtonGroup';

type Props = {
  amountName: string;
  amountValue: string;
  onChangeAmount: (e: string) => void;
  onMaxChange: () => void;

  currency: string;
  minValue?: number | string;
  maxValue?: number | string;
};

const Amount: React.FC<Props> = ({
  amountName,
  currency,
  minValue,
  maxValue,
  onChangeAmount,
  amountValue,
  onMaxChange,
}) => {
  return (
    <div className="d-flex flex-row justify-content-between mb-3">
      <div className="d-flex flex-grow-1 flex-column">
        <FieldGroup label={amountName}>
          <AmountField
            onChange={onChangeAmount}
            value={amountValue}
            onMaxClicked={() => onMaxChange()}
          />
        </FieldGroup>
      </div>
      {maxValue !== '0' && (
        <div className="d-flex flex-column min-max-btc p-3 align-items-center justify-content-center">
          <div>Max:</div>
          <div>
            <span className="text-muted">{currency}</span>{' '}
            <strong>{maxValue}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default Amount;
