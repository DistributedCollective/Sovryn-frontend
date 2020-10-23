import React, { useState } from 'react';
import Header from './components/Header';
import { Container, Row } from 'react-bootstrap';
import CurrencyContainer from './components/CurrencyContainer';

import './assets/index.scss';
import CurrencyDetails from './components/CurrencyDetails';
import LendingHistory from './components/LendingHistory';

type Props = {};

const LendBorrowSovryn: React.FC<Props> = props => {
  const [key, setKey] = useState<'BTC' | 'DOC'>('BTC');

  return (
    <>
      <Header />
      <main className="container d-flex justify-content-between">
        <Row className="d-flex col-6">
          <CurrencyContainer state={key} setState={setKey} />
        </Row>
        <Row className="d-flex col-6 justify-content-center ">
          <CurrencyDetails currency={key} />
        </Row>
      </main>
      <Container className="d-flex justify-content-center">
        <LendingHistory />
      </Container>
    </>
  );
};

export default LendBorrowSovryn;
