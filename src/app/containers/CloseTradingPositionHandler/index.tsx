/**
 *
 * CloseTradingPositionHandler
 *
 */

import React, { useEffect, useState } from 'react';
import { ActiveLoan } from '../../hooks/trading/useGetActiveLoans';
import { FormSelect } from '../../components/FormSelect';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useCloseWithSwap } from '../../hooks/protocol/useCloseWithSwap';
import { useAccount } from '../../hooks/useAccount';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import {
  assetByTokenAddress,
  symbolByTokenAddress,
} from '../../../utils/blockchain/contract-helpers';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { Dialog } from '../Dialog/Loadable';
import { DummyField } from '../../components/DummyField';
import { AmountField } from '../AmountField';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { Asset } from '../../../types/asset';
import { useTrading_testRates } from '../../hooks/trading/useTrading_testRates';
import { TradeButton } from '../../components/TradeButton';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useMaintenance } from '../../hooks/useMaintenance';

interface Props {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
}

const getOptions = (item: ActiveLoan) => {
  if (!item.collateralToken || !item.loanToken) {
    return [];
  }
  return [
    { key: true, label: symbolByTokenAddress(item.collateralToken) },
    { key: false, label: symbolByTokenAddress(item.loanToken) },
  ];
};

export function CloseTradingPositionHandler(props: Props) {
  const receiver = useAccount();

  const [amount, setAmount] = useState<string>();
  const [isCollateral, setIsCollateral] = useState(true);
  const [options, setOptions] = useState(getOptions(props.item));

  useEffect(() => {
    setAmount(weiTo18(props.item.collateral));
  }, [props.item.collateral]);

  useEffect(() => {
    setOptions(getOptions(props.item));
  }, [props.item]);

  const weiAmount = useWeiAmount(amount);

  const { send, ...rest } = useCloseWithSwap(
    props.item.loanId,
    receiver,
    weiAmount,
    isCollateral,
    '0x',
  );

  const handleConfirmSwap = () => {
    send();
  };

  const valid = useIsAmountWithinLimits(weiAmount, '1', props.item.collateral);

  const withdrawAll = amount === weiTo18(props.item.collateral);

  const { t } = useTranslation();
  const test = useTrading_testRates(
    assetByTokenAddress(
      isCollateral ? props.item.loanToken : props.item.collateralToken,
    ),
    assetByTokenAddress(
      isCollateral ? props.item.collateralToken : props.item.loanToken,
    ),
    weiAmount,
  );

  const { checkMaintenance } = useMaintenance();
  const closeTradesLocked = checkMaintenance('closeTradesSwaps');

  return (
    <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
      <div className="tw-container tw-mx-auto tw-px-4  tw-relative">
        <h4 className="tw-text-teal tw-text-center tw-mb-12 tw-uppercase">
          {!!props.item.loanId
            ? t(translations.closeTradingPositionHandler.title)
            : t(translations.closeTradingPositionHandler.titleDone)}
        </h4>

        {!!props.item.loanId && (
          <>
            <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-flex tw-flex-row tw-flex-nowrap tw-items-center">
              <div className="tw-col-span-4 tw-flex-grow-0 tw-text-muted">
                {t(translations.closeTradingPositionHandler.positionSize)}
              </div>
              <div className="tw-col-span tw-flex-grow">
                <DummyField>
                  <span className="tw-flex tw-w-full tw-flex-row tw-justify-between tw-items-center">
                    <span>{weiTo18(props.item.collateral)}</span>
                    <span className="tw-text-muted">
                      {symbolByTokenAddress(props.item.collateralToken)}
                    </span>
                  </span>
                </DummyField>
              </div>
            </div>

            <div className="tw-mt-4 tw-text-muted">
              {t(translations.closeTradingPositionHandler.withdrawIn)}
            </div>
            <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mt-1 tw-flex tw-flex-row tw-flex-nowrap tw-items-center">
              <div className="tw-col-span-4 tw-flex-grow-0">
                <FormSelect
                  filterable={false}
                  items={options}
                  onChange={item => setIsCollateral(item.key)}
                  value={isCollateral}
                />
              </div>
              <div className="tw-col-span tw-flex-grow tw-flex-shrink-0">
                <AmountField
                  value={amount || ''}
                  onChange={value => setAmount(value)}
                  onMaxClicked={() => setAmount(weiTo18(props.item.collateral))}
                />
              </div>
            </div>
          </>
        )}

        <SendTxProgress {...rest} displayAbsolute={false} />

        {!!props.item.loanId && (
          <div className="tw-mt-4 tw-flex tw-flex-row tw-justify-between">
            <AssetWalletBalance asset={Asset.RBTC} />
            <TradeButton
              text={
                withdrawAll
                  ? t(translations.closeTradingPositionHandler.closePosition)
                  : t(translations.closeTradingPositionHandler.closeAmount)
              }
              onClick={() => handleConfirmSwap()}
              disabled={
                rest.loading ||
                !valid ||
                closeTradesLocked?.maintenance_active ||
                test.diff > 5
              }
              loading={rest.loading}
              tooltip={
                closeTradesLocked?.maintenance_active ? (
                  closeTradesLocked?.message
                ) : test.diff > 5 ? (
                  <>
                    <p className="tw-mb-1">
                      {t(
                        translations.closeTradingPositionHandler.liquidity
                          .line_1,
                      )}
                    </p>
                    <p className="tw-mb-0">
                      {t(
                        translations.closeTradingPositionHandler.liquidity
                          .line_2,
                      )}
                    </p>
                  </>
                ) : undefined
              }
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}

CloseTradingPositionHandler.defaultProps = {
  item: {
    collateral: '0',
  },
};
