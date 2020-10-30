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
import ButtonGroup from '../ButtonGroup';

type Props = {
  amountName: string;
  amountValue: string;
  onChangeAmount: (e: ChangeEvent<HTMLInputElement>) => void;
  onMaxChange: (max: string) => void;
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
  const { t } = useTranslation();

  const { tradingPair } = useSelector(selectTradingPage);
  const [position, setPosition] = useState(TradingPosition.LONG);

  const pair = TradingPairDictionary.get(tradingPair);
  const [collateral, setCollateral] = useState(
    pair.getCollateralForPosition(position)[0],
  );

  useEffect(() => {
    currency === 'BTC'
      ? setPosition(TradingPosition.LONG)
      : setPosition(TradingPosition.SHORT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  useEffect(() => {
    setCollateral(pair.getCollateralForPosition(position)[0]);
  }, [position, pair]);

  const { value: tokenBalance } = useTokenBalanceOf(collateral);

  return (
    <div
      className={clsx(
        'amount-container',
        currency === 'DOC' && 'amount-container__green',
      )}
    >
      <div className="d-flex flex-column ">
        <p> {amountName}</p>
        <div className="d-flex input-container">
          <div className="flex-grow-1 data-container">
            <input
              type="number"
              className="d-inline-block w-100-input"
              value={amountValue}
              placeholder="Enter amount"
              onChange={onChangeAmount}
            />
          </div>
          <div className=" mr-2 d-flex align-items-center">
            <button
              className="btn"
              type="button"
              onClick={() => onMaxChange(weiTo18(tokenBalance) as string)}
            >
              {t(translations.amountField.btn_max)}
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column min-max-btc">
        {maxValue !== '0' && maxValue !== '' && (
          <p>
            <span>Max:</span>
            {currency} <strong>{maxValue}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Amount;
