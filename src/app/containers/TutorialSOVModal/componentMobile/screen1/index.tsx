import React from 'react';
import screen1Container from 'assets/images/tutorial/mobile_bg_1.svg';
import close from 'assets/images/tutorial/close.svg';
import metamaskLogo from 'assets/images/tutorial/metamask.svg';
import rskLogo from 'assets/images/tutorial/rsk-wallet.svg';
import trustLogo from 'assets/images/tutorial/trust-wallet.svg';

export function Screen1(props) {
  const wallets = [
    {
      name: 'rWallet',
      logo: rskLogo,
      click: () => {
        alert('Deeplink');
      }, //Deeplink
    },
    {
      name: 'Metamask',
      logo: metamaskLogo,
      click: () => {
        props.changeWallet('Metamask');
        props.changeScreen(3);
      }, //Go to tutorial
    },
    {
      name: 'Trust',
      logo: trustLogo,
      click: () => {
        props.changeWallet('Trust');
        props.changeScreen(3);
      }, //Go to tutorial
    },
  ];

  const logos = wallets.map(item => (
    <div className="wallet-icon col-4" key={item.name} onClick={item.click}>
      <img src={item.logo} alt={item.name} />
      <p className="text-center">{item.name}</p>
    </div>
  ));

  return (
    <>
      <div className="position-absolute screen1">
        <img className="w-100 h-100" src={screen1Container} alt="" />
        <div className="title1 position-absolute">
          <p>Select YOUR WALLET</p>
        </div>
        <div className="close position-absolute" onClick={props.handleClose}>
          <img className="w-100 h-100" src={close} alt="close" />
        </div>
        <div className="logo-grid d-flex position-absolute">{logos}</div>
      </div>
    </>
  );
}
