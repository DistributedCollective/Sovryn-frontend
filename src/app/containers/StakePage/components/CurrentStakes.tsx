import React, { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { Asset } from '../../../../types/asset';
import moment from 'moment-timezone';
import logoSvg from 'assets/images/sovryn-icon.svg';
import { useAccount } from '../../../hooks/useAccount';
import { numberToUSD } from 'utils/display-text/format';
import { StyledTable } from './StyledTable';
import { translations } from 'locales/i18n';
import { AddressBadge } from '../../../components/AddressBadge';
import { contractReader } from 'utils/sovryn/contract-reader';
import { LoadableValue } from '../../../components/LoadableValue';
import { useTranslation } from 'react-i18next';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { useCachedAssetPrice } from '../../../hooks/trading/useCachedAssetPrice';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { useStaking_WEIGHT_FACTOR } from '../../../hooks/staking/useStaking_WEIGHT_FACTOR';
import { numberFromWei, weiToFixed } from 'utils/blockchain/math-helpers';
import { useStaking_computeWeightByDate } from '../../../hooks/staking/useStaking_computeWeightByDate';

interface Stakes {
  onIncrease: (a: number, b: number) => void;
  onExtend: (a: number, b: number) => void;
  onUnstake: (a: number, b: number) => void;
  onDelegate: (a: number) => void;
}

export function CurrentStakes(props: Stakes) {
  const { t } = useTranslation();
  const account = useAccount();
  const getStakes = useStaking_getStakes(account);
  const [stakesArray, setStakesArray] = useState([]);
  const [stakeLoad, setStakeLoad] = useState(false);
  const dates = getStakes.value['dates'];
  const stakes = getStakes.value['stakes'];

  useEffect(() => {
    async function getStakesEvent() {
      try {
        Promise.all(
          dates.map(async (value, index) => {
            const delegate = await contractReader
              .call('staking', 'delegates', [account, value])
              .then(res => {
                if (res.toString().toLowerCase() !== account.toLowerCase()) {
                  return res;
                }
                return false;
              });
            return [stakes[index], value, delegate];
          }),
        ).then(result => {
          setStakesArray(result as any);
        });
        setStakeLoad(false);
      } catch (e) {
        console.error(e);
      }
    }
    if (dates && stakes !== undefined) {
      setStakeLoad(true);
      getStakesEvent().finally(() => {
        setStakeLoad(false);
      });
    }

    return () => {
      setStakesArray([]);
    };
  }, [account, getStakes.value, dates, stakes]);
  return (
    <>
      <p className="tw-font-semibold tw-text-lg tw-ml-6 tw-mb-4 tw-mt-6">
        {t(translations.stake.currentStakes.title)}
      </p>
      <div className="tw-bg-gray-light tw-rounded-b tw-shadow">
        <div className="tw-rounded-lg tw-border tw-sovryn-table tw-pt-1 tw-pb-0 tw-pr-5 tw-pl-5 tw-mb-5 tw-max-h-96 tw-overflow-y-auto">
          <StyledTable className="tw-w-full tw-text-white">
            <thead>
              <tr>
                <th className="tw-text-left assets">
                  {t(translations.stake.currentStakes.asset)}
                </th>
                <th className="tw-text-left">
                  {t(translations.stake.currentStakes.lockedAmount)}
                </th>
                <th className="tw-text-left tw-font-normal tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentStakes.votingPower)}
                </th>
                <th className="tw-text-left tw-font-normal tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentStakes.votingDelegation)}
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentStakes.stakingPeriod)}
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentStakes.unlockDate)}
                </th>
                <th className="tw-text-left tw-hidden md:tw-table-cell tw-w-1/5">
                  {t(translations.stake.actions.title)}
                </th>
              </tr>
            </thead>
            <tbody className="tw-mt-5 tw-font-montserrat tw-text-xs">
              {stakeLoad && !stakesArray.length && (
                <tr>
                  <td colSpan={99} className="tw-text-center tw-font-normal">
                    {t(translations.stake.loading)}
                  </td>
                </tr>
              )}
              {!stakeLoad && !stakesArray.length && (
                <tr>
                  <td colSpan={99} className="tw-text-center tw-font-normal">
                    {t(translations.stake.nostake)}
                  </td>
                </tr>
              )}
              {stakesArray.map((item, index) => {
                console.log(item);

                return (
                  <>
                    <AssetRow
                      item={item}
                      key={item}
                      onIncrease={props.onIncrease}
                      onExtend={props.onExtend}
                      onUnstake={props.onUnstake}
                      onDelegate={props.onDelegate}
                    />
                  </>
                );
              })}
            </tbody>
          </StyledTable>
        </div>
      </div>
    </>
  );
}

