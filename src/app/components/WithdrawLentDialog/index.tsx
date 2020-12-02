/**
 *
 * WithdrawLentDialog
 *
 */

import React, { useEffect, useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { SendTxResponseInterface } from 'app/hooks/useSendContractTx';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { bignumber } from 'mathjs';
import { fromWei } from 'web3-utils';
import { SendTxProgress } from '../SendTxProgress';
import { CloseModalButton } from '../CloseModalButton';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { Asset } from '../../../types/asset';
import { weiToBigInt } from '../../../utils/blockchain/math-helpers';

interface Props {
  asset: Asset;
  isOpen: boolean;
  balance: string;
  amount: string;
  onChangeAmount: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  txState: Partial<SendTxResponseInterface> | null;
}

export function WithdrawLentDialog(props: Props) {
  const assetDetails = AssetsDictionary.get(props.asset);
  const fixedAmount = weiToBigInt(props.amount);
  const [isValid, setValid] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (fixedAmount) {
      setValid(
        bignumber(fixedAmount).greaterThan(0) &&
          bignumber(fixedAmount).lessThanOrEqualTo(props.balance),
      );
    }
  }, [props.balance, fixedAmount]);

  return (
    <Dialog
      isOpen={props.isOpen}
      autoFocus={true}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
      className="bg-secondary p-3 border border-Gold"
    >
      <div className="container position-relative p-3">
        <div className="" onClick={() => props.onClose()}>
          <CloseModalButton />
        </div>
        <div className="text-center">
          <img
            className="d-inline"
            src={assetDetails.logoSvg}
            alt={props.asset}
            style={{ height: '5rem' }}
          />
          <div className="text-Gold text-center mt-4 modal-title d-inline">
          {t(translations.withdrawLentDialog.withdraw)} {props.asset}
          </div>
        </div>
        <div className="row p-3 mt-3">
          <div className="col-md-5 col-sm-12 data-label">
          {t(translations.withdrawLentDialog.amount)}
          </div>
        </div>
        <div className="d-flex flex-row">
          <div className="flex-grow-1 data-container">
            <input
              // type="number"
              // step=".00000000000000001"
              className="d-inline-block w-100-input"
              value={fixedAmount}
              onChange={e => props.onChangeAmount(e.currentTarget.value)}
            />
          </div>
          <div className="data-container mr-2 d-flex align-items-center">
            {props.asset}
          </div>
          <button
            className="btn btn-TabGrey text-white btn-sm ml-2"
            onClick={() => props.onChangeAmount(fromWei(props.balance))}
          >
            MAX
          </button>
        </div>
        <div className="position-relative h-100 w-100">
          <SendTxProgress
            status={props.txState?.status}
            txHash={props.txState?.txHash}
            loading={props.txState?.loading}
            displayAbsolute={false}
            type={'withdraw'}
          />
          <div className="text-center">
            <div className="py-3">
              <button
                className="btn btn-Gold rounded text-white my-3"
                onClick={() => props.onConfirm()}
                disabled={props.txState?.loading || !isValid}
              >
                {t(translations.withdrawLentDialog.withdraw)} {props.asset}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
