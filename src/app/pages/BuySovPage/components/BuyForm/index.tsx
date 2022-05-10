import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card } from '../Card';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { Asset } from 'types';
import classNames from 'classnames';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { maxMinusFee } from 'utils/helpers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { FieldGroup } from 'app/components/FieldGroup';
import { LoadableValue } from 'app/components/LoadableValue';
import { translations } from 'locales/i18n';
import { useSlippage } from './useSlippage';
import { weiToNumberFormat } from 'utils/display-text/format';
import { SlippageDialog } from './Dialogs/SlippageDialog';
import { bignumber } from 'mathjs';
import { BuyButton } from '../Button/buy';
import { ArrowDown } from '../ArrowStep/down';
import { Input } from '../Input';
import { AmountButton } from '../AmountButton';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite, gasLimit } from 'utils/classifiers';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { useSwapNetwork_conversionPath } from 'app/hooks/swap-network/useSwapNetwork_conversionPath';
import { useSwapNetwork_approveAndConvertByPath } from 'app/hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import styles from './index.module.scss';
import { TransactionDialog } from 'app/components/TransactionDialog';

const s = translations.swapTradeForm;

export function BuyForm() {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const swapsLocked = checkMaintenance(States.SWAP_TRADES);

  const connected = useCanInteract(true);
  const [openSlippage, setOpenSlippage] = useState(false);

  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const weiAmount = useWeiAmount(amount);

  const { value: balance } = useAssetBalanceOf(Asset.RBTC);

  const { value: rateByPath, loading } = useSwapsExternal_getSwapExpectedReturn(
    Asset.RBTC,
    Asset.SOV,
    weiAmount,
  );

  const { minReturn } = useSlippage(rateByPath, slippage);
  const { value: path } = useSwapNetwork_conversionPath(
    AssetsDictionary.get(Asset.RBTC).getTokenContractAddress(),
    AssetsDictionary.get(Asset.SOV).getTokenContractAddress(),
  );

  const { send, ...tx } = useSwapNetwork_approveAndConvertByPath(
    path,
    weiAmount,
    minReturn,
  );

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(minReturn).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(
        maxMinusFee(balance, Asset.RBTC, gasLimit.trade),
      )
    );
  }, [balance, minReturn, weiAmount]);

  const changeAmount = value => {
    if (value === 100) {
      setAmount(weiTo18(maxMinusFee(balance, Asset.RBTC, gasLimit.trade)));
    } else {
      setAmount(
        weiTo18(
          bignumber(balance)
            .mul(value / 100)
            .toFixed(0),
        ),
      );
    }
  };

  return (
    <>
      <Card
        step={3}
        title={
          <Trans
            i18nKey={translations.buySovPage.form.title}
            components={[<AssetRenderer asset={Asset.RBTC} />]}
          />
        }
        large
      >
        <div className="tw-px-0 lg:tw-px-8">
          <FieldGroup
            label={t(translations.buySovPage.form.enterAmount)}
            labelColor="#e8e8e8"
          >
            <Input
              value={amount}
              type="text"
              onChange={value => setAmount(value)}
              placeholder="0.0000"
              rightElement={<AssetRenderer asset={Asset.RBTC} />}
              dataActionId="buySov-amountInput-source"
            />
            <div className="tw-font-normal tw-my-2.5 tw-text-xs">
              <AvailableBalance
                asset={Asset.RBTC}
                dataActionId="buySov-label-availableBalance"
              />
            </div>
            <AmountButton onChange={changeAmount} dataActionId="buySov" />
          </FieldGroup>

          <ArrowDown />

          <FieldGroup label={t(s.fields.receive)} labelColor="#e8e8e8">
            <div className="tw-flex tw-justify-between tw-items-center tw-text-sov-white tw-leading-none tw-font-medium tw-border tw-border-gray-6 tw-rounded-lg tw-h-10 tw-py-2.5 tw-px-5">
              <div data-action-id="buySov-amountInput-receive">
                <LoadableValue
                  value={<>{weiToNumberFormat(rateByPath, 4)}</>}
                  loading={loading}
                />
              </div>
              <div>SOV</div>
            </div>
            <div className="tw-font-normal tw-my-2.5 tw-text-xs tw-flex tw-flex-row tw-justify-between tw-items-center">
              <div>
                {t(translations.buySovPage.form.minimumReceived)}{' '}
                <LoadableValue
                  loading={false}
                  value={weiToNumberFormat(minReturn, 4)}
                  tooltip={weiTo18(minReturn)}
                />{' '}
                SOV.
              </div>
              <button
                className={classNames(
                  'tw-border-0 tw-w-6 tw-h-6',
                  styles.slippageButton,
                )}
                onClick={() => setOpenSlippage(true)}
                data-action-id="buySov-slippageButton"
              >
                <span className="tw-sr-only">Slippage</span>
              </button>
            </div>
          </FieldGroup>

          {swapsLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.buySov}
                  components={[
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-text-warning tw-text-sm"
                    >
                      x
                    </a>,
                  ]}
                />
              }
            />
          )}

          {!swapsLocked && (
            <BuyButton
              disabled={tx.loading || !validate || !connected || swapsLocked}
              onClick={() => send()}
              text={t(translations.buySovPage.form.cta)}
              dataActionId="buySov-button-buy"
            />
          )}
        </div>
      </Card>

      <SlippageDialog
        isOpen={openSlippage}
        onClose={() => setOpenSlippage(false)}
        amount={rateByPath}
        value={slippage}
        onChange={value => setSlippage(value)}
        dataActionId="buySov-"
      />

      <TransactionDialog tx={tx} />
    </>
  );
}
