import React from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import '../../assets/index.scss';

import CurrencyRow from './CurrencyRow';
import { Asset } from '../../../../../types/asset';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { LendingPoolDictionary } from '../../../../../utils/lending-pool-dictionary';
import { useSelector } from 'react-redux';
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
    <Container className="d-flex flex-column w-100 p-0">
      <Tab.Container id="left-tabs" defaultActiveKey={state}>
        <Nav
          onSelect={k => setState(k as Asset)}
          className="d-flex flex-column currency-nav"
          variant="pills"
        >
          {currencyRows.map(info => {
            return (
              <Nav.Link
                key={info.getAsset()}
                eventKey={info.getAsset()}
                className="currency-row-link"
              >
                <CurrencyRow
                  lendingPool={info}
                  active={state === info.getAsset()}
                  lendingAmount={
                    state === info.getAsset() ? weiLendAmount : '0'
                  }
                  borrowAmount={
                    state === info.getAsset() ? weiBorrowAmount : '0'
                  }
                />
              </Nav.Link>
            );
          })}
        </Nav>
      </Tab.Container>
    </Container>
  );
};

export default CurrencyContainer;
