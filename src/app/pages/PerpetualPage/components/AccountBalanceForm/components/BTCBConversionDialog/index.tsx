import { AmountInput } from 'app/components/Form/AmountInput';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { useAccount } from 'app/hooks/useAccount';
import { useBridgeNetworkSendTx } from 'app/hooks/useBridgeNetworkSendTx';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { translations } from 'locales/i18n';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getContract } from 'utils/blockchain/contract-helpers';
import { fromWei, toWei } from 'utils/blockchain/math-helpers';
import { PERPETUAL_CHAIN } from '../../../../types';
import { useConvertToBTCS } from '../../hooks/useConvertToBTCS';
import styles from './index.module.scss';
import { Button } from 'app/components/Button';
import changeDirectionIcon from '../../../../../../../assets/images/swap_vertical.svg';
import { prettyTx } from 'utils/helpers';
import { Asset } from 'types';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { TxType } from 'store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';
import { bignumber } from 'mathjs';

type BTCBConversionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  BTCSBalance: string;
};

export const BTCBConversionDialog: React.FC<BTCBConversionDialogProps> = ({
  isOpen,
  onClose,
  BTCSBalance,
}) => {
  const account = useAccount();
  const { t } = useTranslation();

  const [weiBTCBBalance, setWeiBTCBBalance] = useState('0');
  const [BTCBBalance, setBTCBBalance] = useState('0');
  const [convertAmount, setConvertAmount] = useState('0');
  const weiConvertAmount = useWeiAmount(convertAmount);
  const [aggregatorWeiBalance, setAggregatorWeiBalance] = useState('0');
  const [aggregatorBalance, setAggregatorBalance] = useState('0');

  const [isConvertingFromBTCB, setIsConvertingFromBTCB] = useState(true);
  const willConversionFail = useMemo(
    () =>
      !isConvertingFromBTCB &&
      convertAmount !== '0' &&
      bignumber(weiConvertAmount).greaterThan(aggregatorWeiBalance),
    [
      aggregatorWeiBalance,
      convertAmount,
      isConvertingFromBTCB,
      weiConvertAmount,
    ],
  );

  const { send: convertToBTCS, ...transactionBTCS } = useConvertToBTCS();

  const { send: convertToBTCB, ...transactionBTCB } = useBridgeNetworkSendTx(
    PERPETUAL_CHAIN,
    'Masset_proxy',
    'redeem',
  );

  useEffect(() => setConvertAmount('0'), [BTCBBalance, BTCSBalance]);

  useEffect(() => {
    bridgeNetwork
      .call(
        PERPETUAL_CHAIN,
        getContract('BTCB_token').address,
        getContract('BTCB_token').abi,
        'balanceOf',
        [account.toLowerCase()],
      )
      .then(result => setWeiBTCBBalance(toWei(result.toString())))
      .catch(e => console.error(e));
  }, [account, BTCSBalance]);

  useEffect(() => {
    bridgeNetwork
      .call(
        PERPETUAL_CHAIN,
        getContract('BTCB_token').address,
        getContract('BTCB_token').abi,
        'balanceOf',
        [getContract('Masset_proxy').address],
      )
      .then(result => setAggregatorWeiBalance(result.toString()))
      .catch(e => console.error(e));
  }, [account, BTCSBalance]);

  useEffect(() => {
    setAggregatorBalance(Number(fromWei(aggregatorWeiBalance)).toFixed(6));
  }, [aggregatorWeiBalance]);

  useEffect(() => {
    setBTCBBalance(fromWei(weiBTCBBalance));
  }, [weiBTCBBalance]);

  const handleBTCBConversion = useCallback(
    () => convertToBTCS(weiConvertAmount),
    [convertToBTCS, weiConvertAmount],
  );

  const handleBTCSConversion = useCallback(
    () =>
      convertToBTCB([getContract('BTCB_token').address, weiConvertAmount], {
        from: account,
        gas: gasLimit[TxType.CONVERT_BTCB],
      }),
    [account, convertToBTCB, weiConvertAmount],
  );

  const onChangeDirection = useCallback(() => {
    setIsConvertingFromBTCB(!isConvertingFromBTCB);
    setConvertAmount('0');
  }, [isConvertingFromBTCB]);

  const sourceTitle = useMemo(
    () =>
      t(translations.perpetualPage.btcbConversionDialog.sourceTitle, {
        source: isConvertingFromBTCB
          ? prettyTx(account, 4, 6)
          : t(translations.perpetualPage.btcbConversionDialog.tradingAccount),
      }),
    [account, isConvertingFromBTCB, t],
  );

  const destinationTitle = useMemo(
    () =>
      t(translations.perpetualPage.btcbConversionDialog.destinationTitle, {
        destination: isConvertingFromBTCB
          ? t(translations.perpetualPage.btcbConversionDialog.tradingAccount)
          : prettyTx(account, 4, 6),
      }),
    [account, isConvertingFromBTCB, t],
  );

  const sourceBalance = useMemo(
    () => (isConvertingFromBTCB ? BTCBBalance : BTCSBalance),
    [BTCBBalance, BTCSBalance, isConvertingFromBTCB],
  );

  const destinationBalance = useMemo(
    () => (isConvertingFromBTCB ? BTCSBalance : BTCBBalance),
    [BTCBBalance, BTCSBalance, isConvertingFromBTCB],
  );

  const sourceAsset = useMemo(
    () => (isConvertingFromBTCB ? Asset.BTCB : Asset.BTCS),
    [isConvertingFromBTCB],
  );

  const destinationAsset = useMemo(
    () => (isConvertingFromBTCB ? Asset.BTCS : Asset.BTCB),
    [isConvertingFromBTCB],
  );

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose} className={styles.dialog}>
        <div className="tw-px-4 tw-flex tw-flex-col tw-items-center tw-justify-center">
          <div className="tw-px-5 tw-py-4 tw-bg-gray-3 tw-rounded-lg tw-w-full">
            <div className="tw-mb-7 tw-font-semibold">{sourceTitle}</div>
            <AmountInput
              value={convertAmount}
              maxAmount={isConvertingFromBTCB ? BTCBBalance : BTCSBalance}
              assetString={isConvertingFromBTCB ? 'BTCB' : 'BTCS'}
              decimalPrecision={6}
              onChange={setConvertAmount}
            />
            <div className="tw-text-sm tw-font-medium tw-mt-2.5">
              {t(translations.perpetualPage.btcbConversionDialog.balance)}{' '}
              <AssetValue
                value={sourceBalance}
                maxDecimals={8}
                mode={AssetValueMode.auto}
                asset={sourceAsset}
              />
            </div>
          </div>

          <div
            className="tw-cursor-pointer tw-w-11 tw-h-11 tw-rounded-full tw-border tw-border-solid tw-border-gray-6 tw-my-4 tw-flex tw-items-center tw-justify-center hover:tw-bg-gray-5"
            onClick={onChangeDirection}
          >
            <img src={changeDirectionIcon} alt="Change transfer direction" />
          </div>

          <div className="tw-px-5 tw-py-4 tw-bg-gray-3 tw-rounded-lg tw-mb-4 tw-w-full">
            <div className="tw-mb-2 tw-font-semibold">{destinationTitle}</div>
            <div className="tw-text-sm tw-font-medium">
              {t(translations.perpetualPage.btcbConversionDialog.balance)}{' '}
              <AssetValue
                value={destinationBalance}
                maxDecimals={8}
                mode={AssetValueMode.auto}
                asset={destinationAsset}
              />
            </div>
          </div>

          <div className="tw-h-16 tw-w-full">
            {willConversionFail ? (
              <span className="tw-text-xs tw-text-warning">
                {t(
                  translations.perpetualPage.btcbConversionDialog
                    .lowFundsWarning,
                  { aggregatorBalance: aggregatorBalance },
                )}
              </span>
            ) : (
              <></>
            )}
          </div>

          <div className="tw-text-center">
            <Button
              text={t(translations.perpetualPage.btcbConversionDialog.transfer)}
              onClick={
                isConvertingFromBTCB
                  ? handleBTCBConversion
                  : handleBTCSConversion
              }
              className={styles.cta}
            />
          </div>
        </div>
      </Dialog>
      {transactionBTCS && <TransactionDialog tx={transactionBTCS} />}
      {transactionBTCB && <TransactionDialog tx={transactionBTCB} />}
    </>
  );
};
