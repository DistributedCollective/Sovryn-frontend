import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { bignumber } from 'mathjs';
import moment from 'moment';
import { translations } from '../../../../../locales/i18n';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { useAccount } from '../../../../hooks/useAccount';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';

export function PoolTable() {
  const { t } = useTranslation();

  const liquidityProvided = useCacheCallWithValue(
    'escrowRewards',
    'getUserBalance',
    '0',
    useAccount(),
  );

  const totalDeposit = useCacheCallWithValue(
    'escrowRewards',
    'totalDeposit',
    '0',
  );

  const getReward = useCacheCallWithValue(
    'escrowRewards',
    'getReward',
    '0',
    useAccount(),
  );

  const releaseTime = useCacheCallWithValue(
    'escrowRewards',
    'releaseTime',
    '0',
  );

  console.log(totalDeposit);

  const reward = useMemo(() => {
    return bignumber(liquidityProvided.value)
      .mul(5 / 100)
      .add(liquidityProvided.value)
      .toFixed(0);
  }, [liquidityProvided.value]);

  const share = useMemo(() => {
    return bignumber(liquidityProvided.value)
      .sub(totalDeposit.value)
      .mul(100)
      .toFixed(4);
  }, [totalDeposit.value, liquidityProvided.value]);

  return (
    <div className="border rounded-lg p-3">
      <table className="sovryn-table">
        <thead>
          <tr>
            <th>{t(translations.escrowPage.table.labels.pool)}</th>
            <th>{t(translations.escrowPage.table.labels.provided)}</th>
            <th>{t(translations.escrowPage.table.labels.share)}</th>
            <th>{t(translations.escrowPage.table.labels.totalFees)}</th>
            <th>{t(translations.escrowPage.table.labels.minimumRewards)}</th>
            <th>{t(translations.escrowPage.table.labels.unlockDate)}</th>
            <th>{t(translations.escrowPage.table.labels.action)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t(translations.escrowPage.table.uniswapPool)}</td>
            <td>
              <LoadableValue
                loading={liquidityProvided.loading}
                value={<>{weiToNumberFormat(liquidityProvided.value, 4)} SOV</>}
              />
            </td>
            <td>
              <LoadableValue
                loading={liquidityProvided.loading || totalDeposit.loading}
                value={<>{weiToNumberFormat(Number(share), 4)} %</>}
              />
            </td>
            <td>
              <LoadableValue
                loading={getReward.loading}
                value={<>{weiToNumberFormat(getReward.value, 4)} SOV</>}
              />
            </td>
            <td>
              <LoadableValue
                loading={liquidityProvided.loading}
                value={<>{weiToNumberFormat(reward, 4)} SOV</>}
              />
            </td>
            <td>
              <LoadableValue
                loading={releaseTime.loading}
                value={<>{formatDate(releaseTime.value)}</>}
              />
            </td>
            <td>
              <Button disabled>
                {t(translations.escrowPage.table.withdrawButton)}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function formatDate(timestamp: string) {
  return moment(Number(timestamp) * 1e3).format('DD-MM-YY');
}

const Button = styled.button`
  background: transparent;
  border: none;
  color: #fec004;
  font-weight: 300;
  text-transform: none;
  font-size: 14px;
  cursor: pointer;
  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
