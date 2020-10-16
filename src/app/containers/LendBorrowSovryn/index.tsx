import React from 'react';
import Header from './components/Header';
import { Container } from 'react-bootstrap';
import CurrencyContainer from './components/CurrencyContainer';

import './assets/index.scss';
import BTCLendForm from './components/BTCLendForm';

type Props = {};

const LendBorrowSovryn: React.FC<Props> = props => {
  return (
    <div className="main-container">
      <Header />
      <Container fluid className="d-flex w-100">
        <CurrencyContainer />
        <BTCLendForm />
      </Container>
    </div>
  );
};

export default LendBorrowSovryn;
