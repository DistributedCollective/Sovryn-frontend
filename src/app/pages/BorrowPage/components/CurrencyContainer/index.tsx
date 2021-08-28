import React from 'react';
import { useSelector } from 'react-redux';

import CurrencyRow from './CurrencyRow';
import { Asset } from '../../../../../types/asset';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { LendingPoolDictionary } from '../../../../../utils/dictionaries/lending-pool-dictionary';
import { selectLendBorrowSovryn } from '../../selectors';

type Props = {
  state: Asset;
  setState: (key: Asset) => void;
};

const currencyRows = LendingPoolDictionary.list().filter(
  pool => pool.getBorrowCollateral().length > 0,
);

const CurrencyContainer: React.FC<Props> = ({ state, setState }) => {
  const { borrowAmount, lendAmount } = useSelector(selectLendBorrowSovryn);
  const weiBorrowAmount = useWeiAmount(borrowAmount);
  const weiLendAmount = useWeiAmount(lendAmount);
  return (
    <div className="tw-container tw-mx-auto tw-flex tw-flex-col tw-w-full tw-p-0">
      {currencyRows.map(info => {
        return (
          <CurrencyRow
            key={info.getAsset()}
            lendingPool={info}
            active={state === info.getAsset()}
            lendingAmount={state === info.getAsset() ? weiLendAmount : '0'}
            borrowAmount={state === info.getAsset() ? weiBorrowAmount : '0'}
            onClick={() => setState(info.getAsset())}
          />
        );
      })}
    </div>
  );
};

export default CurrencyContainer;
