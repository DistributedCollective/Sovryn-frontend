import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

import LendingContainer from '../../LendingContainer';
import BorrowingContainer from '../../BorrowingContainer';
import '../../assets/index.scss';

type Props = {
  currency: 'BTC' | 'DOC';
};

const CurrencyDetails: React.FC<Props> = ({ currency }) => {
  const [key, setKey] = useState<string | null>('lend');

  return (
    <div className="sovryn-tabs">
      <Tabs
        activeKey={key}
        onSelect={k => setKey(k as string)}
        defaultActiveKey="lend"
        id="borrow-&-lend-tabs"
      >
        <Tab eventKey="lend" title="LEND">
          <LendingContainer currency={currency} />
        </Tab>
        <Tab eventKey="borrow" title="BORROW">
          <BorrowingContainer currency={currency} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default CurrencyDetails;
