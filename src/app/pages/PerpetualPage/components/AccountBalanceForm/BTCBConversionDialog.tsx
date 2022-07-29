import { AmountInput } from 'app/components/Form/AmountInput';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { useAccount } from 'app/hooks/useAccount';
import { useBridgeNetworkSendTx } from 'app/hooks/useBridgeNetworkSendTx';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { translations } from 'locales/i18n';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getContract } from 'utils/blockchain/contract-helpers';
import { fromWei, toWei } from 'utils/blockchain/math-helpers';
import { PERPETUAL_CHAIN } from '../../types';
import { useConvertToBTCS } from './useConvertToBTCS';

type BTCBConversionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const BTCBConversionDialog: React.FC<BTCBConversionDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [weiBtcbBalance, setWeiBalance] = useState('0');
  const [btcbBalance, setBtcbBalance] = useState('0');
  const [convertAmount, setConvertAmount] = useState('0');
  const [weiConvertAmount, setWeiConvertAmount] = useState('0');
  const account = useAccount();

  const { send, ...transaction } = useConvertToBTCS();

  const { send: btcbSend, ...txData } = useBridgeNetworkSendTx(
    PERPETUAL_CHAIN,
    'Masset_proxy',
    'redeem',
  );

  useEffect(() => {
    bridgeNetwork
      .call(
        PERPETUAL_CHAIN,
        getContract('BTCB_token').address,
        getContract('BTCB_token').abi,
        'balanceOf',
        [account.toLowerCase()],
      )
      .then(result => setWeiBalance(toWei(result.toString())))
      .catch(e => console.error(e));
  }, [account]);

  useEffect(() => {
    setBtcbBalance(fromWei(weiBtcbBalance));
  }, [weiBtcbBalance]);

  useEffect(() => {
    setWeiConvertAmount(toWei(convertAmount));
  }, [convertAmount]);

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose}>
        <h1>{t(translations.perpetualPage.editMargin.title)}</h1>
        <div className="tw-mw-340 tw-mx-auto">
          <div className="tw-mb-4 tw-text-sm">
            <label>BTCB balance</label>
            <AmountInput
              value={convertAmount}
              maxAmount={btcbBalance}
              assetString="BTCB"
              decimalPrecision={6}
              onChange={setConvertAmount}
            />
            <button
              onClick={() => {
                send(weiConvertAmount);
              }}
            >
              Convert to BTCS
            </button>

            <button
              onClick={() => {
                btcbSend([getContract('BTCB_token').address, weiConvertAmount]);
              }}
            >
              Convert back to BTCB
            </button>
          </div>
        </div>
      </Dialog>
      {transaction && <TransactionDialog tx={transaction} />}
      {txData && <TransactionDialog tx={txData} />}
    </>
  );
};
