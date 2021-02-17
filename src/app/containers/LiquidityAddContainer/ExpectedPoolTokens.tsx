import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@blueprintjs/core';
import { LoadableValue } from '../../components/LoadableValue';
import { weiTo4, weiTo18 } from '../../../utils/blockchain/math-helpers';
import { translations } from '../../../locales/i18n';
import { useExpectedPoolTokens } from '../../hooks/amm/useExpectedPoolTokens';
import { Asset } from '../../../types/asset';

interface Props {
  pool: Asset;
  asset: Asset;
  amount: string;
}

export function ExpectedPoolTokens({ pool, asset, amount }: Props) {
  const { t } = useTranslation();
  const expectedPoolTokens = useExpectedPoolTokens(pool, asset, amount);
  return (
    <div className="border shadow my-3 p-3 bg-white text-black">
      <div className="row">
        <div className="col">
          <div className="font-weight-bold small">
            <LoadableValue
              loading={expectedPoolTokens.loading}
              value={
                <Text ellipsize tagName="span">
                  {weiTo4(expectedPoolTokens.value)}
                </Text>
              }
              tooltip={weiTo18(expectedPoolTokens.value)}
            />
          </div>
          <div className="small">{t(translations.liquidity.token)}</div>
        </div>
      </div>
    </div>
  );
}
