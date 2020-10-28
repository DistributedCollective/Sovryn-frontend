import React from 'react';
import { Col, Row } from 'react-bootstrap';
import '../../assets/index.scss';
import clsx from 'clsx';
import { AssetInterestRate } from '../../../../components/AssetInterestRate';
import { Asset } from '../../../../../types/asset';

type Props = {
  icon: string;
  title: string;
  lendApr: number;
  borrowApr: number;
  state: string;
  weiAmount: string;
  asset: Asset;
};

const CurrencyRow: React.FC<Props> = ({
  icon,
  title,
  state,
  weiAmount,
  asset,
}) => {
  return (
    <Row
      className={clsx(
        'currency-container',
        'align-items-center',
        state === title && 'selected-item',
      )}
    >
      <Col className="d-flex currency currency-title">
        <img src={icon} alt="BTC Icon" />
        <h3> {title} </h3>
      </Col>
      <Col className="d-flex currency">
        <div>
          <span>lend APR:</span>
          <AssetInterestRate asset={asset} weiAmount={weiAmount} />
        </div>
        <div>
          <span>Borrow APR:</span>
          <p>
            <span> ...</span>
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default CurrencyRow;
