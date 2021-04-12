import React, { useState, useEffect } from 'react';
import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';
import { Dialog } from '../../containers/NewDialog/Loadable';
import { currentChainId } from '../../../utils/classifiers';
import { ZeroStep } from './ZeroStep';
import { MainStep } from './MainStep';
import ArrowBackIcon from 'assets/images/new-tutorial/arrow_left.png';

function NetworkRibbon() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const { connected, wallet } = useWalletContext();

  const updateShow = () => {
    setShow(
      connected &&
        web3Wallets.includes(wallet.providerType) &&
        wallet.chainId !== currentChainId,
    );
  };

  useEffect(() => {
    updateShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, wallet.chainId]);

  const handleClose = () => {
    setShow(false);
  };

  const changeStep = (value: number) => {
    if (value > 5) {
      setShow(false);
      return;
    }
    setStep(value);
  };

  return (
    <>
      <Dialog
        isOpen={show}
        onClose={handleClose}
        canOutsideClickClose={true}
        isCloseButtonShown={true}
        canEscapeKeyClose={false}
        className="tutorial-dialog tw-relative tw-w-full tw-max-w-5xl tw-border-0"
      >
        <div className="tutorial-dialog-header tw-flex tw-justify-between">
          <div className="tw-cursor-pointer">
            {step > 0 && (
              <img
                src={ArrowBackIcon}
                alt="back"
                onClick={() => changeStep(step - 1)}
              />
            )}
          </div>
          <div className="tw-font-semibold">Change to RSK Network</div>
          <div></div>
        </div>
        <div className="tutorial-dialog-content">
          {step === 0 && <ZeroStep onChangeStep={changeStep} />}
          {step > 0 && <MainStep onChangeStep={changeStep} step={step} />}
        </div>
      </Dialog>
    </>
  );
}

export { NetworkRibbon };
