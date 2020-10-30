import React, { useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import '../../assets/index.scss';

import btcIcon from 'assets/images/btc-logo.svg';
import docIcon from 'assets/images/dollar-sign.svg';
import CurrencyRow from './CurrencyRow';
import { Asset } from '../../../../../types/asset';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';

type Props = {
  state: 'BTC' | 'DOC';
  setState: (key: 'BTC' | 'DOC') => void;
};

const currencyRows = [
  {
    icon: btcIcon,
    title: 'BTC',
    lendApr: 0.36,
    borrowApr: 2.03,
  },
  {
    icon: docIcon,
    title: 'DOC',
    lendApr: 5.16,
    borrowApr: 8.44,
  },
];

const CurrencyContainer: React.FC<Props> = ({ state, setState }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [amount, setAmount] = useState<string>('');

  const getAsset = (asset: string) => {
    return asset === 'BTC' ? Asset.BTC : Asset.DOC;
  };
  const weiAmount = useWeiAmount(amount);

  return (
    <Container className="d-flex flex-column w-100 p-0">
      <Tab.Container id="left-tabs" defaultActiveKey={state}>
        <Nav
          onSelect={k => setState(k as 'BTC' | 'DOC')}
          className="d-flex flex-column currency-nav"
          variant="pills"
        >
          {currencyRows.map(info => {
            return (
              <Nav.Link
                key={info.title}
                eventKey={info.title}
                className="currency-row-link"
              >
                <CurrencyRow
                  {...info}
                  state={state}
                  weiAmount={weiAmount}
                  asset={getAsset(info.title)}
                />
              </Nav.Link>
            );
          })}
        </Nav>
      </Tab.Container>
    </Container>
  );
};

export default CurrencyContainer;
