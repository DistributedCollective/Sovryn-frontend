import React from 'react';
import { Col, Row } from 'react-bootstrap';
import '../../assets/index.scss';

type Props = {
  icon: string;
  title: string;
  lendApr: number;
  borrowApr: number;
};

const CurrencyRow: React.FC<Props> = ({ icon, title, lendApr, borrowApr }) => (
  <Row className="currency-container align-items-center">
    <Col className="d-flex currency">
      <img src={icon} alt="BTC Icon" />
      <h3> {title} </h3>
    </Col>
    <Col className="d-flex currency">
      <div>
        <span>lend APR:</span>
        <p>{lendApr}%</p>
      </div>
      <div>
        <span>Borrow APR:</span>
        <p>{borrowApr}%</p>
      </div>
    </Col>
  </Row>
);

export default CurrencyRow;
