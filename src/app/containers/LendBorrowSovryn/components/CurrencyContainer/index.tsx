import React from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import '../../assets/index.scss';

import CurrencyRow from './CurrencyRow';
import { Asset } from '../../../../../types/asset';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { LendingPoolDictionary } from '../../../../../utils/dictionaries/lending-pool-dictionary';
import { selectLendBorrowSovryn } from '../../selectors';

type Props = {
  state: Asset;
  setState: (key: Asset) => void;
};

const currencyRows = LendingPoolDictionary.list();

const CurrencyContainer: React.FC<Props> = ({ state, setState }) => {
  const { borrowAmount, lendAmount } = useSelector(selectLendBorrowSovryn);
  const weiBorrowAmount = useWeiAmount(borrowAmount);
  const weiLendAmount = useWeiAmount(lendAmount);

  return (
    <Container className="tw-flex tw-flex-col tw-w-full tw-p-0">
      {currencyRows.map(info => {
        return (
          <CurrencyRow
            key={info.getAsset()}
            lendingPool={info}
            active={state === info.getAsset()}
            lendingAmount={state === info.getAsset() ? weiLendAmount : '0'}
            borrowAmount={state === info.getAsset() ? weiBorrowAmount : '0'}
          />
        );
      })}
    </Container>
  );
};

export default CurrencyContainer;
