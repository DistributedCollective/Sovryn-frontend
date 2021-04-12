import React from 'react';
import { useWalletContext } from '@sovryn/react-wallet';
import { currentChainId, networkNames } from '../../../utils/classifiers';
import WarningIcon from 'assets/images/new-tutorial/warning.png';
import LiquidityLogo from 'assets/images/new-tutorial/liquidity_logo.png';

interface Props {
  onChangeStep: (value: number) => any;
}

function ZeroStep({ onChangeStep }: Props) {
  const { wallet } = useWalletContext();

  const onClickHelp = () => {
    onChangeStep(1);
  };

  return (
    <div className="tutorial-step-origin">
      <div className="tw-flex tw-justify-center">
        <div className="tw-mr-3 tw-flex tw-items-center">
          <img src={WarningIcon} alt="warning" />
        </div>
        <div>
          <div>We detected that you are on {networkNames[wallet.chainId]}</div>
          <div>
            Please switch to {networkNames[currentChainId]} in your metamask
            wallet
          </div>
        </div>
      </div>
      <div className="tw-mt-14 tw-mx-auto tw-bg-gray-2 tw-border-4 tw-border-white tw-w-40 tw-h-40 tw-rounded-2xl">
        <div className="tw-flex tw-justify-center tw-my-8">
          <img src={LiquidityLogo} alt="liquidity-logo" />
        </div>
        <div className="tw-flex tw-justify-center tw-text-white tw--mt-3">
          Liquidity
        </div>
      </div>
      <div
        className="tw-mt-32 tw-mb-5 tw-flex tw-justify-center tw-text-gold tw-underline tw-cursor-pointer"
        onClick={onClickHelp}
      >
        How to connect to RSK Mainnet with Liquidity
      </div>
    </div>
  );
}

export { ZeroStep };
