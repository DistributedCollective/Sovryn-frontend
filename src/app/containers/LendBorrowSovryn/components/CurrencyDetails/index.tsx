import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import LendingContainer from '../../LendingContainer';
import BorrowingContainer from '../../BorrowingContainer';
import '../../assets/index.scss';
import { selectLendBorrowSovryn } from '../../selectors';
import { actions } from '../../slice';
import { TabType } from '../../types';

type Props = {};

const CurrencyDetails: React.FC<Props> = () => {
  const { tab, asset } = useSelector(selectLendBorrowSovryn);
  const dispatch = useDispatch();

  return (
    <div className="sovryn-tabs">
      <Tabs
        activeKey={tab}
        onSelect={k => dispatch(actions.changeTab((k as unknown) as TabType))}
        defaultActiveKey="lend"
        id="borrow-&-lend-tabs"
      >
        <Tab eventKey={TabType.LEND} title="LEND">
          <LendingContainer currency={asset} />
        </Tab>
        <Tab eventKey={TabType.BORROW} title="BORROW">
          <BorrowingContainer currency={asset} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default CurrencyDetails;
