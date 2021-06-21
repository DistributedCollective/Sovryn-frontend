/**
 *
 * StakePage
 *
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Rsk3 from '@rsksmart/rsk3';
import { Tooltip } from '@blueprintjs/core';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { getUSDSum } from 'utils/helpers';
import { numberFromWei, weiToFixed } from 'utils/blockchain/math-helpers';
import { getContract } from 'utils/blockchain/contract-helpers';
import { numberToUSD } from 'utils/display-text/format';
import { contractReader } from 'utils/sovryn/contract-reader';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import {
  staking_allowance,
  staking_approve,
  staking_withdrawFee,
  staking_numTokenCheckpoints,
} from 'utils/blockchain/requests/staking';
import { Asset } from '../../../types';
import { Modal } from '../../components/Modal';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { CurrentVests } from './components/CurrentVests';
import { CurrentStakes } from './components/CurrentStakes';
import { DelegateForm } from './components/DelegateForm';
import { LoadableValue } from '../../components/LoadableValue';
import { ExtendStakeForm } from './components/ExtendStakeForm';
import { IncreaseStakeForm } from './components/IncreaseStakeForm';
import { WithdrawForm } from './components/WithdrawForm';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { HistoryEventsTable } from './components/HistoryEventsTable';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { useStaking_getStakes } from '../../hooks/staking/useStaking_getStakes';
import { useStaking_kickoffTs } from '../../hooks/staking/useStaking_kickoffTs';
import { useStaking_balanceOf } from '../../hooks/staking/useStaking_balanceOf';
import { useStaking_WEIGHT_FACTOR } from '../../hooks/staking/useStaking_WEIGHT_FACTOR';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { useStaking_getCurrentVotes } from '../../hooks/staking/useStaking_getCurrentVotes';
import { useStaking_getAccumulatedFees } from '../../hooks/staking/useStaking_getAccumulatedFees';
import { useStaking_computeWeightByDate } from '../../hooks/staking/useStaking_computeWeightByDate';
import { StakeForm } from './components/StakeForm';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { useStakeIncrease } from '../../hooks/staking/useStakeIncrease';
import { useStakeStake } from '../../hooks/staking/useStakeStake';
import { useStakeWithdraw } from '../../hooks/staking/useStakeWithdraw';
import { useStakeExtend } from '../../hooks/staking/useStakeExtend';
import { useStakeDelegate } from '../../hooks/staking/useStakeDelegate';
import { useMaintenance } from 'app/hooks/useMaintenance';

const now = new Date();

export function StakePage() {
  const { t } = useTranslation();

  const isConnected = useIsConnected();
  if (isConnected) {
    return <InnerStakePage />;
  }
  return (
    <>
      <Helmet>
        <title>{t(translations.stake.title)}</title>
        <meta name="description" content={t(translations.stake.meta)} />
      </Helmet>
      <Header />
      <main>
        <div className="tw-bg-gray-700 tw-tracking-normal">
          <div className="tw-container tw-mx-auto tw-px-6">
            <h2 className="tw-text-white tw-pt-8 tw-pb-5 tw-pl-10">
              {t(translations.stake.title)}
            </h2>
            <div className="tw-w-full bg-gray-light tw-text-center tw-rounded-b tw-shadow tw-p-3">
              <i>{t(translations.stake.connect)}</i>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InnerStakePage() {
  const { t } = useTranslation();
  const account = useAccount();
  const [amount, setAmount] = useState('');
  const weiAmount = useWeiAmount(amount);
  const [weight, setWeight] = useState('');
  const kickoffTs = useStaking_kickoffTs();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const getStakes = useStaking_getStakes(account);
  const balanceOf = useStaking_balanceOf(account);
  const WEIGHT_FACTOR = useStaking_WEIGHT_FACTOR();
  const [stakeAmount, setStakeAmount] = useState(0);
  const [stakeForm, setStakeForm] = useState(false);
  const [extendForm, setExtendForm] = useState(false);
  const [until, setUntil] = useState<number>(0 as any);
  const [delegateForm, setDelegateForm] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState(false);
  const [increaseForm, setIncreaseForm] = useState(false);
  const voteBalance = useStaking_getCurrentVotes(account);
  const [lockDate, setLockDate] = useState<number>(0 as any);
  const [timestamp, setTimestamp] = useState<number>(0 as any);
  const [votingPower, setVotingPower] = useState<number>(0 as any);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0 as any);
  const weiWithdrawAmount = useWeiAmount(withdrawAmount);
  const [prevTimestamp, setPrevTimestamp] = useState<number>(undefined as any);
  const getWeight = useStaking_computeWeightByDate(
    Number(lockDate),
    Math.round(now.getTime() / 1e3),
  );
  const [usdTotal, setUsdTotal] = useState(0) as any;
  const assets = AssetsDictionary.list();
  const sovBalanceOf = useAssetBalanceOf(Asset.SOV);
  const { increase, ...increaseTx } = useStakeIncrease();
  const { stake, ...stakeTx } = useStakeStake();
  const { extend, ...extendTx } = useStakeExtend();
  const { withdraw, ...withdrawTx } = useStakeWithdraw();
  const { delegate, ...delegateTx } = useStakeDelegate();

  const { checkMaintenance, States } = useMaintenance();
  const stakingLocked = checkMaintenance(States.STAKING);

  useEffect(() => {
    if (timestamp && weiAmount && (stakeForm || increaseForm || extendForm)) {
      setLockDate(timestamp);
      setWeight(getWeight.value);
      setVotingPower(
        (Number(weiAmount) * Number(weight)) / Number(WEIGHT_FACTOR.value),
      );
    } else {
      setLockDate(timestamp);
      setWeight('');
      setVotingPower(0);
    }
  }, [
    getWeight.value,
    weight,
    stakeForm,
    WEIGHT_FACTOR.value,
    weiAmount,
    timestamp,
    increaseForm,
    extendForm,
  ]);

  //Form Validations
  const validateStakeForm = useCallback(() => {
    if (loading || stakeTx.loading) return false;
    const num = Number(amount);

    if (!num || isNaN(num) || num <= 0) return false;
    if (!timestamp || timestamp < Math.round(now.getTime() / 1e3)) return false;
    return num * 1e18 <= Number(sovBalanceOf.value);
  }, [loading, amount, sovBalanceOf, timestamp, stakeTx.loading]);

  const validateDelegateForm = useCallback(() => {
    if (loading) return false;
    if (!timestamp || timestamp < Math.round(now.getTime() / 1e3)) return false;
    return Rsk3.utils.isAddress(address.toLowerCase());
  }, [loading, address, timestamp]);

  const validateIncreaseForm = useCallback(() => {
    if (loading || increaseTx.loading) return false;
    const num = Number(amount);
    if (!num || isNaN(num) || num <= 0) return false;
    return num * 1e18 <= Number(sovBalanceOf.value);
  }, [loading, amount, sovBalanceOf, increaseTx.loading]);

  const validateWithdrawForm = useCallback(
    amount => {
      if (loading) return false;
      const num = Number(withdrawAmount);
      if (!num || isNaN(num) || num <= 0) return false;
      return num <= Number(amount);
    },
    [withdrawAmount, loading],
  );
  const validateExtendTimeForm = useCallback(() => {
    if (loading || extendTx.loading || timestamp === prevTimestamp)
      return false;
    return timestamp >= Math.round(now.getTime() / 1e3);
  }, [loading, timestamp, extendTx.loading, prevTimestamp]);

  //Submit Forms
  const handleWithdrawSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!withdrawTx.loading) {
        if (bignumber(weiWithdrawAmount).greaterThan(stakeAmount)) {
          withdraw(stakeAmount.toString(), until);
        } else {
          withdraw(weiWithdrawAmount, until);
        }
      }
      setLoading(false);
      setWithdrawForm(!withdrawForm);
    },
    [
      weiWithdrawAmount,
      until,
      withdrawForm,
      stakeAmount,
      withdrawTx.loading,
      withdraw,
    ],
  );

  const handleStakeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      let nonce = await contractReader.nonce(account);
      const allowance = (await staking_allowance(account)) as string;
      if (bignumber(allowance).lessThan(weiAmount)) {
        await staking_approve(sovBalanceOf.value);
        nonce += 1;
      }
      if (!stakeTx.loading) {
        stake(weiAmount, timestamp + 3600, nonce);
        setLoading(false);
        setStakeForm(!stakeForm);
      }
    },
    [
      weiAmount,
      sovBalanceOf.value,
      account,
      timestamp,
      stakeForm,
      stakeTx.loading,
      stake,
    ],
  );

  const handleDelegateSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!delegateTx.loading) {
        delegate(address.toLowerCase(), Number(timestamp));
        setLoading(false);
        setDelegateForm(!delegateForm);
      }
    },
    [address, timestamp, delegateForm, delegateTx.loading, delegate],
  );

  const handleIncreaseStakeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      let nonce = await contractReader.nonce(account);
      const allowance = (await staking_allowance(account)) as string;
      if (bignumber(allowance).lessThan(weiAmount)) {
        await staking_approve(weiAmount);
        nonce += 1;
      }
      if (!increaseTx.loading) {
        increase(weiAmount, timestamp, nonce);
        setLoading(false);
        setIncreaseForm(!increaseForm);
      }
    },
    [weiAmount, account, timestamp, increaseForm, increaseTx.loading, increase],
  );

  const handleExtendTimeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!extendTx.loading) {
        extend(Number(prevTimestamp), Number(timestamp) + 3600);
        setLoading(false);
        setExtendForm(!extendForm);
      }
    },
    [prevTimestamp, timestamp, extendForm, extendTx.loading, extend],
  );

  let usdTotalValue = [] as any;
  const updateUsdTotal = e => {
    usdTotalValue.push(e);
    setUsdTotal(getUSDSum(usdTotalValue));
  };

  return (
    <>
      <Helmet>
        <title>{t(translations.stake.title)}</title>
      </Helmet>
      <Header />
      <main>
        <div className="tw-bg-gray-700 tw-tracking-normal">
          <div className="tw-container tw-mx-auto tw-px-6">
            <h2 className="tw-text-white tw-pt-8 tw-pb-5 tw-pl-10">
              {t(translations.stake.title)}
            </h2>
            <div className="xl:tw-flex tw-items-stretch tw-justify-around tw-mt-2">
              <div className="xl:tw-mx-2 tw-bg-gray-800 tw-staking-box tw-p-8 tw-pb-6 tw-rounded-2xl xl:tw-w-1/4 tw-mb-5 xl:tw-mb-0">
                <p className="tw-text-lg tw--mt-1">
                  {t(translations.stake.total)}
                </p>
                <p
                  className={`xl:tw-text-4-5xl tw-text-3xl tw-mt-2 tw-mb-6 ${
                    balanceOf.loading && 'skeleton'
                  }`}
                >
                  {numberFromWei(balanceOf.value).toLocaleString()} SOV
                </p>
                <Modal
                  show={stakeForm}
                  content={
                    <>
                      <StakeForm
                        handleSubmit={handleStakeSubmit}
                        amount={amount}
                        timestamp={timestamp}
                        onChangeAmount={e => setAmount(e)}
                        onChangeTimestamp={e => setTimestamp(e)}
                        sovBalanceOf={sovBalanceOf}
                        isValid={validateStakeForm()}
                        kickoff={kickoffTs}
                        stakes={getStakes.value['dates']}
                        votePower={votingPower}
                        onCloseModal={() => setStakeForm(!stakeForm)}
                      />
                    </>
                  }
                />
                {sovBalanceOf.value !== '0' && !stakingLocked ? (
                  <button
                    type="button"
                    className="tw-bg-gold tw-font-normal tw-bg-opacity-10 hover:tw-text-gold focus:tw-outline-none focus:tw-bg-opacity-50 hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out tw-text-lg tw-text-gold hover:tw-text-gray-light tw-py-3 tw-px-8 tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-gold tw-rounded-xl"
                    onClick={() => {
                      setTimestamp(0);
                      setAmount('');
                      setStakeForm(!stakeForm);
                      setExtendForm(false);
                      setIncreaseForm(false);
                      setWithdrawForm(false);
                    }}
                  >
                    {t(translations.stake.addStake)}
                  </button>
                ) : (
                  <Tooltip
                    position="bottom"
                    hoverOpenDelay={0}
                    hoverCloseDelay={0}
                    interactionKind="hover"
                    content={
                      <>
                        {stakingLocked
                          ? t(translations.maintenance.staking)
                          : t(translations.stake.noUnlockedSov)}
                      </>
                    }
                  >
                    <button
                      type="button"
                      className="tw-bg-gold tw-font-normal tw-bg-opacity-10 hover:tw-text-gold tw-transition tw-duration-500 tw-ease-in-out tw-text-lg tw-text-gold  tw-py-3 tw-px-8 tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-gold tw-rounded-xl tw-bg-transparent tw-opacity-50 tw-cursor-not-allowed"
                    >
                      {t(translations.stake.addStake)}
                    </button>
                  </Tooltip>
                )}
              </div>
              <div className="xl:tw-mx-2 tw-bg-gray-800 tw-staking-box tw-p-8 tw-pb-6 tw-rounded-2xl w-full xl:tw-w-1/4 tw-text-sm tw-mb-5 xl:tw-mb-0">
                <p className="tw-text-lg tw--mt-1">
                  {t(translations.stake.feeTitle)}
                </p>
                <p className="tw-text-4-5xl tw-mt-2 tw-mb-6">
                  ≈ {numberToUSD(usdTotal, 4)}
                </p>
                {assets.map((item, i) => {
                  if (item.asset === 'CSOV') return '';
                  return (
                    <FeeBlock
                      usdTotal={e => updateUsdTotal(e)}
                      key={i}
                      contractToken={item}
                    />
                  );
                })}
              </div>
              <div className="xl:tw-mx-2 tw-bg-gray-800 tw-staking-box tw-p-8 tw-pb-6 tw-rounded-2xl tw-w-full xl:tw-w-1/4 tw-mb-5 xl:tw-mb-0">
                <p className="tw-text-lg tw--mt-1">
                  {t(translations.stake.votingPower)}
                </p>
                <p
                  className={`xl:tw-text-4-5xl tw-text-3xl tw-mt-2 tw-mb-6 ${
                    voteBalance.loading && 'skeleton'
                  }`}
                >
                  {numberFromWei(voteBalance.value).toLocaleString()}
                </p>
                <div className="tw-flex tw-flex-col tw-items-start">
                  <Link
                    to={'/'}
                    className="tw-bg-gold tw-font-normal tw-bg-opacity-10 tw-hover:text-gold tw-focus:outline-none tw-focus:bg-opacity-50 hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out tw-px-8 tw-py-3 tw-text-lg tw-text-gold tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-gold tw-rounded-xl hover:tw-no-underline tw-no-underline tw-inline-block"
                  >
                    {t(translations.stake.viewGovernance)}
                  </Link>
                </div>
              </div>
            </div>
            <Modal
              show={delegateForm}
              content={
                <>
                  <DelegateForm
                    handleSubmit={handleDelegateSubmit}
                    address={address}
                    timestamp={Number(timestamp)}
                    onChangeAddress={e => setAddress(e)}
                    isValid={validateDelegateForm()}
                    onCloseModal={() => setDelegateForm(!delegateForm)}
                  />
                </>
              }
            />
            <CurrentStakes
              onDelegate={a => {
                setTimestamp(a);
                setDelegateForm(!delegateForm);
              }}
              onExtend={(a, b) => {
                setPrevTimestamp(b);
                setTimestamp(b);
                setAmount(numberFromWei(a).toString());
                setStakeForm(false);
                setExtendForm(true);
                setIncreaseForm(false);
                setWithdrawForm(false);
              }}
              onIncrease={(a, b) => {
                setTimestamp(b);
                setAmount(numberFromWei(a).toString());
                setUntil(b);
                setStakeForm(false);
                setExtendForm(false);
                setIncreaseForm(true);
                setWithdrawForm(false);
              }}
              onUnstake={(a, b) => {
                setAmount(numberFromWei(a).toString());
                setWithdrawAmount(0);
                setStakeAmount(a);
                setTimestamp(b);
                setUntil(b);
                setStakeForm(false);
                setExtendForm(false);
                setIncreaseForm(false);
                setWithdrawForm(true);
              }}
            />
            <CurrentVests
              onDelegate={a => {
                setTimestamp(a);
                setDelegateForm(!delegateForm);
              }}
            />
            <HistoryEventsTable />
          </div>
          <TxDialog tx={increaseTx} />
          <TxDialog tx={stakeTx} />
          <TxDialog tx={extendTx} />
          <TxDialog tx={withdrawTx} />
          <TxDialog tx={delegateTx} />
          <>
            {balanceOf.value !== '0' && (
              <>
                {increaseForm === true && (
                  <Modal
                    show={increaseForm}
                    content={
                      <>
                        <IncreaseStakeForm
                          handleSubmit={handleIncreaseStakeSubmit}
                          amount={amount}
                          timestamp={timestamp}
                          onChangeAmount={e => setAmount(e)}
                          sovBalanceOf={sovBalanceOf}
                          isValid={validateIncreaseForm()}
                          balanceOf={balanceOf}
                          votePower={votingPower}
                          onCloseModal={() => setIncreaseForm(!increaseForm)}
                        />
                      </>
                    }
                  />
                )}
                {extendForm === true && (
                  <Modal
                    show={extendForm}
                    content={
                      <>
                        {kickoffTs.value !== '0' && (
                          <ExtendStakeForm
                            handleSubmit={handleExtendTimeSubmit}
                            amount={amount}
                            timestamp={0}
                            onChangeTimestamp={e => setTimestamp(e)}
                            sovBalanceOf={sovBalanceOf}
                            kickoff={kickoffTs}
                            isValid={validateExtendTimeForm()}
                            stakes={getStakes.value['dates']}
                            balanceOf={balanceOf}
                            votePower={votingPower}
                            prevExtend={prevTimestamp}
                            onCloseModal={() => setExtendForm(!extendForm)}
                          />
                        )}
                      </>
                    }
                  />
                )}
                {withdrawForm === true && (
                  <Modal
                    show={withdrawForm}
                    content={
                      <>
                        <WithdrawForm
                          handleSubmit={handleWithdrawSubmit}
                          withdrawAmount={withdrawAmount}
                          amount={amount}
                          until={timestamp}
                          onChangeAmount={e => setWithdrawAmount(e)}
                          sovBalanceOf={sovBalanceOf}
                          balanceOf={balanceOf}
                          isValid={validateWithdrawForm(amount)}
                          onCloseModal={() => setWithdrawForm(!withdrawForm)}
                        />
                      </>
                    }
                  />
                )}
              </>
            )}
          </>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface FeeProps {
  contractToken: any;
  usdTotal: (e: any) => void;
}

function FeeBlock({ contractToken, usdTotal }: FeeProps) {
  const account = useAccount();
  const { t } = useTranslation();
  const token = (contractToken.asset +
    (contractToken.asset === Asset.SOV ? '_token' : '_lending')) as any;
  const dollars = useCachedAssetPrice(contractToken.asset, Asset.USDT);
  const tokenAddress = getContract(token)?.address;
  const currency = useStaking_getAccumulatedFees(account, tokenAddress);
  const dollarValue = useMemo(() => {
    if (currency.value === null) return '';
    return bignumber(currency.value)
      .mul(dollars.value)
      .div(10 ** contractToken.decimals)
      .toFixed(0);
  }, [dollars.value, currency.value, contractToken.decimals]);

  const handleWithdrawFee = useCallback(
    async e => {
      e.preventDefault();
      try {
        const numTokenCheckpoints = (await staking_numTokenCheckpoints(
          tokenAddress,
        )) as string;
        await staking_withdrawFee(tokenAddress, numTokenCheckpoints, account);
      } catch (e) {
        console.error(e);
      }
    },
    [tokenAddress, account],
  );

  useEffect(() => {
    usdTotal(Number(weiToFixed(dollarValue, 4)));
  }, [currency.value, dollarValue, usdTotal]);

  return (
    <>
      {Number(currency.value) > 0 && (
        <div className="tw-flex tw-justify-between tw-items-center tw-mb-1 tw-mt-1 tw-leading-6">
          <div className="w-1/5">
            {contractToken.asset !== Asset.SOV ? (
              <Tooltip
                content={
                  <>{contractToken.asset} will be sent to the lending pool.</>
                }
              >
                <>i{contractToken.asset} (?)</>
              </Tooltip>
            ) : (
              <>{contractToken.asset}</>
            )}
          </div>
          <div className="tw-w-1/2 tw-ml-6">
            {numberFromWei(currency.value).toFixed(6)} ≈{' '}
            <LoadableValue
              value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
              loading={dollars.loading}
            />
          </div>
          <button
            onClick={handleWithdrawFee}
            type="button"
            className="tw-text-gold hover:tw-text-gold tw-p-0 tw-text-normal tw-lowercase hover:tw-underline tw-font-medium tw-font-montserrat tw-tracking-normal"
          >
            {t(translations.userAssets.actions.withdraw)}
          </button>
        </div>
      )}
    </>
  );
}
