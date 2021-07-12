import React from 'react';
import { Container } from 'react-bootstrap';

import CurrencyRow from './CurrencyRow';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { LendingPoolDictionary } from '../../../../../utils/dictionaries/lending-pool-dictionary';
import { useMaintenance } from 'app/hooks/useMaintenance';

const currencyRows = LendingPoolDictionary.list();

const CurrencyContainer: React.FC = () => {
  const lendAmount = '0';
  const weiLendAmount = useWeiAmount(lendAmount);

  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.DEPOSIT_LEND]: depositLendLocked,
    [States.WITHDRAW_LEND]: withdrawLendLocked,
  } = checkMaintenances();

  return (
    <Container className="tw-flex tw-flex-col tw-w-full tw-p-0">
      {currencyRows.map(info => {
        return (
          <CurrencyRow
            key={info.getAsset()}
            lendingPool={info}
            lendingAmount={info.getAsset() ? weiLendAmount : '0'}
            depositLocked={depositLendLocked}
            withdrawLocked={withdrawLendLocked}
          />
        );
      })}
    </Container>
  );
};

export default CurrencyContainer;
