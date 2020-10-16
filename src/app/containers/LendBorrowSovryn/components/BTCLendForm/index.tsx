import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import LendContainer from './LendContainer';

import '../../assets/index.scss';

type Props = {};

const BTCLendForm: React.FC<Props> = props => {
  const [key, setKey] = useState<string | null>('lend');

  return (
    <div>
      <Tabs
        className="tabs"
        activeKey={key}
        onSelect={k => setKey(k as string)}
        defaultActiveKey="lend"
        id="borrow-&-lend-tabs"
      >
        <Tab eventKey="lend" title="LEND" />
        <Tab eventKey="borrow" title="BORROW" />
      </Tabs>
      {key === 'lend' && <LendContainer />}
    </div>
  );
};

export default BTCLendForm;