interface AssetProps {
  item: any[] | any;
  onIncrease: (a: number, b: number) => void;
  onExtend: (a: number, b: number) => void;
  onUnstake: (a: number, b: number) => void;
  onDelegate: (a: number) => void;
}

function AssetRow(props: AssetProps) {
  const { t } = useTranslation();
  const now = new Date();
  const [weight, setWeight] = useState('');
  const locked = Number(props.item[1]) > Math.round(now.getTime() / 1e3); //check if date is locked
  const [votingPower, setVotingPower] = useState<number>(0 as any);
  const WEIGHT_FACTOR = useStaking_WEIGHT_FACTOR();
  const getWeight = useStaking_computeWeightByDate(
    Number(props.item[1]),
    Math.round(now.getTime() / 1e3),
  );

  const SOV = AssetsDictionary.get(Asset.SOV);
  const dollars = useCachedAssetPrice(Asset.SOV, Asset.USDT);
  const dollarValue = bignumber(Number(props.item[0]))
    .mul(dollars.value)
    .div(10 ** SOV.decimals);
  useEffect(() => {
    setWeight(getWeight.value);
    if (Number(WEIGHT_FACTOR.value) && Number(weight)) {
      setVotingPower(
        (Number(props.item[0]) * Number(weight)) / Number(WEIGHT_FACTOR.value),
      );
    }
  }, [getWeight.value, weight, props.item, WEIGHT_FACTOR.value]);
  return (
    <tr>
      <td>
        <div className="assetname tw-flex tw-items-center">
          <div>
            <img src={logoSvg} className="tw-ml-3 tw-mr-3" alt="sov" />
          </div>
          <div className="tw-text-sm tw-font-normal tw-hidden xl:tw-block tw-pl-3">
            SOV
          </div>
        </div>
      </td>
      <td className="tw-text-left tw-font-normal">
        {weiToNumberFormat(props.item[0])} SOV
        <br />≈{' '}
        <LoadableValue
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollars.loading}
        />
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
        {numberFromWei(votingPower)}
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
        {props.item[2].length && (
          <AddressBadge
            txHash={props.item[2]}
            startLength={6}
            className="tw-text-theme-blue"
          />
        )}
        {!props.item[2].length && (
          <p>{t(translations.stake.delegation.noDelegate)}</p>
        )}
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
        {locked && (
          <>
            {Math.abs(
              moment().diff(
                moment(new Date(parseInt(props.item[1]) * 1e3)),
                'days',
              ),
            )}{' '}
            days
          </>
        )}
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
        <p>
          {moment
            .tz(new Date(parseInt(props.item[1]) * 1e3), 'GMT')
            .format('DD/MM/YYYY - h:mm:ss a z')}
        </p>
      </td>
      <td className="md:tw-text-left lg:tw-text-right tw-hidden md:tw-table-cell">
        <div className="tw-flex tw-flex-nowrap">
          <button
            type="button"
            className={`tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat ${
              !locked &&
              'tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent'
            }`}
            onClick={() => props.onIncrease(props.item[0], props.item[1])}
            disabled={!locked}
          >
            {t(translations.stake.actions.increase)}
          </button>
          <button
            type="button"
            className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat"
            onClick={() => props.onExtend(props.item[0], props.item[1])}
          >
            {t(translations.stake.actions.extend)}
          </button>
          <button
            type="button"
            className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat"
            onClick={() => props.onUnstake(props.item[0], props.item[1])}
          >
            {t(translations.stake.actions.unstake)}
          </button>
          <button
            className={`tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat ${
              !locked && 'tw-opacity-50 tw-cursor-not-allowed'
            }`}
            onClick={() => props.onDelegate(props.item[1])}
            disabled={!locked}
          >
            {t(translations.stake.actions.delegate)}
          </button>
        </div>
      </td>
    </tr>
  );
}
