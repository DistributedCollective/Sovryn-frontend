import React from 'react';
import { Container } from 'react-bootstrap';
import '../../assets/index.scss';

import btcIcon from '../../assets/img/bitcoin.svg';
import docIcon from '../../assets/img/icon.svg';
import CurrencyRow from './CurrencyRow';

type Props = {};

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

const CurrencyContainer: React.FC<Props> = props => {
  return (
    <Container fluid className="d-flex flex-column w-100 mt-5">
      {currencyRows.map(info => (
        <CurrencyRow {...info} />
      ))}
    </Container>
  );
};

export default CurrencyContainer;
