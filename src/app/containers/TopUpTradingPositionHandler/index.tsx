/**
 *
 * TopUpTradingPositionHandler
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ActiveLoan } from '../../hooks/trading/useGetActiveLoans';
import { SendTxProgress } from '../../components/SendTxProgress';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { useApproveAndAddMargin } from '../../hooks/trading/useApproveAndAndMargin';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { Dialog } from '../Dialog/Loadable';
import { AmountField } from '../AmountField';
import { DummyField } from '../../components/DummyField';
import { FieldGroup } from '../../components/FieldGroup';
import { useCanInteract } from '../../hooks/useCanInteract';
import { maxMinusFee } from '../../../utils/helpers';
import { TradeButton } from '../../components/TradeButton';
import {
  disableNewTrades,
  disableNewTradesText,
} from '../../../utils/classifiers';

const s = translations.topUpTradingPositionHandler;

interface Props {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
}

export function TopUpTradingPositionHandler(props: Props) {
  const canInteract = useCanInteract();
  const tokenDetails = AssetsDictionary.getByTokenContractAddress(
    props.item?.collateralToken || '',
  );
  const [amount, setAmount] = useState('');
  const { value: balance } = useAssetBalanceOf(tokenDetails.asset);

  const weiAmount = useWeiAmount(amount);

  const { send, ...rest } = useApproveAndAddMargin(
    tokenDetails.asset,
    props.item.loanId,
    weiAmount,
  );

  const handleConfirm = () => {
    send();
  };

  const valid = useIsAmountWithinLimits(weiAmount, '1', balance);
  const { t } = useTranslation();

  return (
    <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
      <div className="container position-relative">
        <h4 className="text-teal text-center mb-5 text-uppercase">
          {t(s.title)}
        </h4>

        <div className="row mt-1 d-flex flex-row flex-nowrap align-items-center">
          <div className="col-4 col-lg-4 flex-grow-0">
            <FieldGroup label={t(s.currency)}>
              <DummyField>{tokenDetails.asset}</DummyField>
            </FieldGroup>
          </div>
          <div className="col flex-grow-1 flex-shrink-0">
            <FieldGroup label={t(s.topUpAmount)}>
              <AmountField
                value={amount || ''}
                onChange={value => setAmount(value)}
                onMaxClicked={() =>
                  setAmount(weiTo18(maxMinusFee(balance, tokenDetails.asset)))
                }
              />
            </FieldGroup>
          </div>
        </div>

        <SendTxProgress {...rest} displayAbsolute={false} />

        <div className="mt-4 d-flex flex-row justify-content-between">
          <AssetWalletBalance asset={tokenDetails.asset} />
          <TradeButton
            text={t(s.topUp)}
            hideIt={disableNewTrades}
            onClick={() => handleConfirm()}
            disabled={
              disableNewTrades || rest.loading || !valid || !canInteract
            }
            loading={rest.loading}
            tooltip={
              disableNewTrades ? (
                <div className="mw-tooltip">{disableNewTradesText}</div>
              ) : undefined
            }
          />
        </div>
      </div>
    </Dialog>
  );
}

TopUpTradingPositionHandler.defaultProps = {
  item: {},
};
