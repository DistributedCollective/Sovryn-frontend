import React, { useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { Card } from '../Card';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { Asset } from '../../../../../types/asset';
import { weiTo18 } from '../../../../../utils/blockchain/math-helpers';
import { maxMinusFee } from '../../../../../utils/helpers';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { FieldGroup } from '../../../../components/FieldGroup';
import { LoadableValue } from '../../../../components/LoadableValue';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { useSwapNetwork_conversionPath } from '../../../../hooks/swap-network/useSwapNetwork_conversionPath';
import { useSwapNetwork_rateByPath } from '../../../../hooks/swap-network/useSwapNetwork_rateByPath';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { useSlippage } from './useSlippage';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { SlippageDialog } from './Dialogs/SlippageDialog';
import { useSwapNetwork_approveAndConvertByPath } from '../../../../hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { TxDialog } from './Dialogs/TxDialog';
import { bignumber } from 'mathjs';
import { BuyButton } from '../Button/buy';
import { ArrowDown } from '../ArrowStep/down';
import slipImage from 'assets/images/settings-white.svg';
import { Input } from '../Input';
import { AmountButton } from '../AmountButton';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { AvailableBalance } from '../../../../components/AvailableBalance';

const s = translations.swapTradeForm;

const gasLimit = 340000;

export function BuyForm() {
  const { t } = useTranslation();
  const { checkMaintenance } = useMaintenance();
  const swapsLocked = checkMaintenance('openTradesSwaps');

  const connected = useCanInteract(true);
  const [openSlippage, setOpenSlippage] = useState(false);

  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const weiAmount = useWeiAmount(amount);

  const { value: balance } = useAssetBalanceOf(Asset.RBTC);

  const { value: path } = useSwapNetwork_conversionPath(
    tokenAddress(Asset.RBTC),
    tokenAddress(Asset.SOV),
  );

  const { value: rateByPath, loading } = useSwapNetwork_rateByPath(
    path,
    weiAmount,
  );

  const { minReturn } = useSlippage(rateByPath, slippage);

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
      <Card step={3} title={t(translations.buySovPage.form.title)} large>
        <div className="px-0 px-lg-4">
          <FieldGroup
            label={t(translations.buySovPage.form.enterAmount)}
            labelColor="#E9EAE9"
          >
            <Input
              value={amount}
              type="text"
              onChange={value => setAmount(value)}
              placeholder="0.0000"
              rightElement="rBTC"
            />
            <Slippage>
              <AvailableBalance asset={Asset.RBTC} />
            </Slippage>
            <AmountButton onChange={changeAmount} />
          </FieldGroup>

          <ArrowDown />

          <FieldGroup label={t(s.fields.receive)} labelColor="#E9EAE9">
            <Dummy className="d-flex justify-content-between align-items-center">
              <div>
                <LoadableValue
                  value={<>{weiToNumberFormat(rateByPath, 4)}</>}
                  loading={loading}
                />
              </div>
              <div>SOV</div>
            </Dummy>
            <Slippage className="d-flex flex-row justify-content-between align-items-center">
              <div>
                {t(translations.buySovPage.form.minimumReceived)}{' '}
                <LoadableValue
                  loading={false}
                  value={weiToNumberFormat(minReturn, 4)}
                  tooltip={weiTo18(minReturn)}
                />{' '}
                SOV.
              </div>
              <SlippageButton onClick={() => setOpenSlippage(true)}>
                <span className="sr-only">Slippage</span>
              </SlippageButton>
            </Slippage>
          </FieldGroup>

          {swapsLocked?.maintenance_active && <div>{swapsLocked?.message}</div>}

          <BuyButton
            disabled={tx.loading || !validate || !connected}
            onClick={() => send()}
            text={t(translations.buySovPage.form.cta)}
          />
        </div>
      </Card>

      <SlippageDialog
        isOpen={openSlippage}
        onClose={() => setOpenSlippage(false)}
        amount={rateByPath}
        value={slippage}
        onChange={value => setSlippage(value)}
      />

      <TxDialog tx={tx} />
    </>
  );
}

function tokenAddress(asset: Asset) {
  return AssetsDictionary.get(asset).getTokenContractAddress();
}

const Slippage = styled.div`
  font-size: 12px;
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
  color: #e9eae9;
  height: 40px;
  padding: 11px 21px;
  font-weight: 500;
  border-radius: 10px;
  line-height: 1;
`;
