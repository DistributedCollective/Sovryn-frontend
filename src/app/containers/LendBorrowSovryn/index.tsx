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
    <Container fluid className="main-container">
      <Header />
      <Row className="d-flex justify-content-between flex-wrap">
        <Row className="d-flex col-lg-6 col-md-12">
          <CurrencyContainer state={key} setState={setKey} />
        </Row>
        <Row className="d-flex col-lg-6 justify-content-center col-md-12">
          <CurrencyDetails currency={key} />
        </Row>
      </Row>
      <Row className="d-flex col-12 ">
        <LendingHistory />
      </Row>
    </Container>
  );
};

export default LendBorrowSovryn;
