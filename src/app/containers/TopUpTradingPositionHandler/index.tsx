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
      <div className="tw-container tw-mx-auto tw-px-4 tw-relative">
        <h4 className="tw-text-teal tw-text-center tw-mb-12 tw-uppercase">
          {t(s.title)}
        </h4>

        <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mt-1 tw-flex tw-flex-row tw-flex-nowrap tw-items-center">
          <div className="tw-col-span-4 lg:tw-col-span-4 tw-flex-grow-0">
            <FieldGroup label={t(s.currency)}>
              <DummyField>{tokenDetails.asset}</DummyField>
            </FieldGroup>
          </div>
          <div className="tw-col-span tw-flex-grow tw-flex-shrink-0">
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

        <div className="tw-mt-6 tw-flex tw-flex-row tw-justify-between">
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
