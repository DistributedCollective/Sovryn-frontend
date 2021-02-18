import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Select } from '../../../../components/Form/Select';
import { TradingPairDictionary, TradingPairType } from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { Option, Options } from '../../../../components/Form/Select/types';
import { Text } from '@blueprintjs/core';
import { Asset } from '../../../../../types/asset';
import { TradingPosition } from '../../../../../types/trading-position';
import { LeverageSelector } from '../LeverageSelector';
import { TradeButton } from '../../../../components/Form/TradeButton';
import { FormGroup } from '../../../../components/Form/FormGroup';
import { AmountInput } from '../../../../components/Form/AmountInput';
import { AssetWalletBalance } from '../../../../components/AssetWalletBalance';

const pairs: Options<TradingPairType> = TradingPairDictionary.entries().map(
  ([type, item]) => ({ key: type, label: item.getName() }),
);

export function TradeForm() {
  const { t } = useTranslation();
  const [value, setValue] = useState<TradingPairType>(TradingPairType.BTC_USDT);
  const [collateral, setCollateral] = useState<Asset>(Asset.BTC);
  const [position, setPosition] = useState<TradingPosition>(
    TradingPosition.LONG,
  );
  const [leverage, setLeverage] = useState<number>(2);
  const [amount, setAmount] = useState<string>('');

  const change = e => {
    console.log(e);
    setValue(e);
  };

  return (
    <div className="tw-trading-form-card tw-bg-black tw-rounded-lg tw-p-5">
      <div className="lg:tw-px-8">
        <FormGroup
          label={t(translations.marginTradePage.tradeForm.labels.pair)}
        >
          <Select
            value={value}
            options={pairs as any}
            onChange={change}
            valueRenderer={(item: Option) => (
              <Text ellipsize className="text-center">
                {item.label}
              </Text>
            )}
          />
        </FormGroup>
        <FormGroup
          label={t(translations.marginTradePage.tradeForm.labels.asset)}
        >
          {/*<Select value={collateral} onChange={} options={} />*/}
        </FormGroup>
        <div>Available balance: 0000000</div>
        <AssetWalletBalance asset={Asset.BTC} />
        <FormGroup
          label={t(translations.marginTradePage.tradeForm.labels.leverage)}
        >
          <LeverageSelector
            value={leverage}
            onChange={value => setLeverage(value)}
          />
        </FormGroup>

        <FormGroup
          label={t(translations.marginTradePage.tradeForm.labels.amount)}
        >
          <AmountInput
            value={amount}
            onChange={value => setAmount(value)}
            asset={Asset.BTC}
          />
        </FormGroup>
      </div>

      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mt-12">
        <TradeButton
          text={t(translations.marginTradePage.tradeForm.buttons.long)}
          position={TradingPosition.LONG}
        />
        <TradeButton
          text={t(translations.marginTradePage.tradeForm.buttons.short)}
          position={TradingPosition.SHORT}
        />
      </div>
    </div>
  );
}
