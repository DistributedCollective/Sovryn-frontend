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

const pairs: Options<TradingPairType> = TradingPairDictionary.entries().map(
  ([type, item]) => ({ key: type, label: item.getName() }),
);

export function TradeForm() {
  const { t } = useTranslation();
  const [value, setValue] = useState<TradingPairType>(TradingPairType.BTC_USDT);

  const change = e => {
    console.log(e);
    setValue(e);
  };

  return (
    <div className="bg-black rounded px-4 py-3">
      <FieldGroup label={t(translations.marginTradePage.tradeForm.labels.pair)}>
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
        d
      </FieldGroup>
      <div>Available balance: 0000000</div>
      <FieldGroup
        label={t(translations.marginTradePage.tradeForm.labels.leverage)}
      >
        lev
      </FieldGroup>
    </div>
  );
}
