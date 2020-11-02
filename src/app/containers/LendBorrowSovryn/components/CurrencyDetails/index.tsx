import React, { useState } from 'react';
import { Row, Tab, Tabs } from 'react-bootstrap';
import clsx from 'clsx';

import LendingContainer from '../../LendingContainer';
import BorrowingContainer from '../../BorrowingContainer';
import '../../assets/index.scss';
import { Asset } from '../../../../../types/asset';

type Props = {
  currency: Asset;
};

const CurrencyDetails: React.FC<Props> = ({ currency }) => {
  const [key, setKey] = useState<string | null>('lend');

  return (
    <Row className="w-100">
      <Tabs
        className={clsx('tabs', currency === Asset.DOC && 'tabs__green')}
        activeKey={key}
        onSelect={k => setKey(k as string)}
        defaultActiveKey="lend"
        id="borrow-&-lend-tabs"
      >
        <Tab eventKey="lend" title="LEND" />
        <Tab eventKey="borrow" title="BORROW" />
      </Tabs>
      {key === 'lend' && <LendingContainer currency={currency} />}
      {key === 'borrow' && <BorrowingContainer currency={currency} />}
    </Row>
  );
};

export default CurrencyDetails;
