import React, { useState } from 'react';
import { FieldGroup } from '../../../../components/FieldGroup';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Select } from '../../../../components/Form/Select';
import {
  TradingPairDictionary,
  TradingPairType,
} from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { Option, Options } from '../../../../components/Form/Select/types';
import { Text } from '@blueprintjs/core';
import { Asset } from '../../../../../types/asset';
import { TradingPosition } from '../../../../../types/trading-position';
import { LeverageSelector } from '../LeverageSelector';

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

  const change = e => {
    console.log(e);
    setValue(e);
  };

  return (
    <div className="bg-black rounded px-4 py-3">
      <div className="px-4">
        <FieldGroup
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
        </FieldGroup>
        <FieldGroup
          label={t(translations.marginTradePage.tradeForm.labels.asset)}
        >
          {/*<Select value={collateral} onChange={} options={} />*/}
        </FieldGroup>
        <div>Available balance: 0000000</div>
        <FieldGroup
          label={t(translations.marginTradePage.tradeForm.labels.leverage)}
        >
          <LeverageSelector
            value={leverage}
            onChange={value => setLeverage(value)}
          />
        </FieldGroup>
      </div>
    </div>
  );
}
