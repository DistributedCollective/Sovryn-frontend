import React, { useState } from 'react';
import { Button, Nav, Tab, Tabs } from 'react-bootstrap';

import { Asset } from '../../../../../types/asset';
import LendingContainer from '../../LendingContainer';
import BorrowingContainer from '../../BorrowingContainer';
import '../../assets/index.scss';
import clsx from 'clsx';
import RepayingContainer from '../../RepayingContainer';

type Props = {
  currency: Asset;
};

const CurrencyDetails: React.FC<Props> = ({ currency }) => {
  const [key, setKey] = useState<string | null>('lend');
  const [borrowKey, setBorrowKey] = useState<'borrow' | 'repay'>('borrow');

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
          <div className="row">
            <Tab.Container id="button-group " defaultActiveKey={'borrow'}>
              <Nav
                onSelect={k => setBorrowKey(k as any)}
                className="deposit-button-group w-100"
                variant="pills"
              >
                <Nav.Link eventKey={'borrow'}>
                  <Button
                    variant="light"
                    size="lg"
                    className={clsx(
                      'button-deposit',
                      borrowKey !== 'borrow' && 'disabled',
                    )}
                  >
                    Borrow
                  </Button>
                </Nav.Link>
                <Nav.Link eventKey={'repay'}>
                  <Button
                    variant="light"
                    size="lg"
                    className={clsx(
                      'button-deposit',
                      borrowKey !== 'repay' && 'disabled',
                    )}
                  >
                    Repay
                  </Button>
                </Nav.Link>
              </Nav>
            </Tab.Container>
          </div>
          {borrowKey === 'borrow' && <BorrowingContainer currency={currency} />}
          {borrowKey === 'repay' && <RepayingContainer currency={currency} />}
        </Tab>
      </Tabs>
    </div>
  );
};

export default CurrencyDetails;
