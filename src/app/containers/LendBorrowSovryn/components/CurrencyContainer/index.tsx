import React from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import '../../assets/index.scss';

import btcIcon from '../../assets/img/bitcoin.png';
import docIcon from '../../assets/img/icon.svg';
import CurrencyRow from './CurrencyRow';

type Props = {
  state: 'BTC' | 'DOC';
  setState: (key: 'BTC' | 'DOC') => void;
};

const currencyRows = [
  {
    icon: btcIcon,
    title: 'BTC',
    lendApr: 0.36,
    borrowApr: 2.03,
  },
  {
    icon: docIcon,
    title: 'DOC',
    lendApr: 5.16,
    borrowApr: 8.44,
  },
];

const CurrencyContainer: React.FC<Props> = ({ state, setState }) => {
  return (
    <Container className="d-flex flex-column w-100" style={{ padding: 0 }}>
      <Tab.Container id="left-tabs" defaultActiveKey={state}>
        <Nav
          onSelect={k => setState(k as 'BTC' | 'DOC')}
          className="d-flex flex-column currency-nav"
          variant="pills"
        >
          {currencyRows.map(info => {
            return (
              <Nav.Link eventKey={info.title}>
                <CurrencyRow {...info} state={state} />
              </Nav.Link>
            );
          })}
        </Nav>
      </Tab.Container>
    </Container>
  );
};

export default CurrencyContainer;
