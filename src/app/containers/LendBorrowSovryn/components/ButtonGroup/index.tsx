import React, { useState } from 'react';
import { Button, Nav, Tab } from 'react-bootstrap';
import '../../assets/index.scss';
import clsx from 'clsx';

type Props = {
  currency: string;
  rightButton: string;
  leftButton: string;
};

const ButtonGroup: React.FC<Props> = ({
  currency,
  leftButton,
  rightButton,
}) => {
  const [key, setKey] = useState(leftButton);

  console.log(key);

  return (
    <Tab.Container id="button-group " defaultActiveKey={leftButton}>
      <Nav
        onSelect={k => setKey(k as string)}
        className="deposit-button-group w-100"
        variant="pills"
      >
        <Nav.Link eventKey={leftButton}>
          <Button
            variant="light"
            size="lg"
            className={clsx(
              'button-deposit',
              key === rightButton && 'disabled',
            )}
          >
            {leftButton}
          </Button>
        </Nav.Link>
        <Nav.Link eventKey={rightButton}>
          <Button
            variant="light"
            size="lg"
            className={clsx('button-deposit', key === leftButton && 'disabled')}
          >
            {rightButton}
          </Button>
        </Nav.Link>
      </Nav>
      {key === 'Withdraw' && currency === 'BTC' && (
        <div className="withdraw-content">
          <div>
            <h4>Balance</h4>
            <p>
              BTC <strong>1.8930</strong>
            </p>
          </div>
          <div>
            <h4>Profit</h4>
            <p>
              BTC <strong>0.46218354</strong>
            </p>
          </div>
        </div>
      )}
    </Tab.Container>
  );
};

export default ButtonGroup;
