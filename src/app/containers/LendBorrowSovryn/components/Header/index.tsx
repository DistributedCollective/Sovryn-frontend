import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import '../../assets/index.scss';

import logo from '../../assets/img/logo-sovryn.svg';
import WalletProvider from '../WalletProvider';

type Props = {};

const Header: React.FC<Props> = props => {
  return (
    <Container className="d-flex justify-content-between w-100 h-10 align-items-center header mt-4">
      <Link className="nav-item" to="/trade">
        Trade
      </Link>
      <Link className="nav-item" to="/lend">
        Lend/Borrow
      </Link>
      <Link to="/" className="logo">
        <img src={logo} alt="logo" />
      </Link>
      <Link className="nav-item" to="/lend">
        stats
      </Link>
      <WalletProvider />
    </Container>
  );
};

export default Header;
