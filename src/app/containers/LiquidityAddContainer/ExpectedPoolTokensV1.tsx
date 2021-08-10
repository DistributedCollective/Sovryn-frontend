import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@blueprintjs/core';
import { LoadableValue } from '../../components/LoadableValue';
import { weiTo4, weiTo18, toWei } from '../../../utils/blockchain/math-helpers';
import { translations } from '../../../locales/i18n';
import { LiquidityPool } from '../../../utils/models/liquidity-pool';
import { bignumber } from 'mathjs';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import {
  getAmmContractName,
  getTokenContract,
} from '../../../utils/blockchain/contract-helpers';
import { Asset } from '../../../types/asset';

interface Props {
  pool: LiquidityPool;
  amounts: { [key: string]: string };
}

export function ExpectedPoolTokensV1({ pool, amounts }: Props) {
  const { t } = useTranslation();
  const [expectedPoolTokens, setExpected] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      let amount = bignumber('0');

      for (let asset in amounts) {
        if (amounts.hasOwnProperty(asset)) {
          try {
            const result = await contractReader.call(
              getAmmContractName(pool.getAsset()),
              'targetAmountAndFee',
              [
                getTokenContract(asset as Asset).address,
                pool.getSupplyAssets()[0].getContractAddress(),
                toWei(amount),
              ],
            );
            amount.add(result as string);
          } catch (e) {
            console.error(e);
          }
        }
      }
      return amount.toFixed(0);
    };
    setLoading(true);
    run()
      .then(value => {
        setExpected(value);
      })
      .finally(() => {
        setLoading(false);
      });
    console.log(pool, amounts);
  }, [pool, amounts]);

  return (
    <div className="tw-border tw-shadow tw-my-4 tw-p-4 tw-bg-white tw-text-black">
      <div className="tw-font-bold tw-text-sm">
        <LoadableValue
          loading={loading}
          value={
            <Text ellipsize tagName="span">
              {weiTo4(expectedPoolTokens)}
            </Text>
          }
          tooltip={weiTo18(expectedPoolTokens)}
        />
      </div>
      <div className="tw-text-sm">{t(translations.liquidity.token)}</div>
    </div>
  );
}
