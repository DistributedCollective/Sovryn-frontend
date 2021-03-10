import React, { useState } from 'react';
import { Screen1 } from './screen1';
import { Screen2 } from './screen2';
import { Screen3 } from './screen3';

export function TutorialDialogMobileComponent(props) {
  const [screen, setScreen] = useState(1);
  const [wallet, setWallet] = useState('');

  return (
    <>
      <div className="wallet-tutorial-mobile_container tw-absolute tw-mx-auto">
        {screen === 1 && (
          <Screen1
            handleClose={props.handleClose}
            changeScreen={setScreen}
            changeWallet={setWallet}
          />
        )}
        {screen === 2 && <Screen2 handleClose={props.handleClose} />}
        {screen === 3 && (
          <Screen3 handleClose={props.handleClose} wallet={wallet} />
        )}
      </div>
    </>
  );
}
