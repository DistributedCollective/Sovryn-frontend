import React, { useState } from 'react';
import { Row, Tab, Tabs } from 'react-bootstrap';
import LendContainer from '../LendContainer';
import BorrowContainer from '../BorrowContainer';

import '../../assets/index.scss';
import clsx from 'clsx';

type Props = {
  currency: 'BTC' | 'DOC';
};

const CurrencyDetails: React.FC<Props> = ({ currency }) => {
  const [key, setKey] = useState<string | null>('lend');

  return (
    <Row className="w-100" style={{ margin: '0 11%' }}>
      <Tabs
        className={clsx('tabs', currency === 'DOC' && 'tabs__green')}
        activeKey={key}
        onSelect={k => setKey(k as string)}
        defaultActiveKey="lend"
        id="borrow-&-lend-tabs"
      >
        <Tab eventKey="lend" title="LEND" />
        <Tab eventKey="borrow" title="BORROW" />
      </Tabs>
      {key === 'lend' && (
        <LendContainer
          currency={currency}
          amountName="Deposit Amount"
          maxValue="119.8648"
          minValue="0.0100"
        />
      )}
      {key === 'borrow' && (
        <BorrowContainer
          currency={currency}
          amountName="Borrow Amount"
          minValue="0.0100"
          maxValue="119.8648"
        />
      )}
    </Row>
  );
};

export default CurrencyDetails;
