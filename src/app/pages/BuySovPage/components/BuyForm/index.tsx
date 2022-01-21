import React, { useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { Card } from '../Card';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { Asset } from '../../../../../types';
import { weiTo18 } from '../../../../../utils/blockchain/math-helpers';
import { maxMinusFee } from '../../../../../utils/helpers';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { FieldGroup } from '../../../../components/FieldGroup';
import { LoadableValue } from '../../../../components/LoadableValue';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { useSlippage } from './useSlippage';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { SlippageDialog } from './Dialogs/SlippageDialog';
import { TxDialog } from './Dialogs/TxDialog';
import { bignumber } from 'mathjs';
import { BuyButton } from '../Button/buy';
import { ArrowDown } from '../ArrowStep/down';
import slipImage from 'assets/images/settings-white.svg';
import { Input } from '../Input';
import { AmountButton } from '../AmountButton';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { AvailableBalance } from '../../../../components/AvailableBalance';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { useSwapsExternal_getSwapExpectedReturn } from '../../../../hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { useSwapNetwork_conversionPath } from 'app/hooks/swap-network/useSwapNetwork_conversionPath';
import { useSwapNetwork_approveAndConvertByPath } from 'app/hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';

const s = translations.swapTradeForm;

const gasLimit = 340000;

export function BuyForm() {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const swapsLocked = checkMaintenance(States.SWAP_TRADES);

  const connected = useCanInteract(true);
  const [openSlippage, setOpenSlippage] = useState(false);

  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const weiAmount = useWeiAmount(amount);
  // const account = useAccount();

  const { value: balance } = useAssetBalanceOf(Asset.RBTC);

  const { value: rateByPath, loading } = useSwapsExternal_getSwapExpectedReturn(
    Asset.RBTC,
    Asset.SOV,
    weiAmount,
  );

  const { minReturn } = useSlippage(rateByPath, slippage);

  // const { send, ...tx } = useSwapsExternal_approveAndSwapExternal(
  //   Asset.RBTC,
  //   Asset.SOV,
  //   account,
  //   account,
  //   weiAmount,
  //   '0',
  //   minReturn,
  //   '0x',
  // );

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
        maxMinusFee(balance, Asset.RBTC, gasLimit),
      )
    );
  }, [balance, minReturn, weiAmount]);

  const changeAmount = value => {
    if (value === 100) {
      setAmount(weiTo18(maxMinusFee(balance, Asset.RBTC, gasLimit)));
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
            <Slippage>
              <AvailableBalance
                asset={Asset.RBTC}
                dataAttribute="buySov-label-availableBalance"
              />
            </Slippage>
            <AmountButton onChange={changeAmount} dataActionId="buySov" />
          </FieldGroup>

          <ArrowDown />

          <FieldGroup label={t(s.fields.receive)} labelColor="#e8e8e8">
            <Dummy className="tw-flex tw-justify-between tw-items-center">
              <div data-action-id="buySov-amountInput-receive">
                <LoadableValue
                  value={<>{weiToNumberFormat(rateByPath, 4)}</>}
                  loading={loading}
                />
              </div>
              <div>SOV</div>
            </Dummy>
            <Slippage className="tw-flex tw-flex-row tw-justify-between tw-items-center">
              <div>
                {t(translations.buySovPage.form.minimumReceived)}{' '}
                <LoadableValue
                  loading={false}
                  value={weiToNumberFormat(minReturn, 4)}
                  tooltip={weiTo18(minReturn)}
                />{' '}
                SOV.
              </div>
              <SlippageButton
                onClick={() => setOpenSlippage(true)}
                data-action-id="buySov-slippageButton"
              >
                <span className="tw-sr-only">Slippage</span>
              </SlippageButton>
            </Slippage>
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

      <TxDialog tx={tx} />
    </>
  );
}

const Slippage = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const SlippageButton = styled.button`
  border: 0;
  width: 24px;
  height: 24px;
  background: transparent url(${slipImage}) center center no-repeat;
  background-size: 18px 18px;
`;

const Dummy = styled.div`
  border: 1px solid #575757;
  color: #e8e8e8;
  height: 40px;
  padding: 11px 21px;
  font-weight: 500;
  border-radius: 0.75rem;
  line-height: 1;
`;
