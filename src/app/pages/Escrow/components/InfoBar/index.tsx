import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { Text, Tooltip } from '@blueprintjs/core';
import Countdown from 'react-countdown';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { bignumber } from 'mathjs';
import moment from 'moment';

const countdownRenderer = ({
  formatted: { days, hours, minutes, seconds },
  completed,
}) => {
  if (completed) {
    return <Trans i18nKey={translations.escrowPage.infoBar.timeCompleted} />;
  }
  return (
    <>
      {days} : {hours} : {minutes} : {seconds}
    </>
  );
};

export function InfoBar() {
  const { t } = useTranslation();

  const releaseTime = useCacheCallWithValue(
    'escrowRewards',
    'releaseTime',
    '0',
  );

  const depositLimit = useCacheCallWithValue(
    'escrowRewards',
    'depositLimit',
    '75000000000000000000000',
  );

  const totalDeposit = useCacheCallWithValue(
    'escrowRewards',
    'totalDeposit',
    '0',
  );

  const remaining = useMemo(() => {
    const value = bignumber(depositLimit.value)
      .sub(totalDeposit.value)
      .toFixed(0);
    return bignumber(value).greaterThan(0) ? value : '0';
  }, [depositLimit.value, totalDeposit.value]);

  return (
    <>
      <StyledInfoBar>
        <div className="">
          <Text ellipsize tagName="p">
            {t(translations.escrowPage.infoBar.timeRemaining)}
          </Text>
          <Text ellipsize tagName="p">
            <LoadableValue
              loading={releaseTime.loading}
              value={
                <>
                  {releaseTime.value !== '0' && (
                    <Tooltip
                      content={
                        <>
                          {moment(Number(releaseTime.value) * 1e3).format(
                            'YYYY-MM-DD HH:mm:ss',
                          )}
                        </>
                      }
                    >
                      <Countdown
                        date={Number(releaseTime.value) * 1e3}
                        renderer={countdownRenderer}
                        zeroPadTime={2}
                        zeroPadDays={2}
                      />
                    </Tooltip>
                  )}
                </>
              }
            />
          </Text>
        </div>
        <div className="">
          <Text ellipsize tagName="p">
            {t(translations.escrowPage.infoBar.liquidityTarget)}
          </Text>
          <Text ellipsize tagName="p">
            <LoadableValue
              loading={depositLimit.loading}
              value={<>{weiToNumberFormat(depositLimit.value)} SOV</>}
            />{' '}
          </Text>
        </div>
        <div className="last">
          <Text ellipsize tagName="p" className="title">
            {t(translations.escrowPage.infoBar.remainingToCollect)}
          </Text>
          <Text ellipsize tagName="p" className="value">
            <LoadableValue
              loading={depositLimit.loading || totalDeposit.loading}
              value={<>{weiToNumberFormat(remaining)} SOV</>}
            />{' '}
          </Text>
        </div>
      </StyledInfoBar>
    </>
  );
}

const StyledInfoBar = styled.div.attrs(() => ({
  className: 'row',
}))`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #d9d9d9;
  padding-top: 10px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 6px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 38px;
  p {
    font-size: 13px;
    font-weight: 300;
    margin-bottom: 0;
    &:last-child {
      font-size: 18px;
      margin-bottom: 0;
      font-weight: 400;
      margin-top: 2px;
    }
  }
  .col {
    padding: 0 7px;
    @media (max-width: 1280px) {
      flex-basis: 33%;
    }
  }
  @media only screen and (max-width: 640px) {
    & .col {
      flex-basis: 50%;
      & p:first-child {
        margin-bottom: 5px;
      }
      margin-bottom: 25px;
    }
  }
  & .last {
    color: #fec004;
    & .title {
      font-weight: 300;
      letter-spacing: 0.6px;
    }
    & .value {
      font-weight: 600;
    }
  }
`;
